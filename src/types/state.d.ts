export enum OrchestratorState {
  IDLE = "IDLE",
  WEATHER = "WEATHER",
  FLIGHTS = "FLIGHTS",
  LLM = "LLM",
}

interface WeatherResponse {
  temperature?: number;
  condition?: string;
  location?: string;
}

interface FlightsResponse {
  origin?: string;
  destination?: string;
  price?: number;
  departureDate?: string;
  returnDate?: string;
}

interface LLMResponse {
  content?: string;
  type?: string;
}
