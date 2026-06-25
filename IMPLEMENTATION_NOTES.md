## Backend Implementation Notes

The backend was already scaffolded with authentication, authorization, Zod validation, TypeScript types, and a JSON store abstraction. My work focused on implementing the missing functionality while following the existing architecture.

Implemented:
- Ticket creation, listing, lookup, and status updates in the JSON store.
- POST, GET, and PATCH API endpoints in Express.
- Runtime request validation using the provided Zod schemas to ensure incoming API requests matched expected data contracts.
- Proper HTTP responses for success, validation errors, authentication, authorization, and missing resources.
- JSON persistence with automatic ticket numbering, timestamps, and status tracking.


Implementation Notes

I treated the provided test suite as the implementation guide, completing one feature at a time and verifying behavior after each change. AI was used as a learning and debugging aid to better understand unfamiliar TypeScript concepts (interfaces, store abstractions, middleware, and routing). All implementation decisions and final code were reviewed, understood, and completed by me rather than copied wholesale.

 Additional Backend Testing

- All provided backend tests pass.
- Backend feature requirements are complete.
- Include adding two additional backend tests and completing the React frontend.

- Added a test verifying unauthenticated requests are rejected with HTTP 401.
- Added a test verifying that attempting to update a non-existent ticket returns HTTP 404.





## Frontend Implementation Notes

The frontend was updated to connect the provided React interface to the completed backend API.

Implemented:
- Feedback form submission using POST /api/support-feedback.
- Admin ticket loading using GET /api/support-feedback.
- Ticket status updates using PATCH /api/support-feedback/:id/status.
- Loading, error, and success behavior around API requests.
- Admin-only ticket listing, filtering, search, and status updates.
- Query string generation for search/status filters using URLSearchParams.

One frontend issue fixed during implementation was that URLSearchParams.toString() returns a value like q=test&status=open without the leading ?. The API helper expected query strings to already include the leading ?, while URLSearchParams.toString() intentionally omits it. This produced invalid request URLs until conditional logic was added to prepend ? only when query parameters were present.

 Responsive Layout

The frontend layout was refined for improved usability on narrower screen sizes. Minor CSS adjustments were made to allow interface elements to wrap appropriately, reduce horizontal overflow, and maintain a functional layout across different viewport widths. While the application remains desktop-focused, the interface now responds cleanly to smaller screen sizes without affecting existing functionality.

 Admin Triage Filtering

The Admin Triage interface was extended to include category and severity filtering in addition to the existing text search and status filters. New React state was added to manage the selected filter values, and URLSearchParams was updated to include the additional query parameters before sending requests to the backend API.

## Frontend Tradeoffs / Remaining Work

- The UI is intentionally simple and focused on meeting the required support triage workflow.
- Styling and layout could be further polished with more time.
- Additional frontend tests would be a next step.
- Role selection is kept simple for demo authentication using the provided candidate tokens.



## Testing & Validation

Validation was performed through a combination of automated testing, manual verification, and defensive programming practices.

Automated verification included passing all provided backend tests, adding two supplemental backend tests for authentication and missing ticket handling, and confirming successful production builds for both the frontend and backend.

Manual validation included creating support tickets, verifying authentication and role-based authorization, testing ticket creation and persistence, confirming ticket status updates and timestamp consistency, verifying search and filtering by text, status, category, and severity, reviewing diagnostic context, and validating responsive behavior on narrower screen sizes.

Defensive programming techniques were incorporated throughout the application, including runtime validation with Zod, authentication and authorization middleware, conditional query parameter generation, guarded API response handling, existence checks before ticket updates, and frontend error handling using try/catch/finally to ensure invalid input and failed requests were handled gracefully.





## Development Timeline


This timeline documents my implementation process, debugging workflow, testing, and architectural understanding while completing the Support Triage assignment.

---

## Project Analysis & Backend Development

### 12:56 AM — Initial Project Review

* Reviewed the provided project architecture and assignment requirements.
* Installed project dependencies and verified the development environment.
* Identified unfamiliar backend concepts requiring additional research:

  * Authentication tokens
  * Backend request flow
  * Store abstraction
  * TypeScript interfaces
  * Existing TODO locations
  * Frontend/backend communication
* Investigated initial project issues:

  * Tickets not submitting
  * Admin ticket list not displaying
  * Backend tests returning **501 Not Implemented**

---

### 2:30 AM — Architecture Research

Before implementing features, I focused on understanding the existing architecture.

Topics studied:

* Express routing
* Authentication & authorization
* Middleware flow
* Zod validation
* Store abstraction
* TypeScript interfaces
* Route implementations
* Existing TODO locations

I documented the backend request lifecycle as:

```text
Client Request
      ↓
Express Route
      ↓
Authentication
      ↓
Zod Validation
      ↓
Store (Persistence Layer)
      ↓
JSON File Storage
      ↓
Frontend Response
```

Additional observations:

* `support-feedback.json` is automatically created if it does not exist.
* JSON persistence is handled by the provided store abstraction.
* Route handlers communicate asynchronously with the frontend.

This architectural understanding helped reduce implementation uncertainty before coding.

---

### 3:00–3:40 AM — Backend Implementation

Implemented the remaining backend TODOs.

Completed:

* Ticket creation
* Ticket lookup
* Ticket listing
* Ticket status updates
* Express route implementations
* Store implementation
* JSON persistence
* Automatic ticket numbering
* Timestamp generation
* Proper HTTP status handling

Verification:

* All provided backend tests passing with `npm test`.

Committed and pushed the completed backend implementation.

---

## Frontend Integration & Polish

### 2:00 PM — Resume Development

Resumed development after an overnight break and shifted focus toward frontend integration.

Connected the React frontend to the completed backend API.

Implemented:

* Ticket submission (POST)
* Ticket loading (GET)
* Ticket status updates (PATCH)
* Admin ticket listing
* Role-based status updates
* Search functionality

---

### Frontend Debugging

While implementing Admin Triage, ticket filtering initially failed.

**Root Cause**

`URLSearchParams.toString()` returns:


status=open&q=layout


instead of:


?status=open&q=layout


The API helper expected the leading `?`, resulting in invalid request URLs whenever search or filters were used.

**Solution**

* Detect whether query parameters exist.
* Prepend `?` only when necessary.
* Pass an empty string when no parameters exist.

This restored:

* Search
* Status filtering
* Backend communication
* Correct API requests

---

### API Completion

Completed frontend integration for all required endpoints:

* `POST /api/support-feedback`
* `GET /api/support-feedback`
* `PATCH /api/support-feedback/:id/status`

Additional work included:

* Ticket rendering
* Loading states
* Success handling
* Error handling
* Admin-only status updates

Verified authorization behavior manually.

---

### 4:02 PM — Responsive Layout

Improved usability on narrower screen sizes.

Changes included:

* Flex wrapping for Admin Triage
* Reduced horizontal overflow
* Improved narrow viewport layout

Verified responsive behavior through manual testing.

---

### 4:08 PM — Supplemental Backend Testing

Added two additional backend tests beyond the provided suite.

Implemented:

* HTTP 401 verification for unauthenticated requests
* HTTP 404 verification for updating a non-existent ticket

Confirmed all backend tests continued to pass.

---

### 4:32 PM — Admin Triage Enhancements

Extended filtering functionality beyond the original implementation.

Added:

* Category filtering
* Severity filtering
* Additional URL query parameters
* React state management for new filters

Verified:

* Search
* Status filtering
* Category filtering
* Severity filtering

through manual testing.

---

### 4:42 PM — Documentation

Prepared final project documentation.

Completed:

* Backend implementation notes
* Frontend implementation notes
* Testing & validation summary
* Defensive programming summary
* Tradeoffs & remaining work
* Responsive layout notes
* Admin filtering documentation
* AI usage disclosure