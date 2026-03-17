import axios from 'axios';
import { z } from 'zod';

const aviationStackApiKey = process.env.AVIATIONSTACK_API_KEY;
const aviationStackBaseUrl = 'http://api.aviationstack.com/v1';

export const FlightAPISchema = z.object({
  flight_date: z.string(),
  flight_status: z.string(),
  departure: z.object({
    airport: z.string().nullable(),
    timezone: z.string().nullable(),
    iata: z.string().nullable(),
    icao: z.string().nullable(),
    terminal: z.string().nullable(),
    gate: z.string().nullable(),
    delay: z.number().nullable(),
    scheduled: z.string().nullable(),
    estimated: z.string().nullable(),
    actual: z.string().nullable(),
    estimated_runway: z.string().nullable(),
    actual_runway: z.string().nullable(),
  }),
  arrival: z.object({
    airport: z.string().nullable(),
    timezone: z.string().nullable(),
    iata: z.string().nullable(),
    icao: z.string().nullable(),
    terminal: z.string().nullable(),
    gate: z.string().nullable(),
    baggage: z.string().nullable(),
    delay: z.number().nullable(),
    scheduled: z.string().nullable(),
    estimated: z.string().nullable(),
    actual: z.string().nullable(),
    estimated_runway: z.string().nullable(),
    actual_runway: z.string().nullable(),
  }),
  airline: z.object({
    name: z.string().nullable(),
    iata: z.string().nullable(),
    icao: z.string().nullable(),
  }),
  flight: z.object({
    number: z.string().nullable(),
    iata: z.string().nullable(),
    icao: z.string().nullable(),
    codeshared: z.any().nullable(), // Make this more flexible
  }),
  aircraft: z.any().nullable(), // Make this more flexible
  live: z.any().nullable(), // Make this more flexible
});

export type FlightAPIData = z.infer<typeof FlightAPISchema>;

export class FlightAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    if (!aviationStackApiKey) {
      throw new Error('AVIATIONSTACK_API_KEY environment variable is required');
    }
    this.apiKey = aviationStackApiKey;
    this.baseUrl = aviationStackBaseUrl;
  }

  async getFlightByNumber(flightNumber: string): Promise<FlightAPIData[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/flights`, {
        params: {
          access_key: this.apiKey,
          flight_iata: flightNumber,
          limit: 10,
        },
      });

      const validatedData = z.array(FlightAPISchema).parse(response.data.data);
      return validatedData;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      throw new Error('Failed to fetch flight data from API');
    }
  }

  async getFlightsByRoute(depIata: string, arrIata: string, date?: string): Promise<FlightAPIData[]> {
    try {
      // AviationStack free tier doesn't support route filtering
      // Instead, we'll get general flights and filter client-side
      const params: any = {
        access_key: this.apiKey,
        limit: 100, // Get more data to filter from
      };

      if (date) {
        params.flight_date = date;
      }

      const response = await axios.get(`${this.baseUrl}/flights`, {
        params,
      });

      const allFlights = z.array(FlightAPISchema).parse(response.data.data);

      // Filter flights that match the route
      const filteredFlights = allFlights.filter(flight =>
        flight.departure.iata === depIata && flight.arrival.iata === arrIata
      );

      return filteredFlights.slice(0, 10); // Return up to 10 matches
    } catch (error) {
      console.error('Error fetching flight data:', error);
      throw new Error('Failed to fetch flight data from API');
    }
  }

  async getFlightsByAirport(airportIata: string, type: 'departure' | 'arrival' = 'departure'): Promise<FlightAPIData[]> {
    try {
      const params: any = {
        access_key: this.apiKey,
        limit: 20,
      };

      if (type === 'departure') {
        params.dep_iata = airportIata;
      } else {
        params.arr_iata = airportIata;
      }

      const response = await axios.get(`${this.baseUrl}/flights`, {
        params,
      });

      const validatedData = z.array(FlightAPISchema).parse(response.data.data);
      return validatedData;
    } catch (error) {
      console.error('Error fetching flight data:', error);
      throw new Error('Failed to fetch flight data from API');
    }
  }
}