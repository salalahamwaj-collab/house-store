# OmniView 360° Marketplace: Technical Architecture

## 1. Overview
OmniView is a high-fidelity 360° virtual marketplace connecting vendors with customers through an immersive spatial interface. It features a unique competitive engine and a secure "Escrow-to-WhatsApp" transaction flow.

## 2. Tech Stack
*   **Frontend**: React 18, Vite, Three.js (WebGL rendering), Tailwind CSS (Styling), Framer Motion (Animations).
*   **Backend**: Node.js, Express (API & Webhooks), `google-genai` (for reverse-bidding image analysis).
*   **Database**: PostgreSQL (Cloud SQL) or Firestore (for real-time price updates).
*   **3D Pipeline**: GLTF/GLB models with Draco compression via `three/examples/jsm/loaders/DRACOLoader`.
*   **Payment**: Stripe (or similar) for the "Good Faith Escrow Deposit".
*   **Communication**: WhatsApp Business API (Deep linking).

## 3. Core Modules
### A. Interactive 360° Scene (`Scene360`)
*   Uses `Three.js` with an `Equirectangular` panorama background.
*   Interactive invisible "Mesh Targets" or transparent placeholders mapped to object IDs.
*   Raycaster logic to detect clicks and trigger the **Smart Pop-up**.

### B. Competitive Engine
*   **Blind Pricing Service**: An internal API that fetches products for a specific "Object Tag" (e.g., `coffee_table_01`).
*   **Auto-Ranking**: Products are sorted by `current_price` ASC. Only the top-ranked item is featured in the primary 3D view.
*   **Anonymity Layer**: Backend filters out `vendor_id` and `brand_name` from competing entries before sending data to other vendor dashboards.

### C. Escrow & WhatsApp Handshake
1.  **Checkout**: User pays the `Escrow Deposit`.
2.  **Webhook**: Payment provider notifies Express server.
3.  **Handoff**: Server generates a `short_order_id` and constructs a WhatsApp URL: `https://wa.me/{vendor_phone}?text=Order%20{short_order_id}`.
4.  **Verification**: Vendor enters `short_order_id` in their dashboard to confirm the deposit for the final invoice.

## 4. Security & Performance
*   **Draco Compression**: Reduces 3D model size by up to 90% for faster mobile loading.
*   **Mesh Protection**: Assets are served via signed URLs with chunked loading. Right-click is disabled on the canvas.
*   **RBAC**: Strict separation between `ADMIN`, `VENDOR`, and `CUSTOMER` roles.

## 5. Reverse-Bidding AI
*   Uses Gemini Vision (`gemini-3.1-pro-preview`) to analyze user-uploaded designs in the "Custom Request" section.
*   Extracts color, material, and style attributes to notify relevant vendors.
