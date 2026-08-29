# REST API Specification & Endpoint Documentation

All REST API endpoints are prefixed with `/api`. Interactive OpenAPI documentation is accessible via Swagger UI at `http://localhost:8080/swagger-ui.html`.

---

## 1. Authentication & User Endpoints

### `POST /api/auth/register`
Creates a new customer account.
- **Request Body:**
  ```json
  {
    "username": "eleanor_v",
    "email": "eleanor@example.com",
    "password": "password123",
    "fullName": "Eleanor Vance",
    "phone": "+1-800-555-0199"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "id": 4,
      "username": "eleanor_v",
      "email": "eleanor@example.com",
      "fullName": "Eleanor Vance",
      "role": "ROLE_CUSTOMER",
      "token": "eyJhbGciOiJIUzUxMiJ9..."
    }
  }
  ```

### `POST /api/auth/login`
Authenticates a user and returns a signed JWT Bearer token.
- **Request Body:**
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "username": "admin",
      "email": "admin@grandluxe.com",
      "role": "ROLE_ADMIN",
      "token": "eyJhbGciOiJIUzUxMiJ9..."
    }
  }
  ```

---

## 2. Rooms & Availability Search Endpoints

### `POST /api/rooms/search`
Searches for available rooms preventing date overlap collision.
- **Request Body:**
  ```json
  {
    "checkInDate": "2026-09-10",
    "checkOutDate": "2026-09-15",
    "guests": 2,
    "roomTypeId": 3,
    "maxPrice": 500.00
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 5,
        "roomNumber": "301",
        "roomType": { "id": 3, "name": "Deluxe Suite" },
        "pricePerNight": 280.00,
        "capacity": 3,
        "status": "AVAILABLE",
        "floor": "3rd Floor"
      }
    ]
  }
  ```

---

## 3. Reservations & Payment Endpoints

### `POST /api/reservations`
Creates a new room reservation and simulates payment.
- **Request Body:**
  ```json
  {
    "roomId": 5,
    "checkInDate": "2026-09-10",
    "checkOutDate": "2026-09-15",
    "numGuests": 2,
    "specialRequests": "High floor with sunset view",
    "autoSimulatePayment": true,
    "paymentMethod": "CREDIT_CARD"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Reservation created successfully",
    "data": {
      "id": 12,
      "reservationReference": "RES-2026-00012",
      "checkInDate": "2026-09-10",
      "checkOutDate": "2026-09-15",
      "numNights": 5,
      "pricePerNight": 280.00,
      "totalAmount": 1400.00,
      "status": "CONFIRMED",
      "payment": {
        "transactionReference": "TXN-20260829-AB12CD",
        "amount": 1400.00,
        "paymentMethod": "CREDIT_CARD",
        "paymentStatus": "SUCCESS"
      }
    }
  }
  ```

---

## 4. Inventory & Stock Operations Endpoints

### `POST /api/stock/in`
Records inbound inventory replenishment delivery.
- **Request Body:**
  ```json
  {
    "itemId": 1,
    "quantity": 100,
    "reason": "Quarterly supplier delivery",
    "referenceId": "PO-2026-904"
  }
  ```

### `POST /api/stock/out`
Records inventory consumption.
- **Request Body:**
  ```json
  {
    "itemId": 1,
    "quantity": 10,
    "reason": "Floor replenishment",
    "referenceId": "REQ-082"
  }
  ```

### `POST /api/housekeeping/prepare-room`
Dispatches standard preparation pack for a room and issues linked `STOCK_OUT` transactions.
- **Request Body:**
  ```json
  {
    "reference": "RES-2026-00012",
    "roomId": 5
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Room preparation completed. Inventory issued and room marked AVAILABLE.",
    "data": {
      "roomId": 5,
      "roomStatus": "AVAILABLE",
      "transactions": [...]
    }
  }
  ```

---

## 5. Actuator & Health Endpoints

- `GET /actuator/health` - Unified service health status
- `GET /actuator/health/liveness` - Kubernetes container liveness probe
- `GET /actuator/health/readiness` - Kubernetes database & dependency readiness probe
- `GET /actuator/info` - Service build & version metadata
