import { z } from "zod";

export const toolSchema = z.object({
  response: z.string(),
  tool: z.enum(["weather", "flights", "recommendations", "__end__"]),
  params: z.record(z.any()).optional(),
});

export const advisorSchema = z.object({
  response: z.string(),
  goto: z.enum(["orchestrator", "__end__"]),
});

export const weatherParamsSchema = z.object({
  location: z.string(),
  date: z.string(),
});

export const flightParamsSchema = z.object({
  from: z.string(),
  to: z.string(),
  departDate: z.string(),
  returnDate: z.string(),
});
