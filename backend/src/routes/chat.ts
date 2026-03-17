import { Router } from "express";
import { z } from "zod";
import {
  findAirport,
  findFlightsByNumber,
  findFlightsByRoute,
  normalizeFlightNumber
} from "../data/flights.js";

const chatSchema = z.object({
  message: z.string().trim().min(2).max(300)
});

function extractFlightNumber(message: string) {
  const match = message.toUpperCase().match(/\b([A-Z0-9]{2,3})[-\s]?(\d{2,4})\b/);
  if (!match) {
    return null;
  }

  return normalizeFlightNumber(`${match[1]}${match[2]}`);
}

function extractRoute(message: string) {
  const routeMatch = message.match(/from\s+([a-zA-Z\s]{3,})\s+to\s+([a-zA-Z\s]{3,})/i);
  if (!routeMatch) {
    return null;
  }

  const from = findAirport(routeMatch[1].trim());
  const to = findAirport(routeMatch[2].trim());

  if (!from || !to) {
    return null;
  }

  return { from, to };
}

export const chatRouter = Router();

chatRouter.post("/", (req, res) => {
  const result = chatSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "A message is required to query the chat assistant.",
      errors: result.error.issues
    });
  }

  const message = result.data.message;
  const normalizedFlightNumber = extractFlightNumber(message);

  if (normalizedFlightNumber) {
    const matches = findFlightsByNumber(normalizedFlightNumber);

    if (matches.length === 1) {
      const [flight] = matches;

      return res.status(200).json({
        intent: "flight_status",
        reply: `${flight.flightNumber} is currently ${flight.statusLabel.toLowerCase()}. Scheduled departure ${flight.scheduledDeparture}, estimated departure ${flight.estimatedDeparture}, terminal ${flight.departureTerminal}${flight.departureGate ? `, gate ${flight.departureGate}` : ""}. ${flight.notes}`,
        flight,
        freshness: {
          updatedAt: flight.lastUpdated,
          disclaimer: "Live operational data may change in real time. Verify with the airline or airport display for critical updates."
        }
      });
    }

    if (matches.length > 1) {
      return res.status(200).json({
        intent: "clarification",
        reply: "Multiple flights matched that number. Please add route or date so I can narrow it down safely.",
        matches: matches.map((flight) => ({
          flightNumber: flight.flightNumber,
          from: flight.from,
          to: flight.to,
          airline: flight.airline
        }))
      });
    }
  }

  const route = extractRoute(message);
  if (route) {
    const matches = findFlightsByRoute(route.from.code, route.to.code).slice(0, 5);

    if (matches.length === 0) {
      return res.status(200).json({
        intent: "route_search",
        reply: `I could not find a supported flight for ${route.from.city} to ${route.to.city} in the current feed. Please try a flight number or another route.`
      });
    }

    return res.status(200).json({
      intent: "route_search",
      reply: `I found ${matches.length} flights from ${route.from.city} to ${route.to.city}. The first match is ${matches[0].flightNumber} on ${matches[0].airline}, currently ${matches[0].statusLabel.toLowerCase()}.`,
      flights: matches
    });
  }

  return res.status(200).json({
    intent: "fallback",
    reply:
      "Ask for a flight number like AI101 or a route like flights from Delhi to Mumbai. I will avoid guessing when the query is ambiguous."
  });
});
