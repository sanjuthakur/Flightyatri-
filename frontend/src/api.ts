export type Flight = {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  priceInr: number;
  availableSeats: number;
  date: string;
};

export type SearchResponse = {
  total: number;
  from: string;
  to: string;
  date: string;
  adults: number;
  flights: Flight[];
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function searchFlights(params: {
  from: string;
  to: string;
  date: string;
  adults: number;
}): Promise<SearchResponse> {
  const query = new URLSearchParams({
    from: params.from.toUpperCase(),
    to: params.to.toUpperCase(),
    date: params.date,
    adults: String(params.adults)
  });

  const response = await fetch(`${API_BASE}/api/v1/flights?${query.toString()}`);
  if (!response.ok) {
    throw new Error("Unable to search flights");
  }

  return response.json() as Promise<SearchResponse>;
}

