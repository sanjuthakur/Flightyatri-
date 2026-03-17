const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
export async function searchFlights(params) {
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
    return response.json();
}
