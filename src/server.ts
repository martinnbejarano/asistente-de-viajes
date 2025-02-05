import { config } from "dotenv";
import { resolve } from "path";
import express from "express";
import cors from "cors";
import router from "./routes/index.js";

const result = config({
  path: resolve(__dirname, "../.env"),
});

if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
}
console.log("a");
console.log("Environment variables loaded:", {
  PORT: process.env.PORT,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY?.slice(0, 10) + "...",
  RAPID_API_KEY: process.env.RAPID_API_KEY?.slice(0, 10) + "...",
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api", router);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
