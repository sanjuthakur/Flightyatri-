import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { chatRouter } from "./routes/chat.js";
import { flightsRouter } from "./routes/flights.js";
import { healthRouter } from "./routes/health.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_ORIGIN === "*" ? true : env.CLIENT_ORIGIN
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "FlightYatri API",
    description: "India-focused flight status and conversational query backend.",
    docs: {
      health: "/health",
      routeSearch: "/api/v1/flights?from=DEL&to=BOM&date=2026-03-20&adults=1",
      status: "/api/v1/flights/status?flightNumber=AI101",
      airports: "/api/v1/flights/airports?query=del",
      highlights: "/api/v1/flights/highlights",
      chat: "POST /api/v1/chat"
    }
  });
});

app.use("/health", healthRouter);
app.use("/api/v1/flights", flightsRouter);
app.use("/api/v1/chat", chatRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});
