import { StateGraph, START } from "@langchain/langgraph";
import { StateAnnotation } from "@/agent/state.js";
import { OrchestratorState } from "@/types/state.js";
import {
  makeOrchestratorNode,
  makeTravelAdvisorNode,
  weatherNode,
  flightsNode,
} from "@/agent/agents.js";

const orchestratorRoute = (state: typeof StateAnnotation.State) => {
  switch (state.orchestrator) {
    case OrchestratorState.WEATHER:
      return "weather";
    case OrchestratorState.FLIGHTS:
      return "flights";
    case OrchestratorState.LLM:
      return "recommendations";
    default:
      return "__end__";
  }
};

export const createGraph = () => {
  const graph = new StateGraph(StateAnnotation)
    .addNode("orchestrator", makeOrchestratorNode(), {
      ends: ["weather", "flights", "recommendations", "__end__"],
    })
    .addNode("recommendations", makeTravelAdvisorNode(), {
      ends: ["orchestrator", "__end__"],
    })
    .addNode("weather", weatherNode, {
      ends: ["orchestrator"],
    })
    .addNode("flights", flightsNode, {
      ends: ["orchestrator"],
    })
    .addEdge(START, "orchestrator")
    .addConditionalEdges("orchestrator", orchestratorRoute)
    .addEdge("weather", "orchestrator")
    .addEdge("flights", "orchestrator")
    .addEdge("recommendations", "orchestrator")
    .compile();

  return graph;
};
