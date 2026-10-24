# Adithyan Platform — API Reference Manual (v1)

This documentation provides the specifications for the Adithyan Platform CMS backend APIs, outlining endpoints, data formats, authentication lifecycle, and error resolutions.

---

## 🛡️ Authentication Lifecycle

The API operates under a dual-token JWT security model:
1. **Access Token:** Lightweight token used to authenticate requests. Sent in the HTTP headers. Expiration: 60 minutes.
2. **Refresh Token:** Heavyweight token used to obtain a new Access Token. Sent in the payload of `/auth/refresh`. Expiration: 7 days.

### Auth Header Schema
To access protected endpoints, you must include the access token in your request headers:
```http
Authorization: Bearer <your_access_token>
```

---

## 📊 Standard API Response Schema

All responses returned from the server follow a uniform wrapper schema to simplify client deserialization:

### Successful Request Envelope
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "version": "v1",
    "timestamp": "2026-07-24T23:45:00.123456"
  }
}
```

### Exceptional/Error Request Envelope
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "The requested project does not exist."
  },
  "meta": {
    "version": "v1",
    "timestamp": "2026-07-24T23:45:00.123456"
  }
}
```

---

## 🚫 Standard Error Register

The following exception codes are raised by core domains:

| Error Code | HTTP Status | Description |
| :--- | :---: | :--- |
| `UNAUTHORIZED` | 401 | JWT validation failed, authorization header missing, or credentials wrong. |
| `PROJECT_NOT_FOUND` | 404 | No project matches the provided slug or index in the database. |
| `MEDIA_NOT_FOUND` | 404 | Asset record deleted or path doesn't map to dynamic uploads. |
| `INTERNAL_SERVER_ERROR` | 500 | An unhandled exception was caught by the global error middleware. |

---

## 🛣️ API Versioning Policy

- All endpoints are nested under the prefix `/api/v1/` (e.g. `/api/v1/projects`).
- **LTS Policy:** Versions are frozen. Breaking contract updates that violate the above schema structure will result in a path increments (e.g., `/api/v2/`).
