import { Router } from "express";
import { z } from "zod";
import { FlightAPI } from "../services/flightAPI.js";
import {
  airports,
  featuredFlightNumbers,
  findAirport,
  normalizeFlightNumber
} from "../data/flights.js";

const routeSearchSchema = z.object({
  from: z.string().trim().min(3).max(3).transform((value) => value.toUpperCase()),
  to: z.string().trim().min(3).max(3).transform((value) => value.toUpperCase()),
  date: z.string().optional(),
  adults: z.coerce.number().int().min(1).max(9).default(1)
});

const airportsSchema = z.object({
  query: z.string().trim().min(1)
});

const flightNumberSchema = z.object({
  flightNumber: z.string().trim().min(2),
  date: z.string().date().optional()
});

// Initialize flight API service
const flightAPI = new FlightAPI();

export const flightsRouter = Router();

flightsRouter.get("/", async (req, res) => {
  try {
    const result = routeSearchSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid query parameters",
        errors: result.error.issues
      });
    }

    const { from, to, date, adults } = result.data;

    // Fetch real flight data from AviationStack API
    const flightData = await flightAPI.getFlightsByRoute(from, to, date);

    return res.status(200).json({
      total: flightData.length,
      from,
      to,
      date,
      adults,
      freshness: {
        source: "AviationStack Live API",
        updatedAt: new Date().toISOString(),
        disclaimer: "Live operational data may change in real time. Verify with the airline or airport display for critical updates."
      },
      flights: flightData.slice(0, 10) // Limit to 10 results
    });
  } catch (error) {
    console.error('Flight search error:', error);
    return res.status(500).json({
      message: "Failed to fetch flight data",
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});

flightsRouter.get("/status", async (req, res) => {
  try {
    const result = flightNumberSchema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        message: "flightNumber is required",
        errors: result.error.issues
      });
    }

    const { flightNumber, date } = result.data;

    // Fetch real flight data from AviationStack API
    const flightData = await flightAPI.getFlightByNumber(flightNumber);

    if (flightData.length === 0) {
      return res.status(404).json({
        message: "Flight not found",
        guidance: "No flight matched that number. Please verify the flight number."
      });
    }

    return res.status(200).json({
      total: flightData.length,
      flightNumber,
      freshness: {
        source: "AviationStack Live API",
        updatedAt: new Date().toISOString(),
        disclaimer: "Live operational data may change in real time. Verify with the airline or airport display for critical updates."
      },
      flights: flightData
    });
  } catch (error) {
    console.error('Flight status error:', error);
    return res.status(500).json({
      message: "Failed to fetch flight status",
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
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
