export type Airport = {
  code: string;
  city: string;
  name: string;
  country: string;
};

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
};

export const airports: Airport[] = [
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International Airport", country: "India" },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International Airport", country: "India" },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International Airport", country: "India" },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International Airport", country: "India" },
  { code: "MAA", city: "Chennai", name: "Chennai International Airport", country: "India" },
  { code: "CCU", city: "Kolkata", name: "Netaji Subhas Chandra Bose International Airport", country: "India" }
];

export const flights: Flight[] = [
  {
    id: "FYT-101",
    airline: "IndiGo",
    flightNumber: "6E-6123",
    from: "DEL",
    to: "BOM",
    departureTime: "06:20",
    arrivalTime: "08:35",
    durationMinutes: 135,
    priceInr: 5420,
    availableSeats: 12
  },
  {
    id: "FYT-102",
    airline: "Air India",
    flightNumber: "AI-865",
    from: "DEL",
    to: "BOM",
    departureTime: "14:45",
    arrivalTime: "17:10",
    durationMinutes: 145,
    priceInr: 6280,
    availableSeats: 8
  },
  {
    id: "FYT-201",
    airline: "Akasa Air",
    flightNumber: "QP-1103",
    from: "BLR",
    to: "DEL",
    departureTime: "09:10",
    arrivalTime: "11:55",
    durationMinutes: 165,
    priceInr: 7110,
    availableSeats: 9
  },
  {
    id: "FYT-301",
    airline: "SpiceJet",
    flightNumber: "SG-412",
    from: "HYD",
    to: "MAA",
    departureTime: "18:20",
    arrivalTime: "19:35",
    durationMinutes: 75,
    priceInr: 3820,
    availableSeats: 21
  },
  {
    id: "FYT-401",
    airline: "Vistara",
    flightNumber: "UK-777",
    from: "CCU",
    to: "BOM",
    departureTime: "07:40",
    arrivalTime: "10:25",
    durationMinutes: 165,
    priceInr: 6820,
    availableSeats: 16
  }
];

