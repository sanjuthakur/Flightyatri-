import { FormEvent, useEffect, useState } from "react";
import {
  askAssistant,
  Flight,
  getFlightStatus,
  getHighlights,
  getRouteSuggestions,
  searchFlights
} from "./api";

type RouteFormState = {
  from: string;
  to: string;
  date: string;
  adults: number;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const today = new Date().toISOString().slice(0, 10);

function formatClock(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function statusTone(status: Flight["status"]) {
  switch (status) {
    case "boarding":
      return "amber";
    case "delayed":
    case "cancelled":
      return "rose";
    case "departed":
    case "in_air":
      return "blue";
    case "arrived":
      return "green";
    default:
      return "slate";
  }
}

function FlightCard({
  flight,
  active,
  onSelect
}: {
  flight: Flight;
  active?: boolean;
  onSelect?: (flight: Flight) => void;
}) {
  return (
    <button
      type="button"
      className={`flight-card${active ? " is-active" : ""}`}
      onClick={() => onSelect?.(flight)}
    >
      <div className="flight-card__top">
        <div>
          <p className="eyebrow">{flight.airline}</p>
          <h3>{flight.flightNumber}</h3>
        </div>
        <span className={`status-pill status-pill--${statusTone(flight.status)}`}>{flight.statusLabel}</span>
      </div>
      <div className="flight-card__route">
        <div>
          <strong>{flight.from}</strong>
          <span>{formatClock(flight.estimatedDeparture)}</span>
        </div>
        <div className="route-line" />
        <div>
          <strong>{flight.to}</strong>
          <span>{formatClock(flight.estimatedArrival)}</span>
        </div>
      </div>
      <div className="flight-card__meta">
        <span>{flight.availableSeats} seats</span>
        <span>INR {flight.priceInr.toLocaleString("en-IN")}</span>
      </div>
    </button>
  );
}

export function App() {
  const [routeForm, setRouteForm] = useState<RouteFormState>({
    from: "DEL",
    to: "BOM",
    date: today,
    adults: 1
  });
  const [flightNumber, setFlightNumber] = useState("AI101");
  const [chatInput, setChatInput] = useState("Is AI101 on time?");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Ask for a flight number like AI101 or a route like flights from Delhi to Mumbai."
    }
  ]);
  const [routeResults, setRouteResults] = useState<Flight[]>([]);
  const [highlights, setHighlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{ from: string; to: string; label: string }>>([]);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        const [highlightResponse, suggestionsResponse, statusResponse] = await Promise.all([
          getHighlights(),
          getRouteSuggestions(),
          getFlightStatus("AI101")
        ]);

        if (cancelled) {
          return;
        }

        setHighlights(highlightResponse.flights);
        setSuggestions(suggestionsResponse.suggestions);
        setSelectedFlight(statusResponse.flight);
      } catch (requestError) {
        if (!cancelled) {
          const message = requestError instanceof Error ? requestError.message : "Unable to load dashboard";
          setError(message);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedFlight) {
      return;
    }

    const interval = window.setInterval(async () => {
      try {
        const response = await getFlightStatus(selectedFlight.flightNumber);
        setSelectedFlight(response.flight);
      } catch {
        // Silent refresh failure; the last known flight state remains visible.
      }
    }, 60000);

    return () => window.clearInterval(interval);
  }, [selectedFlight]);

  async function handleRouteSearch(event: FormEvent) {
    event.preventDefault();
    setLoadingRoute(true);
    setError(null);

    try {
      const response = await searchFlights(routeForm);
      setRouteResults(response.flights);
      if (response.flights.length > 0) {
        setSelectedFlight(response.flights[0]);
      }
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to search route";
      setError(message);
      setRouteResults([]);
    } finally {
      setLoadingRoute(false);
    }
  }

  async function handleFlightLookup(event: FormEvent) {
    event.preventDefault();
    setLoadingStatus(true);
    setError(null);

    try {
      const response = await getFlightStatus(flightNumber);
      setSelectedFlight(response.flight);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Unable to load flight status";
      setError(message);
    } finally {
      setLoadingStatus(false);
    }
  }

  async function handleChat(event: FormEvent) {
    event.preventDefault();
    if (!chatInput.trim()) {
      return;
    }

    const outgoing = chatInput.trim();
    setChatMessages((current) => [...current, { id: `${Date.now()}-user`, role: "user", text: outgoing }]);
    setChatInput("");
    setLoadingChat(true);

    try {
      const response = await askAssistant(outgoing);
      setChatMessages((current) => [
        ...current,
        { id: `${Date.now()}-assistant`, role: "assistant", text: response.reply }
      ]);

      if (response.flight) {
        setSelectedFlight(response.flight);
      } else if (response.flights?.[0]) {
        setRouteResults(response.flights);
        setSelectedFlight(response.flights[0]);
      }
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Assistant unavailable";
      setChatMessages((current) => [
        ...current,
        { id: `${Date.now()}-assistant-error`, role: "assistant", text: message }
      ]);
    } finally {
      setLoadingChat(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">FlightYatri AI</p>
          <h1>India-focused flight status, route search, and conversational updates.</h1>
          <p className="lede">
            Responsive web MVP for flights arriving into India, departing from India, and key domestic routes. The
            assistant avoids guessing when data is missing or ambiguous.
          </p>
          <div className="hero-badges">
            <span>Live-style status feed</span>
            <span>Natural language queries</span>
            <span>Mobile-first layout</span>
          </div>
        </div>
        <div className="trust-card">
          <p className="eyebrow">Guardrails</p>
          <ul>
            <li>Timestamp every result with freshness metadata.</li>
            <li>Do not fabricate gate or timing data when unavailable.</li>
            <li>Prompt for clarification if multiple flights match.</li>
          </ul>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel stack">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Flight Number</p>
              <h2>Direct status lookup</h2>
            </div>
          </div>
          <form className="compact-form" onSubmit={handleFlightLookup}>
            <input
              value={flightNumber}
              onChange={(event) => setFlightNumber(event.target.value.toUpperCase())}
              placeholder="AI101"
              maxLength={8}
            />
            <button type="submit" disabled={loadingStatus}>
              {loadingStatus ? "Checking..." : "Check status"}
            </button>
          </form>
        </div>

        <div className="panel stack">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Route Search</p>
              <h2>Find flights by route</h2>
            </div>
          </div>
          <form className="route-form" onSubmit={handleRouteSearch}>
            <input
              value={routeForm.from}
              onChange={(event) =>
                setRouteForm((current) => ({ ...current, from: event.target.value.toUpperCase() }))
              }
              placeholder="DEL"
              maxLength={3}
            />
            <input
              value={routeForm.to}
              onChange={(event) => setRouteForm((current) => ({ ...current, to: event.target.value.toUpperCase() }))}
              placeholder="BOM"
              maxLength={3}
            />
            <input
              type="date"
              min={today}
              value={routeForm.date}
              onChange={(event) => setRouteForm((current) => ({ ...current, date: event.target.value }))}
            />
            <input
              type="number"
              min={1}
              max={9}
              value={routeForm.adults}
              onChange={(event) =>
                setRouteForm((current) => ({ ...current, adults: Number(event.target.value) || 1 }))
              }
            />
            <button type="submit" disabled={loadingRoute}>
              {loadingRoute ? "Searching..." : "Search"}
            </button>
          </form>
          <div className="suggestion-row">
            {suggestions.map((suggestion) => (
              <button
                type="button"
                key={suggestion.label}
                className="chip"
                onClick={() =>
                  setRouteForm((current) => ({ ...current, from: suggestion.from, to: suggestion.to }))
                }
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel stack">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Status Board</p>
              <h2>Selected flight</h2>
            </div>
            {selectedFlight ? <span className="timestamp">Updated {formatUpdatedAt(selectedFlight.lastUpdated)}</span> : null}
          </div>
          {error ? <p className="error-banner">{error}</p> : null}
          {selectedFlight ? (
            <article className="detail-card">
              <div className="detail-card__header">
                <div>
                  <p className="eyebrow">{selectedFlight.airline}</p>
                  <h3>{selectedFlight.flightNumber}</h3>
                </div>
                <span className={`status-pill status-pill--${statusTone(selectedFlight.status)}`}>
                  {selectedFlight.statusLabel}
                </span>
              </div>
              <div className="detail-grid">
                <div>
                  <span>Route</span>
                  <strong>
                    {selectedFlight.from} to {selectedFlight.to}
                  </strong>
                </div>
                <div>
                  <span>Departure</span>
                  <strong>{formatClock(selectedFlight.estimatedDeparture)}</strong>
                </div>
                <div>
                  <span>Arrival</span>
                  <strong>{formatClock(selectedFlight.estimatedArrival)}</strong>
                </div>
                <div>
                  <span>Terminal / Gate</span>
                  <strong>
                    {selectedFlight.departureTerminal}
                    {selectedFlight.departureGate ? ` / ${selectedFlight.departureGate}` : ""}
                  </strong>
                </div>
              </div>
              <p className="detail-note">{selectedFlight.notes}</p>
              <p className="detail-disclaimer">{selectedFlight.freshness.disclaimer}</p>
            </article>
          ) : (
            <p className="empty-state">Select a flight to inspect its latest known status.</p>
          )}
        </div>

        <div className="panel stack">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Assistant</p>
              <h2>Conversational query</h2>
            </div>
          </div>
          <div className="chat-thread">
            {chatMessages.map((message) => (
              <div key={message.id} className={`chat-bubble chat-bubble--${message.role}`}>
                {message.text}
              </div>
            ))}
          </div>
          <form className="chat-form" onSubmit={handleChat}>
            <input
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Flights from Delhi to Mumbai today"
            />
            <button type="submit" disabled={loadingChat}>
              {loadingChat ? "Thinking..." : "Ask"}
            </button>
          </form>
        </div>
      </section>

      <section className="content-grid">
        <div className="panel stack">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Highlights</p>
              <h2>Watched flights</h2>
            </div>
          </div>
          <div className="cards-grid">
            {highlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                active={selectedFlight?.id === flight.id}
                onSelect={setSelectedFlight}
              />
            ))}
          </div>
        </div>

        <div className="panel stack">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Search Results</p>
              <h2>Route matches</h2>
            </div>
          </div>
          {routeResults.length === 0 ? (
            <p className="empty-state">Run a route search or ask the assistant for flights from one city to another.</p>
          ) : (
            <div className="cards-grid">
              {routeResults.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  active={selectedFlight?.id === flight.id}
                  onSelect={setSelectedFlight}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
