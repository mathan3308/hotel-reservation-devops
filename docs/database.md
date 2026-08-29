# Database Schema & Entity Design

## 1. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o{ RESERVATIONS : places
    USERS ||--o{ STOCK_TRANSACTIONS : performs
    ROOM_TYPES ||--o{ ROOMS : classifies
    ROOMS ||--o{ RESERVATIONS : books
    RESERVATIONS ||--|| PAYMENTS : settles
    CATEGORIES ||--o{ INVENTORY_ITEMS : groups
    WAREHOUSES ||--o{ WAREHOUSE_LOCATIONS : contains
    WAREHOUSES ||--o{ INVENTORY_ITEMS : stores
    WAREHOUSE_LOCATIONS ||--o{ INVENTORY_ITEMS : places
    SUPPLIERS ||--o{ INVENTORY_ITEMS : supplies
    INVENTORY_ITEMS ||--o{ STOCK_TRANSACTIONS : tracks
    WAREHOUSES ||--o{ STOCK_TRANSACTIONS : source
    WAREHOUSES ||--o{ STOCK_TRANSACTIONS : destination

    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar password
        varchar full_name
        varchar phone
        varchar role
        datetime created_at
        datetime updated_at
    }

    ROOM_TYPES {
        bigint id PK
        varchar name UK
        text description
        decimal base_price
        int default_capacity
        text amenities
        varchar image_url
        datetime created_at
    }

    ROOMS {
        bigint id PK
        varchar room_number UK
        bigint room_type_id FK
        decimal price_per_night
        int capacity
        varchar status
        varchar floor
        text description
        datetime created_at
        datetime updated_at
    }

    RESERVATIONS {
        bigint id PK
        varchar reservation_reference UK
        bigint user_id FK
        bigint room_id FK
        date check_in_date
        date check_out_date
        int num_guests
        int num_nights
        decimal price_per_night
        decimal total_amount
        varchar status
        text special_requests
        datetime created_at
        datetime updated_at
    }

    PAYMENTS {
        bigint id PK
        varchar transaction_reference UK
        bigint reservation_id FK,UK
        decimal amount
        varchar payment_method
        varchar payment_status
        varchar payment_gateway_response
        datetime created_at
    }

    INVENTORY_ITEMS {
        bigint id PK
        varchar sku UK
        varchar name
        bigint category_id FK
        int quantity
        int min_stock_level
        varchar unit
        decimal unit_price
        bigint warehouse_id FK
        bigint location_id FK
        bigint supplier_id FK
        boolean active
        datetime created_at
        datetime updated_at
    }

    STOCK_TRANSACTIONS {
        bigint id PK
        bigint item_id FK
        varchar transaction_type
        int quantity
        int balance_after
        bigint source_warehouse_id FK
        bigint dest_warehouse_id FK
        bigint source_location_id FK
        bigint dest_location_id FK
        varchar reference_id
        varchar reason
        varchar performed_by
        datetime created_at
    }
```

---

## 2. Table Specifications & Constraints

### `users`
- `role`: Enum values `ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN`.
- Passwords hashed using Spring Security `BCryptPasswordEncoder`.

### `rooms`
- `status`: Enum values `AVAILABLE`, `BOOKED`, `CLEANING`, `MAINTENANCE`.
- `room_number`: Unique constraint index.

### `reservations`
- `status`: Enum values `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`.
- `reservation_reference`: Unique format `RES-YYYY-XXXXX`.
- Calculated fields: `num_nights = checkOutDate - checkInDate`, `total_amount = num_nights * price_per_night`.

### `inventory_items`
- Low stock calculation: `quantity <= min_stock_level`.
- `quantity`: Checked non-negative constraint (`quantity >= 0`).

### `stock_transactions`
- `transaction_type`: Enum values `STOCK_IN`, `STOCK_OUT`, `TRANSFER`, `ADJUSTMENT`.
- Audit immutability: Records are insert-only and cannot be altered or deleted.

---

## 3. Safe Database Seeding

The application initializes realistic demo datasets automatically via `DataInitializer.java` without duplicating records:
- Demo Users: `admin`, `staff`, `customer` (Default password: `...123`)
- 5 Room Tiers with 12 distinct luxury rooms
- 2 Warehouses (`WH-MAIN` Central Logistics and `WH-HK-01` Floor Pantry) with 4 bin locations
- 4 Inventory Categories and 8 realistic hospitality consumable items
- Low-stock inventory items to showcase real-time alerts immediately on first run.
