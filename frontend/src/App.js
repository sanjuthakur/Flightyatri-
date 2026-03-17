import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { searchFlights } from "./api";
const today = new Date().toISOString().slice(0, 10);
export function App() {
    const [form, setForm] = useState({
        from: "DEL",
        to: "BOM",
        date: today,
        adults: 1
    });
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const canSearch = useMemo(() => {
        return form.from.length === 3 && form.to.length === 3 && !!form.date && form.adults >= 1;
    }, [form]);
    async function onSearch(event) {
        event.preventDefault();
        if (!canSearch) {
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const result = await searchFlights(form);
            setFlights(result.flights);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Unexpected error";
            setError(message);
            setFlights([]);
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("main", { className: "page", children: [_jsxs("section", { className: "hero", children: [_jsx("h1", { children: "FlightYatri" }), _jsx("p", { children: "Find the best domestic routes with instant availability checks." })] }), _jsx("section", { className: "search", children: _jsxs("form", { onSubmit: onSearch, className: "search-form", children: [_jsxs("label", { children: ["From", _jsx("input", { value: form.from, maxLength: 3, onChange: (e) => setForm((prev) => ({ ...prev, from: e.target.value.toUpperCase() })), placeholder: "DEL" })] }), _jsxs("label", { children: ["To", _jsx("input", { value: form.to, maxLength: 3, onChange: (e) => setForm((prev) => ({ ...prev, to: e.target.value.toUpperCase() })), placeholder: "BOM" })] }), _jsxs("label", { children: ["Date", _jsx("input", { type: "date", value: form.date, onChange: (e) => setForm((prev) => ({ ...prev, date: e.target.value })), min: today })] }), _jsxs("label", { children: ["Adults", _jsx("input", { type: "number", min: 1, max: 9, value: form.adults, onChange: (e) => setForm((prev) => ({ ...prev, adults: Number(e.target.value) })) })] }), _jsx("button", { type: "submit", disabled: !canSearch || loading, children: loading ? "Searching..." : "Search Flights" })] }) }), _jsxs("section", { className: "results", children: [error ? _jsx("p", { className: "error", children: error }) : null, !error && !loading && flights.length === 0 ? _jsx("p", { children: "No results yet. Run a search." }) : null, _jsx("div", { className: "cards", children: flights.map((flight) => (_jsxs("article", { className: "card", children: [_jsxs("header", { children: [_jsx("h3", { children: flight.airline }), _jsx("span", { children: flight.flightNumber })] }), _jsxs("p", { children: [flight.from, " ", flight.departureTime, " to ", flight.to, " ", flight.arrivalTime] }), _jsxs("p", { children: ["Duration: ", flight.durationMinutes, " minutes"] }), _jsxs("p", { children: ["Seats: ", flight.availableSeats] }), _jsxs("strong", { children: ["INR ", flight.priceInr.toLocaleString("en-IN")] })] }, flight.id))) })] })] }));
}
