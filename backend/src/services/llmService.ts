import OpenAI from 'openai';
import { z } from 'zod';

const openaiApiKey = process.env.OPENAI_API_KEY;

export const FlightQuerySchema = z.object({
  intent: z.enum(['flight_status', 'route_search', 'airport_info', 'general_help']),
  flightNumber: z.string().optional(),
  departureAirport: z.string().optional(),
  arrivalAirport: z.string().optional(),
  date: z.string().optional(),
  confidence: z.number().min(0).max(1),
});

export type FlightQuery = z.infer<typeof FlightQuerySchema>;

export class LLMService {
  private openai: OpenAI;

  constructor() {
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    this.openai = new OpenAI({
      apiKey: openaiApiKey,
    });
  }

  async parseFlightQuery(message: string): Promise<FlightQuery> {
    try {
      const systemPrompt = `You are a flight information assistant. Parse the user's message and extract flight-related information.

Return a JSON object with the following structure:
{
  "intent": "flight_status" | "route_search" | "airport_info" | "general_help",
  "flightNumber": "extracted flight number like AI101, 6E203, etc." (optional),
  "departureAirport": "IATA code or city name" (optional),
  "arrivalAirport": "IATA code or city name" (optional),
  "date": "YYYY-MM-DD format if mentioned" (optional),
  "confidence": number between 0-1 indicating confidence in parsing
}

Intent types:
- flight_status: User wants status of a specific flight (e.g., "Is AI101 on time?")
- route_search: User wants flights between two places (e.g., "Flights from Delhi to Mumbai")
- airport_info: User wants general airport information
- general_help: General questions or unclear queries

Extract IATA codes when possible (DEL, BOM, BLR, etc.) or city names.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.1,
        max_tokens: 200,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const parsed = JSON.parse(content);
      return FlightQuerySchema.parse(parsed);
    } catch (error) {
      console.error('Error parsing flight query with LLM:', error);
      // Fallback to basic parsing if LLM fails
      return this.fallbackParse(message);
    }
  }

  async generateResponse(query: FlightQuery, flightData?: any): Promise<string> {
    try {
      let context = '';
      if (flightData) {
        context = `Flight data: ${JSON.stringify(flightData)}\n\n`;
      }

      const systemPrompt = `You are a helpful flight assistant. Generate a natural, conversational response based on the parsed query and available flight data.

Keep responses concise but informative. Include relevant details like status, times, terminals, gates, and any delays.
If no flight data is available, suggest alternatives or ask for clarification.
Always mention that data may change and should be verified with the airline.`;

      const userPrompt = `Query: ${JSON.stringify(query)}\n\n${context}Generate a helpful response for the user.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      const content = response.choices[0]?.message?.content;
      return content || 'I apologize, but I encountered an issue generating a response. Please try again.';
    } catch (error) {
      console.error('Error generating response with LLM:', error);
      return 'I apologize, but I encountered an issue. Please try rephrasing your question.';
    }
  }

  private fallbackParse(message: string): FlightQuery {
    // Basic regex-based fallback parsing
    const flightNumberMatch = message.toUpperCase().match(/\b([A-Z0-9]{2,3})[-\s]?(\d{2,4})\b/);
    const routeMatch = message.match(/from\s+([a-zA-Z\s]{3,})\s+to\s+([a-zA-Z\s]{3,})/i);

    if (flightNumberMatch) {
      return {
        intent: 'flight_status',
        flightNumber: `${flightNumberMatch[1]}${flightNumberMatch[2]}`,
        confidence: 0.8,
      };
    }

    if (routeMatch) {
      return {
        intent: 'route_search',
        departureAirport: routeMatch[1].trim(),
        arrivalAirport: routeMatch[2].trim(),
        confidence: 0.7,
      };
    }

    return {
      intent: 'general_help',
      confidence: 0.3,
    };
  }
}