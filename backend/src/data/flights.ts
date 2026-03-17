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

export type FlightRecord = {
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
};

export const airports: Airport[] = [
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport", country: "India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport", country: "India" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International Airport", country: "India" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International Airport", country: "India" },
  { code: "MAA", city: "Chennai", name: "Chennai International Airport", country: "India" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International Airport", country: "India" },
  { code: "DXB", city: "Dubai", name: "Dubai International Airport", country: "UAE" },
  { code: "SIN", city: "Singapore", name: "Singapore Changi Airport", country: "Singapore" },
  { code: "LHR", city: "London", name: "Heathrow Airport", country: "United Kingdom" },
  { code: "JFK", city: "New York", name: "John F. Kennedy International Airport", country: "USA" }
];

export const flights: FlightRecord[] = [
  {
    id: "FYT-101",
    airline: "Air India",
    flightNumber: "AI101",
    from: "DEL",
    to: "BOM",
    departureTerminal: "T3",
    arrivalTerminal: "T2",
    departureGate: "22",
    arrivalGate: "B4",
    scheduledDeparture: "06:20",
    estimatedDeparture: "06:20",
    scheduledArrival: "08:35",
    estimatedArrival: "08:35",
    durationMinutes: 135,
    priceInr: 5420,
    availableSeats: 12,
    status: "boarding",
    statusLabel: "Boarding",
    notes: "Boarding started on time. Check-in counters close 45 minutes before departure.",
    lastUpdated: "2026-03-17T08:15:00.000Z",
    coverage: "domestic_india"
  },
  {
    id: "FYT-102",
    airline: "IndiGo",
    flightNumber: "6E203",
    from: "DEL",
    to: "BOM",
    departureTerminal: "T1",
    arrivalTerminal: "T1",
    departureGate: "14",
    arrivalGate: "C2",
    scheduledDeparture: "18:15",
    estimatedDeparture: "18:45",
    scheduledArrival: "20:25",
    estimatedArrival: "20:55",
    durationMinutes: 130,
    priceInr: 6180,
    availableSeats: 6,
    status: "delayed",
    statusLabel: "Delayed",
    notes: "Departure delayed by 30 minutes because of inbound aircraft rotation.",
    lastUpdated: "2026-03-17T09:05:00.000Z",
    coverage: "domestic_india"
  },
  {
    id: "FYT-103",
    airline: "Vistara",
    flightNumber: "UK955",
    from: "BOM",
    to: "DEL",
    departureTerminal: "T2",
    arrivalTerminal: "T3",
    departureGate: "48",
    arrivalGate: "A8",
    scheduledDeparture: "11:30",
    estimatedDeparture: "11:30",
    scheduledArrival: "13:45",
    estimatedArrival: "13:38",
    durationMinutes: 135,
    priceInr: 7090,
    availableSeats: 9,
    status: "in_air",
    statusLabel: "In air",
    notes: "Flight departed on time and is tracking slightly ahead of schedule.",
    lastUpdated: "2026-03-17T09:20:00.000Z",
    coverage: "domestic_india"
  },
  {
    id: "FYT-201",
    airline: "IndiGo",
    flightNumber: "6E512",
    from: "BLR",
    to: "DXB",
    departureTerminal: "T1",
    arrivalTerminal: "T1",
    departureGate: "31",
    arrivalGate: "D7",
    scheduledDeparture: "22:10",
    estimatedDeparture: "22:10",
    scheduledArrival: "00:55",
    estimatedArrival: "00:55",
    durationMinutes: 225,
    priceInr: 15450,
    availableSeats: 18,
    status: "scheduled",
    statusLabel: "Scheduled",
    notes: "International departure from India. Live gate changes may occur closer to departure.",
    lastUpdated: "2026-03-17T07:40:00.000Z",
    coverage: "departing_india"
  },
  {
    id: "FYT-202",
    airline: "Emirates",
    flightNumber: "EK516",
    from: "DXB",
    to: "DEL",
    departureTerminal: "T3",
    arrivalTerminal: "T3",
    departureGate: "B11",
    arrivalGate: "8",
    scheduledDeparture: "09:55",
    estimatedDeparture: "10:20",
    scheduledArrival: "14:35",
    estimatedArrival: "14:57",
    durationMinutes: 220,
    priceInr: 19800,
    availableSeats: 4,
    status: "delayed",
    statusLabel: "Delayed",
    notes: "Arriving into India with a revised arrival time due to a departure hold in Dubai.",
    lastUpdated: "2026-03-17T09:10:00.000Z",
    coverage: "arriving_india"
  },
  {
    id: "FYT-301",
    airline: "Singapore Airlines",
    flightNumber: "SQ528",
    from: "SIN",
    to: "HYD",
    departureTerminal: "T2",
    arrivalTerminal: "International",
    departureGate: "F53",
    arrivalGate: "G6",
    scheduledDeparture: "20:35",
    estimatedDeparture: "20:35",
    scheduledArrival: "22:10",
    estimatedArrival: "22:10",
    durationMinutes: 245,
    priceInr: 23600,
    availableSeats: 7,
    status: "scheduled",
    statusLabel: "Scheduled",
    notes: "Fresh live feed is available. Gate details are subject to airport operations updates.",
    lastUpdated: "2026-03-17T06:55:00.000Z",
    coverage: "arriving_india"
  },
  {
    id: "FYT-302",
    airline: "Akasa Air",
    flightNumber: "QP1103",
    from: "HYD",
    to: "MAA",
    departureTerminal: "Domestic",
    arrivalTerminal: "Domestic",
    departureGate: "19",
    arrivalGate: "4",
    scheduledDeparture: "18:20",
    estimatedDeparture: "18:20",
    scheduledArrival: "19:35",
    estimatedArrival: "19:35",
    durationMinutes: 75,
    priceInr: 3820,
    availableSeats: 21,
    status: "scheduled",
    statusLabel: "Scheduled",
    notes: "Short-haul domestic connection with normal operations.",
    lastUpdated: "2026-03-17T08:00:00.000Z",
    coverage: "domestic_india"
  },
  {
    id: "FYT-401",
    airline: "British Airways",
    flightNumber: "BA135",
    from: "LHR",
    to: "BOM",
    departureTerminal: "T5",
    arrivalTerminal: "T2",
    departureGate: "C66",
    arrivalGate: null,
    scheduledDeparture: "13:10",
    estimatedDeparture: "13:10",
    scheduledArrival: "02:45",
    estimatedArrival: "02:45",
    durationMinutes: 530,
    priceInr: 48400,
    availableSeats: 3,
    status: "departed",
    statusLabel: "Departed",
    notes: "Long-haul service to India. Arrival gate will be assigned after landing.",
    lastUpdated: "2026-03-17T08:50:00.000Z",
    coverage: "arriving_india"
  },
  {
    id: "FYT-402",
    airline: "Air India",
    flightNumber: "AI188",
    from: "JFK",
    to: "DEL",
    departureTerminal: "T4",
    arrivalTerminal: "T3",
    departureGate: null,
    arrivalGate: null,
    scheduledDeparture: "21:05",
    estimatedDeparture: "21:05",
    scheduledArrival: "20:15",
    estimatedArrival: "20:15",
    durationMinutes: 845,
    priceInr: 72100,
    availableSeats: 2,
    status: "cancelled",
    statusLabel: "Cancelled",
    notes: "Live feed reports cancellation. Please verify rebooking options with the airline.",
    lastUpdated: "2026-03-17T05:45:00.000Z",
    coverage: "arriving_india"
  }
];

export const featuredFlightNumbers = ["AI101", "6E203", "EK516", "SQ528"];

export function findAirport(query: string) {
  const normalized = query.trim().toLowerCase();

  return airports.find(
    (airport) =>
      airport.code.toLowerCase() === normalized ||
      airport.city.toLowerCase() === normalized ||
      airport.name.toLowerCase() === normalized
  );
}

export function normalizeFlightNumber(input: string) {
  return input.replace(/[^a-z0-9]/gi, "").toUpperCase();
}

export function findFlightsByNumber(query: string) {
  const normalized = normalizeFlightNumber(query);
  return flights.filter((flight) => normalizeFlightNumber(flight.flightNumber) === normalized);
}

export function findFlightsByRoute(from: string, to: string, adults = 1) {
  return flights.filter(
    (flight) => flight.from === from && flight.to === to && flight.availableSeats >= adults
  );
}
