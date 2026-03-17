export type Airport = {
  code: string;
  city: string;
  name: string;
  country: string;
};

export type FlightStatus =
  | "scheduled"
  | "boarding"
  | "departed"
  | "in_air"
  | "arrived"
  | "delayed"
  | "cancelled";

export type Flight = {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departureTerminal: string;
  arrivalTerminal: string;
  departureGate: string | null;
  arrivalGate: string | null;
  scheduledDeparture: string;
  estimatedDeparture: string;
  scheduledArrival: string;
  estimatedArrival: string;
  durationMinutes: number;
  priceInr: number;
  availableSeats: number;
  status: FlightStatus;
  statusLabel: string;
  notes: string;
  lastUpdated: string;
  coverage: "departing_india" | "arriving_india" | "domestic_india";
  date: string;
  freshness: {
    updatedAt: string;
    disclaimer: string;
  };
};

export type RouteSearchResponse = {
  total: number;
  from: string;
  to: string;
  date: string;
  adults: number;
  freshness: {
    source: string;
    indiaCoverage: string;
  };
  flights: Flight[];
};

export type FlightStatusResponse = {
  flight: Flight;
  source: string;
};

export type ChatResponse = {
  intent: "flight_status" | "route_search" | "clarification" | "fallback";
  reply: string;
  flight?: Flight;
  flights?: Flight[];
  matches?: Array<{
    flightNumber: string;
    from: string;
    to: string;
    airline: string;
  }>;
  freshness?: {
    updatedAt: string;
    disclaimer: string;
  };
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

async function handleJson<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload as T;
}

export async function searchFlights(params: {
  from: string;
  to: string;
  date: string;
  adults: number;
}) {
  const query = new URLSearchParams({
    from: params.from.toUpperCase(),
    to: params.to.toUpperCase(),
    date: params.date,
    adults: String(params.adults)
  });

  const response = await fetch(`${API_BASE}/api/v1/flights?${query.toString()}`);
  return handleJson<RouteSearchResponse>(response);
}

export async function getFlightStatus(flightNumber: string) {
  const query = new URLSearchParams({
    flightNumber: flightNumber.toUpperCase()
  });

  const response = await fetch(`${API_BASE}/api/v1/flights/status?${query.toString()}`);
  return handleJson<FlightStatusResponse>(response);
}

export async function searchAirports(query: string) {
  const response = await fetch(`${API_BASE}/api/v1/flights/airports?query=${encodeURIComponent(query)}`);
  return handleJson<{ total: number; airports: Airport[] }>(response);
}

export async function getHighlights() {
  const response = await fetch(`${API_BASE}/api/v1/flights/highlights`);
  return handleJson<{ updatedAt: string; flights: Flight[] }>(response);
}

export async function getRouteSuggestions() {
  const response = await fetch(`${API_BASE}/api/v1/flights/routes/suggestions`);
  return handleJson<{ suggestions: Array<{ from: string; to: string; label: string }> }>(response);
}

export async function askAssistant(message: string) {
  const response = await fetch(`${API_BASE}/api/v1/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  return handleJson<ChatResponse>(response);
}
