import { Router } from "express";
import { z } from "zod";
import { LLMService, FlightQuery } from "../services/llmService.js";
import { FlightAPI } from "../services/flightAPI.js";
import { findAirport } from "../data/flights.js";

const chatSchema = z.object({
  message: z.string().trim().min(2).max(300)
});

// Initialize services
const llmService = new LLMService();
const flightAPI = new FlightAPI();

export const chatRouter = Router();

chatRouter.post("/", async (req, res) => {
  try {
    const result = chatSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "A message is required to query the chat assistant.",
        errors: result.error.issues
      });
    }

    const message = result.data.message;

    // Parse the query using LLM
    const query = await llmService.parseFlightQuery(message);

    let flightData = null;
    let responseData: any = {
      intent: query.intent,
      confidence: query.confidence,
    };

    try {
      // Fetch real flight data based on the parsed query
      if (query.intent === 'flight_status' && query.flightNumber) {
        flightData = await flightAPI.getFlightByNumber(query.flightNumber);
      } else if (query.intent === 'route_search' && query.departureAirport && query.arrivalAirport) {
        // Try to find airport codes
        const depAirport = findAirport(query.departureAirport);
        const arrAirport = findAirport(query.arrivalAirport);

        if (depAirport && arrAirport) {
          flightData = await flightAPI.getFlightsByRoute(depAirport.code, arrAirport.code, query.date);
        } else {
          // Try with the provided strings directly (might be IATA codes)
          flightData = await flightAPI.getFlightsByRoute(query.departureAirport, query.arrivalAirport, query.date);
        }
      }
    } catch (apiError) {
      console.error('Flight API error:', apiError);
      // Continue with LLM response generation even if API fails
    }

    // Generate natural language response using LLM
    const reply = await llmService.generateResponse(query, flightData);

    responseData.reply = reply;

    // Add flight data if available
    if (flightData && flightData.length > 0) {
      responseData.flights = flightData.slice(0, 5); // Limit to 5 results
      responseData.freshness = {
        updatedAt: new Date().toISOString(),
        disclaimer: "Live operational data may change in real time. Verify with the airline or airport display for critical updates."
      };
    }

    return res.status(200).json(responseData);

  } catch (error) {
    console.error('Chat processing error:', error);
    return res.status(500).json({
      intent: "error",
      reply: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
});
