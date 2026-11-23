# Wheel-Q API contract (what the frontend expects)

The frontend calls these three endpoints. Build the Flask routes to match.
All bodies are JSON. Dates are `YYYY-MM-DD`. Money is whole Kenya shillings (KES).
Errors return the right status code and `{ "error": "Plain message the customer can read." }`.

## GET /api/cars?start=2026-11-23&end=2026-11-26

Returns every car in the fleet, each marked free or not for those dates.

```json
[
  {
    "id": 4,
    "name": "Subaru Forester",
    "category": "SUV",
    "seats": 5,
    "transmission": "Automatic",
    "fuel": "Petrol",
    "daily_rate": 7500,
    "plate": "KDC 356K",
    "available": true
  }
]
```

## POST /api/bookings

Request:

```json
{
  "car_id": 4,
  "start": "2026-11-23",
  "end": "2026-11-26",
  "name": "Faith A",
  "phone": "+254712345678",
  "email": "name@example.com",
  "notes": ""
}
```

Response `201`:

```json
{
  "reference": "WQ-4F7K",
  "status": "reserved",
  "car_id": 4,
  "car_name": "Subaru Forester",
  "plate": "KDC 356K",
  "start": "2026-11-23",
  "end": "2026-11-26",
  "days": 3,
  "total": 22500
}
```

Errors: `409` when the car is already booked for any of those dates (the frontend shows
"Someone just reserved this car"), `404` for an unknown car, `400` for bad input.
The backend must re-check availability here. The browser's view can be out of date.

## GET /api/bookings/WQ-4F7K?phone=%2B254712345678

Returns the same shape as the POST response. Only returns the booking when the
reference AND the phone number both match. Otherwise `404`. Never return the phone number.

## Rules the frontend currently assumes (confirm each with the client)

1. Rental days = return date minus pick-up date. 23 Nov to 26 Nov is 3 days.
2. A car returned on a date can be picked up again the same day.
3. Price is a flat daily rate. No weekend rates, discounts or deposit.
4. Reserving does not take payment. How payment works is still to be decided.
5. Phone numbers are Kenyan mobiles (07xx or 01xx), sent as +254XXXXXXXXX.
6. Booking references look like `WQ-` plus 4 letters or digits.
