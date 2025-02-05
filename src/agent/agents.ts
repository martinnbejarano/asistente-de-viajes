import { ChatAnthropic } from "@langchain/anthropic";
import { StateGraph, Command } from "@langchain/langgraph";
import { getFlightPrice } from "@/tools/flights/index.js";
import { getFutureWeather } from "@/tools/weather/index.js";
import { StateAnnotation } from "@/agent/state.js";
import { toolSchema, advisorSchema } from "./schemas.js";
import { ORCHESTRATOR_PROMPT, ADVISOR_PROMPT } from "@/agent/prompts.js";

const llm = new ChatAnthropic({
  model: "claude-3-sonnet-20240229",
  apiKey: process.env.ANTHROPIC_API_KEY as string,
});

const makeOrchestratorNode = () => {
  return async (state: typeof StateAnnotation.State) => {
    const response = await llm.withStructuredOutput(toolSchema).invoke([
      {
        role: "system",
        content: ORCHESTRATOR_PROMPT,
      },
      ...state.messages,
    ]);

    return new Command({
      goto: response.tool,
      update: {
        messages: { role: "assistant", content: response.response },
        orchestrator: response.tool,
      },
    });
  };
};

const makeTravelAdvisorNode = () => {
  return async (state: typeof StateAnnotation.State) => {
    const weatherInfo = state.weatherApiResponse;
    const flightInfo = state.flightsApiResponse;

    const contextPrompt = `
      Current weather information: ${weatherInfo?.temperature}°C, ${weatherInfo?.condition} in ${weatherInfo?.location}
      Flight details: ${flightInfo?.origin} to ${flightInfo?.destination}, Price: ${flightInfo?.price}
      Departure: ${flightInfo?.departureDate}, Return: ${flightInfo?.returnDate}
    `;

    const response = await llm.withStructuredOutput(advisorSchema).invoke([
      {
        role: "system",
        content: ADVISOR_PROMPT + contextPrompt,
      },
      ...state.messages,
    ]);

    return new Command({
      goto: "orchestrator",
      update: { messages: { role: "assistant", content: response.response } },
    });
  };
};

const weatherNode = async (state: typeof StateAnnotation.State) => {
  const { location, date } = state.weatherApiResponse;

  if (!location || !date) {
    throw new Error("Location and date must be defined");
  }

  const weather = await getFutureWeather(location, new Date(date));

  return new Command({
    goto: "orchestrator",
    update: { weatherApiResponse: weather },
  });
};

const flightsNode = async (state: typeof StateAnnotation.State) => {
  const { origin, destination, departureDate, returnDate } =
    state.flightsApiResponse;
  if (!origin || !destination || !departureDate || !returnDate) {
    throw new Error(
      "Origin, destination, departureDate, and returnDate must be defined"
    );
  }

  const flights = await getFlightPrice(
    origin,
    destination,
    new Date(departureDate),
    new Date(returnDate)
  );

  return new Command({
    goto: "orchestrator",
    update: { flightsApiResponse: flights },
  });
};

export const createGraph = () => {
  const graph = new StateGraph(StateAnnotation)
    .addNode("orchestrator", makeOrchestratorNode())
    .addNode("recommendations", makeTravelAdvisorNode())
    .addNode("weather", weatherNode)
    .addNode("flights", flightsNode)
    .setEntryPoint("orchestrator")
    .addEdge("orchestrator", "weather")
    .addEdge("orchestrator", "flights")
    .addEdge("orchestrator", "recommendations")
    .addEdge("weather", "orchestrator")
    .addEdge("flights", "orchestrator")
    .addEdge("recommendations", "orchestrator")
    .compile();

  return graph;
};

export {
  makeOrchestratorNode,
  makeTravelAdvisorNode,
  weatherNode,
  flightsNode,
};
