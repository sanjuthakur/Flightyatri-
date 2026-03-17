import { Router } from "express";
import { z } from "zod";
import { airports, flights } from "../data/flights.js";

const searchSchema = z.object({
  from: z.string().trim().toUpperCase().length(3),
  to: z.string().trim().toUpperCase().length(3),
  date: z.string().date(),
  adults: z.coerce.number().int().min(1).max(9).default(1)
});

export const flightsRouter = Router();

flightsRouter.get("/", (req, res) => {
  const result = searchSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
      errors: result.error.issues
    });
  }

  const { from, to, date, adults } = result.data;

  const availableFlights = flights
    .filter((flight) => flight.from === from && flight.to === to && flight.availableSeats >= adults)
    .map((flight) => ({
      ...flight,
      date
    }));

  return res.status(200).json({
    total: availableFlights.length,
    from,
    to,
    date,
    adults,
    flights: availableFlights
  });
});

const airportsSchema = z.object({
  query: z.string().trim().min(1)
});

flightsRouter.get("/airports", (req, res) => {
  const result = airportsSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({
      message: "Query is required"
    });
  }

  const query = result.data.query.toLowerCase();
  const matches = airports.filter((airport) => {
    return (
      airport.code.toLowerCase().includes(query) ||
      airport.city.toLowerCase().includes(query) ||
      airport.name.toLowerCase().includes(query)
    );
  });

  return res.status(200).json({
    total: matches.length,
    airports: matches
  });
});

