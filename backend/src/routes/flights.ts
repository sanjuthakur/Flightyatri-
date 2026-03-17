import { Router } from "express";
import { z } from "zod";
import {
  airports,
  featuredFlightNumbers,
  findAirport,
  findFlightsByNumber,
  findFlightsByRoute,
  flights,
  normalizeFlightNumber
} from "../data/flights.js";

const routeSearchSchema = z.object({
  from: z.string().trim().min(3).max(3).transform((value) => value.toUpperCase()),
  to: z.string().trim().min(3).max(3).transform((value) => value.toUpperCase()),
  date: z.string().date(),
  adults: z.coerce.number().int().min(1).max(9).default(1)
});

const airportsSchema = z.object({
  query: z.string().trim().min(1)
});

const flightNumberSchema = z.object({
  flightNumber: z.string().trim().min(2),
  date: z.string().date().optional()
});

function buildFreshness(lastUpdated: string) {
  return {
    updatedAt: lastUpdated,
    disclaimer: "Operational flight data can change in real time. Verify with the airline or airport display for critical updates."
  };
}

function serializeFlight(flight: (typeof flights)[number], date?: string) {
  return {
    ...flight,
    date: date ?? new Date().toISOString().slice(0, 10),
    freshness: buildFreshness(flight.lastUpdated)
  };
}

export const flightsRouter = Router();

flightsRouter.get("/", (req, res) => {
  const result = routeSearchSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: result.error.issues
    });
  }

  const { from, to, date, adults } = result.data;
  const matches = findFlightsByRoute(from, to, adults).map((flight) => serializeFlight(flight, date));

  return res.status(200).json({
    total: matches.length,
    from,
    to,
    date,
    adults,
    freshness: {
      source: "Mock live operations feed",
      indiaCoverage: "Flights arriving into India, departing from India, and key domestic routes."
    },
    flights: matches
  });
});

flightsRouter.get("/status", (req, res) => {
  const result = flightNumberSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "flightNumber is required",
      errors: result.error.issues
    });
  }

  const { flightNumber, date } = result.data;
  const matches = findFlightsByNumber(flightNumber);

  if (matches.length === 0) {
    return res.status(404).json({
      message: "Flight not found",
      guidance: "No supported flight matched that number. Please verify the airline code and number."
    });
  }

  if (matches.length > 1) {
    return res.status(409).json({
      message: "Multiple flights matched. Please add route or date context.",
      matches: matches.map((flight) => ({
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        from: flight.from,
        to: flight.to
      }))
    });
  }

  return res.status(200).json({
    flight: serializeFlight(matches[0], date),
    source: "Mock live operations feed"
  });
});

flightsRouter.get("/airports", (req, res) => {
  const result = airportsSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "query is required"
    });
  }

  const query = result.data.query.toLowerCase();
  const matches = airports
    .filter(
      (airport) =>
        airport.code.toLowerCase().includes(query) ||
        airport.city.toLowerCase().includes(query) ||
        airport.name.toLowerCase().includes(query) ||
        airport.country.toLowerCase().includes(query)
    )
    .slice(0, 8);

  return res.status(200).json({
    total: matches.length,
    airports: matches
  });
});

flightsRouter.get("/highlights", (_req, res) => {
  const highlighted = featuredFlightNumbers
    .map((flightNumber) => flights.find((flight) => normalizeFlightNumber(flight.flightNumber) === flightNumber))
    .filter((flight): flight is (typeof flights)[number] => Boolean(flight))
    .map((flight) => serializeFlight(flight));

  return res.status(200).json({
    updatedAt: new Date().toISOString(),
    flights: highlighted
  });
});

flightsRouter.get("/routes/suggestions", (_req, res) => {
  const suggestions = [
    ["DEL", "BOM"],
    ["BOM", "DEL"],
    ["BLR", "DXB"],
    ["DXB", "DEL"],
    ["SIN", "HYD"],
    ["HYD", "MAA"]
  ].map(([fromCode, toCode]) => {
    const from = findAirport(fromCode);
    const to = findAirport(toCode);

    return {
      from: fromCode,
      to: toCode,
      label: `${from?.city ?? fromCode} to ${to?.city ?? toCode}`
    };
  });

  return res.status(200).json({ suggestions });
});
