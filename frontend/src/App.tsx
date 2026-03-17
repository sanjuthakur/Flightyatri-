import { FormEvent, useMemo, useState } from "react";
import { Flight, searchFlights } from "./api";

type SearchState = {
  from: string;
  to: string;
  date: string;
  adults: number;
};

const today = new Date().toISOString().slice(0, 10);

export function App() {
  const [form, setForm] = useState<SearchState>({
    from: "DEL",
    to: "BOM",
    date: today,
    adults: 1
  });
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSearch = useMemo(() => {
    return form.from.length === 3 && form.to.length === 3 && !!form.date && form.adults >= 1;
  }, [form]);

  async function onSearch(event: FormEvent) {
    event.preventDefault();
    if (!canSearch) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await searchFlights(form);
      setFlights(result.flights);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <h1>FlightYatri</h1>
        <p>Find the best domestic routes with instant availability checks.</p>
      </section>

      <section className="search">
        <form onSubmit={onSearch} className="search-form">
          <label>
            From
            <input
              value={form.from}
              maxLength={3}
              onChange={(e) => setForm((prev) => ({ ...prev, from: e.target.value.toUpperCase() }))}
              placeholder="DEL"
            />
          </label>
          <label>
            To
            <input
              value={form.to}
              maxLength={3}
              onChange={(e) => setForm((prev) => ({ ...prev, to: e.target.value.toUpperCase() }))}
              placeholder="BOM"
            />
          </label>
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              min={today}
            />
          </label>
          <label>
            Adults
            <input
              type="number"
              min={1}
              max={9}
              value={form.adults}
              onChange={(e) => setForm((prev) => ({ ...prev, adults: Number(e.target.value) }))}
            />
          </label>

          <button type="submit" disabled={!canSearch || loading}>
            {loading ? "Searching..." : "Search Flights"}
          </button>
        </form>
      </section>

      <section className="results">
        {error ? <p className="error">{error}</p> : null}
        {!error && !loading && flights.length === 0 ? <p>No results yet. Run a search.</p> : null}
        <div className="cards">
          {flights.map((flight) => (
            <article key={flight.id} className="card">
              <header>
                <h3>{flight.airline}</h3>
                <span>{flight.flightNumber}</span>
              </header>
              <p>
                {flight.from} {flight.departureTime} to {flight.to} {flight.arrivalTime}
              </p>
              <p>Duration: {flight.durationMinutes} minutes</p>
              <p>Seats: {flight.availableSeats}</p>
              <strong>INR {flight.priceInr.toLocaleString("en-IN")}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

