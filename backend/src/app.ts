import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
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
    docs: {
      health: "/health",
      flights: "/api/v1/flights?from=DEL&to=BOM&date=2026-03-20&adults=1",
      airports: "/api/v1/flights/airports?query=del"
    }
  });
});

app.use("/health", healthRouter);
app.use("/api/v1/flights", flightsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

