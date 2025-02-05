import { StateGraph } from "@langchain/langgraph";
import { StateAnnotation } from "./state.js";
import {
  makeOrchestratorNode,
  makeTravelAdvisorNode,
  weatherNode,
  flightsNode,
} from "@/agent/agents.js";

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
