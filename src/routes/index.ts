import { Router } from "express";
import { ChatController } from "@/controllers/chatController.js";

const router = Router();

router.post("/chat", (req, res) => ChatController.chat(req, res));

export default router;
