import { Request, Response } from "express";
import { HumanMessage } from "@langchain/core/messages";
import { createGraph } from "@/agent/graph.js";

interface ChatRequest {
  message: string;
}

export class ChatController {
  private static graph = createGraph();

  public static async chat(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.message) {
        res.status(400).json({
          success: false,
          error: "Message is required",
        });
        return;
      }

      const { message } = req.body as ChatRequest;
      const config = { messages: [new HumanMessage(message)] };
      const result = await ChatController.graph.invoke(config);

      res.status(200).json({
        success: true,
        response: result.messages[result.messages.length - 1].content,
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
}
