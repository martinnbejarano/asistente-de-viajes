import { Annotation, messagesStateReducer } from "@langchain/langgraph";
import { BaseMessage, BaseMessageLike } from "@langchain/core/messages";
import {
  OrchestratorState,
  WeatherResponse,
  FlightsResponse,
  LLMResponse,
} from "@/types/state.js";

export const GraphAnnotation = Annotation.Root({
  messages: Annotation<BaseMessage[], BaseMessageLike[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  orchestrator: Annotation<OrchestratorState>({
    reducer: (curr: OrchestratorState | undefined, next: OrchestratorState) =>
      next ?? OrchestratorState.IDLE,
    default: () => OrchestratorState.IDLE,
  }),
  weatherApiResponse: Annotation<WeatherResponse>({
    reducer: (curr: WeatherResponse | undefined, next: WeatherResponse) => ({
      ...curr,
      ...next,
    }),
    default: () => ({}),
  }),
  flightsApiResponse: Annotation<FlightsResponse>({
    reducer: (curr: FlightsResponse | undefined, next: FlightsResponse) => ({
      ...curr,
      ...next,
    }),
    default: () => ({}),
  }),
  llmApiResponse: Annotation<LLMResponse>({
    reducer: (curr: LLMResponse | undefined, next: LLMResponse) => next,
    default: () => ({}),
  }),
});

export default GraphAnnotation;
