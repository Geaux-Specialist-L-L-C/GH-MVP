# Geaux HelpED API Reference

This document describes the major API endpoints for Geaux HelpED. All routes should be prefixed with `/api` and most will require authenticated requests (JWT token in the `Authorization` header).

```bash
Repository: Geaux-Specialist-L-L-C/GH-MVP
```

---

## Authentication Routes

### POST /api/auth/register
• Registers a new user (admin, caregiver, or care recipient).

```json
{
  "email": "user@example.com",
  "password": "yourpassword",
  "role": "caregiver",
  "firstName": "John",
  "lastName": "Doe"
}
```

- Returns a success message and JWT token if registration is successful.

### POST /api/auth/login
• Authenticates an existing user.

```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

- Returns a success message, user object, and JWT token upon successful login.

### GET /api/auth/me
• Retrieves the currently authenticated user’s data using the token in the `Authorization` header.

- Returns user’s details including ID, email, role, etc.

---

## User Role & Permissions

### POST /api/admin/users/[id]/role
• Updates a user’s role (admin only).

```json
{
  "role": "caregiver"
}
```
- Requires an admin token; returns updated user data.

---

## Profile Routes

### GET /api/profile
• Retrieves the currently authenticated user's profile.

- Returns a Profile object or 404 if none is found.

### PUT /api/profile
• Updates the currently authenticated user's profile.

```json
{
  "bio": "Updated user bio",
  "address": {
    "street": "1234 Maple Street",
    "city": "Exampleville",
    "state": "LA",
    "zipCode": "12345"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Sister",
    "phone": "555-123-4567"
  },
  "preferences": {
    "notifications": {
      "email": true,
      "sms": false,
      "push": true
    },
    "timezone": "America/Chicago",
    "language": "en"
  },
  "caregiverDetails": {
    "certifications": ["CNA", "BLS"],
    "specialties": ["Elderly Care"],
    "yearsOfExperience": 5
  },
  "careRecipientDetails": {
    "primaryConditions": ["Arthritis"],
    "dateOfBirth": "1959-07-20",
    "mobility": "assistive_device"
  }
}
```
- For caregivers, only caregiver fields are updatable; for care recipients, only care recipient fields are updatable. Admins can update all fields.

### POST /api/profile/upload-image
• Uploads a new profile avatar image (multipart form data).

- Returns the new avatar URL on success.
- Maximum file size: 5MB.

---

## Error Handling
- All endpoints return a JSON object with a `success` boolean and a `message` explaining the error if `success` is false.
- Standard HTTP status codes indicate success or failure.

---

## Plans for Future Endpoints
- Task Management: Create, read, update, and delete tasks.
- Vital Sign Tracking: Real-time or periodic logging of health metrics.
- AI & ML Features: Automated medical note generation and Q&A endpoints.

---

_Updated: 2025-03-02 00:36:00 UTC by evopimp_