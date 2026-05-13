# OmniView Database Schema (Relational/PostgreSQL)

## Tables

### 1. `users`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key |
| `email` | String (Unique) | User email |
| `role` | Enum | `ADMIN`, `VENDOR`, `CUSTOMER` |
| `created_at` | Timestamp | Account creation date |

### 2. `vendors`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key (refs users.id) |
| `brand_name` | String | Hidden from other vendors |
| `whatsapp_number` | String | E.164 format |
| `status` | Enum | `TRIAL`, `ACTIVE`, `SUSPENDED` |
| `trial_ends_at` | Timestamp | For the 30-day free trial |

### 3. `rooms`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key |
| `name` | String | e.g., "Modern Living Room" |
| `panorama_url` | String | URL to 360 image |
| `config` | JSONB | Stores object placeholder coordinates |

### 4. `products`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key |
| `vendor_id` | UUID (FK) | Reference to `vendors` |
| `object_tag` | String | e.g., "modern_sofa" (links to 3D mesh) |
| `title` | String | Product title |
| `description` | Text | Product details |
| `price` | Decimal | Vendor's retail price |
| `deposit_override` | Decimal | Optional custom escrow amount |

### 5. `orders`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key |
| `customer_id` | UUID (FK) | Reference to `users` |
| `product_id` | UUID (FK) | Reference to `products` |
| `short_code` | String (Unique)| Encrypted/Short ID for WhatsApp |
| `escrow_amount` | Decimal | Amount paid to platform |
| `status` | Enum | `PENDING`, `HANDSHAKE`, `COMPLETED`, `CANCELLED` |
| `payment_intent_id`| String | From Payment Gateway |

### 6. `subscriptions` (SaaS Model)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID (PK) | Primary Key |
| `vendor_id` | UUID (FK) | Reference to `vendors` |
| `tier` | Enum | `BASIC`, `PRO`, `ENTERPRISE` |
| `expires_at` | Timestamp | Subscription end date |

## Relationships
*   `rooms` contains multiple `object_tags`.
*   Many `products` can share the same `object_tag` (Competitive Slot).
*   `orders` link a `customer` to a `product` via a successful `escrow_transaction`.
