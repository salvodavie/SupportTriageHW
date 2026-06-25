# API Contract

All responses should be JSON.

## Envelope

Successful response:

```json
{
  "success": true,
  "data": {},
  "timestamp": 1710000000000
}
```

Error response:

```json
{
  "success": false,
  "error": "Human-readable message",
  "timestamp": 1710000000000
}
```

Validation errors may include an `errors` array.

## POST /api/support-feedback

Creates a support feedback ticket. Requires any valid demo token.

Request:

```json
{
  "category": "bug-report",
  "severity": "high",
  "subject": "Dashboard layout does not save",
  "details": "The layout reverts after refreshing the browser.",
  "pagePath": "/app/dashboard",
  "sessionId": "00000000-0000-4000-8000-000000000001",
  "context": {
    "browser": "Chrome",
    "viewport": "1440x900",
    "recentClientErrors": [
      {
        "message": "Failed to save layout",
        "source": "client",
        "at": 1710000000000
      }
    ]
  }
}
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "ticketNumber": 1001,
    "category": "bug-report",
    "severity": "high",
    "status": "open",
    "subject": "Dashboard layout does not save",
    "details": "The layout reverts after refreshing the browser.",
    "pagePath": "/app/dashboard",
    "sessionId": "00000000-0000-4000-8000-000000000001",
    "createdBy": {
      "id": "u-instructor",
      "role": "instructor"
    },
    "context": {},
    "createdAt": "2026-06-24T12:00:00.000Z",
    "updatedAt": "2026-06-24T12:00:00.000Z"
  },
  "timestamp": 1710000000000
}
```

## GET /api/support-feedback

Lists support feedback tickets. Requires admin token.

Optional query params:

- `status`
- `category`
- `severity`
- `q`

Response:

```json
{
  "success": true,
  "data": [],
  "timestamp": 1710000000000
}
```

## PATCH /api/support-feedback/:id/status

Updates ticket status. Requires admin token.

Request:

```json
{
  "status": "resolved"
}
```

Response:

```json
{
  "success": true,
  "data": {},
  "timestamp": 1710000000000
}
```

