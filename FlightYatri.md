# Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** FlighYatri AI

**Type:** Chatbot + Mobile Application (iOS & Android) + Web Application

**Goal:**
Enable users to quickly check real-time flight status (arrival, departure, delays, gate changes) through a conversational chatbot, native mobile applications for iOS and Android, and a mobile-friendly responsive website.

---

## 2. Problem Statement

Users today rely on multiple apps or airline websites to track flight status. These platforms are often:

* Slow or cluttered
* Not conversational
* Difficult to use for quick queries

There is a need for a simple, fast, and conversational interface that provides accurate real-time flight information.

---

## 3. Objectives

* Provide real-time flight status via chatbot, mobile apps, and web UI
* Support natural language queries (e.g., "Is AI101 on time?")
* Deliver a fast, intuitive, and consistent cross-platform user experience
* Support global flight tracking
* Ensure mobile-first usability across iOS, Android, and responsive web

---

## 4. Target Users

* Travelers (domestic & international)
* Airport pickup/drop coordinators
* Travel agents
* Airline support teams
* Users tracking flights arriving into India or departing from India

---

## 5. Key Features

### 5.1 Chatbot Features

* Natural language understanding (NLU)
* Query by:

  * Flight number
  * Route (Delhi to Mumbai)
  * Airline + time
* Responses include:

  * Departure/Arrival status
  * Delay information
  * Gate/Terminal details
  * Estimated time updates
* Multi-turn conversation support
* Error handling (invalid flight, missing info)
* Intent fallback when user query is incomplete or ambiguous
* Clear disclosure when live flight data is temporarily unavailable
* Coverage focused on flights arriving into India and departing from India

### 5.2 Mobile App Features (iOS & Android)

* Native mobile apps for iOS and Android
* Conversational chat interface optimized for mobile screens
* Search by flight number, route, airport, or airline
* Save recent and favorite flights
* Push notifications for delays, gate changes, boarding, and arrival
* Deep link support from notifications into flight detail page
* Lightweight low-bandwidth mode for poor network conditions
* Accessible UI with large tap targets and readable typography

### 5.3 Website Features

* Search bar (flight number / route)
* Live status dashboard
* Auto-refresh status updates
* Flight history (optional for logged-in users)
* Mobile-friendly responsive design
* Responsive layouts for phone, tablet, and desktop breakpoints
* Fast-loading pages with graceful fallback states
* Minimal authentication flow with email/password and Google Sign-In

### 5.4 Notifications (Phase 2)

* SMS / Email alerts
* Delay notifications
* Gate change alerts
* Push notifications on iOS and Android

### 5.5 Guardrails and Trust Controls

* Do not hallucinate flight status when external API data is unavailable
* Always show data timestamp and source freshness where possible
* Require clarification when multiple flights match the same query
* Explicitly flag uncertain, delayed, stale, or partially available data
* Prevent unsupported claims such as baggage belt, boarding time, or gate when source data is missing
* Provide fallback guidance such as “Please verify with airline or airport display” for critical changes
* Rate-limit abusive or automated query patterns
* Log sensitive operations securely without storing unnecessary personal data
* Mask API keys, tokens, and internal diagnostics from end users
* Provide safe error messages without exposing backend architecture
* Enforce platform-level moderation for abusive chat content
* Add clear disclaimer that operational flight data may change in real time

---

## 6. User Journeys

### Journey 1: Check flight by number

1. User enters: "AI101 status"
2. System fetches flight data
3. Displays:

   * On-time / delayed
   * Departure & arrival time
   * Gate/terminal

### Journey 2: Check by route

1. User enters: "Flights from Delhi to Mumbai today"
2. System lists matching flights
3. User selects one → detailed status shown

---

## 7. Functional Requirements

### Chatbot

* NLP engine to parse user queries
* Intent detection:

  * Flight status
  * Flight search
* Entity extraction:

  * Flight number
  * Source & destination
  * Date/time
  * Arrival to India / departure from India context

### Authentication & User Account

* Login is mandatory for personalized features
* Support sign-up/login with:

  * Email ID and password
  * Google Sign-In
* Keep onboarding minimal with low-friction registration
* Secure password handling and session/token management
* Logged-in users can access personalized features such as saved flights, alerts, and historical views

### Backend

* Integration with flight data APIs (e.g., AviationStack, FlightAware)
* Real-time data fetching
* Caching layer for performance

### Frontend

* Native mobile apps for iOS and Android (React Native / Flutter or platform-native)
* Responsive web UI (React / Next.js or similar)
* Chat interface component
* Search + results UI
* Shared design system across mobile and web

---

## 8. Non-Functional Requirements

* Response time: < 2 seconds for standard queries
* Availability: 99.9%
* Scalability: Support high concurrent users
* Security: API key protection, HTTPS, secure token storage on mobile
* Mobile responsiveness: Seamless experience across iOS, Android, phones, tablets, and desktop web
* Accessibility: WCAG-aligned readable contrast, screen-reader labels, and keyboard navigation for web
* Reliability: Graceful degradation when third-party flight APIs are delayed or unavailable
* Observability: Monitoring, alerting, and analytics for API failures, latency spikes, and app crashes

---

## 9. Technical Architecture

### Components

* Mobile Frontend: iOS + Android apps
* Web Frontend: React / Next.js
* Backend: Node.js / Python (FastAPI)
* Chatbot: LLM / Dialogflow / Rasa
* API Layer: Flight data providers
* Database: Redis (cache), PostgreSQL (optional)
* Notification Service: Push, SMS, Email provider
* Analytics & Monitoring: Crash reporting, usage analytics, API health monitoring

### Flow

User → Mobile App / Web UI / Chat Interface → Backend → Flight API → Response → User

---

## 10. API Requirements

Required Data Fields:

* Flight number
* Airline
* Departure airport & time
* Arrival airport & time
* Status (on-time, delayed, cancelled)
* Gate & terminal

---

## 11. Metrics for Success

* Daily active users (DAU)
* Query success rate
* Response latency
* User satisfaction (CSAT)

---

## 12. Risks & Dependencies

* Dependency on third-party flight APIs
* Data accuracy issues
* Rate limits from API providers
* App store review and release dependencies for iOS and Android
* Notification delivery reliability across devices and OS versions
* Inconsistent flight metadata across different airlines and airports
* Real-time data latency during disruption events

---

## 13. Future Enhancements

* Voice assistant integration
* Multi-language support
* Integration with booking platforms
* Predictive delay insights (ML-based)

---

## 14. Timeline (High-Level)

| Phase           | Duration  |
| --------------- | --------- |
| MVP Development | 4–6 weeks |
| Beta Launch     | 2 weeks   |
| Full Launch     | 2–4 weeks |

---

## 15. Open Questions

### Decisions Captured

* **Geographic Scope:** The application will support all flights coming into India and going out of India.
* **Authentication Requirement:** Login is required.
* **Login Experience:** Sign-up and login should be minimal, with support for:

  * Email ID + password
  * Google Sign-In
* **Historical Analytics Access:** Historical analytics and personalized features will be available only for logged-in users.

### Remaining Open Questions

* Which flight data API will be finalized?
* Should the mobile apps be native or cross-platform?
* What level of notification personalization should be supported in MVP?
* Will there be any admin or operations dashboard for monitoring API health, user issues, and flight search trends?

---

## 16. Appendix

Example Query:

* "What is the status of Indigo 6E203?"

Example Response:

* "Flight 6E203 is delayed by 30 minutes. New departure time: 18:45 from Terminal 1, Gate 12."

---

## 17. User Stories & Acceptance Criteria

### Story 1: Check flight status by number

**As a** user
**I want** to enter a flight number
**So that** I can see its live status

**Acceptance Criteria:**

* User can input flight number
* System returns correct flight details within 2 seconds
* Shows status, times, terminal, and gate (if available)

### Story 2: Conversational query

**As a** user
**I want** to ask in natural language
**So that** I don’t need structured input

**Acceptance Criteria:**

* System correctly interprets queries like “Is AI101 delayed?”
* Handles incomplete queries with follow-up questions

---

## 18. MVP vs Phase-wise Scope

### MVP

* Flight status by number
* Basic chatbot
* Responsive website
* Mobile apps (basic search + status)
* Flight coverage for flights arriving into India and departing from India
* Minimal login with email/password and Google Sign-In

### Phase 2

* Notifications (push/SMS/email)
* Saved flights
* Multi-language support
* Historical analytics for logged-in users

### Phase 3

* Predictive delays (ML)
* Voice assistant
* Airline integrations

---

## 19. Key Screens / Sitemap

### Mobile App

* Home (search + chat)
* Flight Status Page
* Saved Flights
* Notifications

### Web

* Home page
* Search results page
* Flight details page

---

## 20. Chatbot Guardrails (Detailed)

* Always confirm critical entities (flight number, date)
* Ask clarification questions when ambiguity exists
* Never fabricate flight details
* Clearly indicate when data is delayed or unavailable
* Provide source attribution where possible
* Avoid over-promising (e.g., exact boarding time if unavailable)
* Escalate to human/help guidance for critical uncertainty

---

## 21. Analytics & Tracking

* Search success rate
* Drop-off rate after query
* Most searched routes/flights
* Notification engagement rate
* App crash rate (mobile)

---

## 22. Go-to-Market (GTM) Strategy

* Launch in high-traffic routes (India domestic first)
* Partner with travel platforms
* App Store + Play Store optimization
* SEO for flight search queries

---
