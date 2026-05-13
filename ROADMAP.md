# OmniView Phase-1 Development Roadmap

## Phase 1: Core Experience (Weeks 1-4)

### Week 1: Foundational 3D Scene
*   [ ] Initialize Three.js Boilerplate with Equirectangular panorama support.
*   [ ] Implement Room Config Parser (JSON -> 3D Object Placeholders).
*   [ ] Interaction System: Raycaster-based selection for "Object Slots".

### Week 2: Competitive Backend
*   [ ] Express API for Vendor Product Upload.
*   [ ] Pricing Service logic: Fetch products by `object_tag` sorted by price.
*   [ ] Blind Ranking Engine: Hide vendor names from marketplace views.

### Week 3: Escrow & WhatsApp Handshake
*   [ ] Stripe Integration: Create Payment Intent for "Good Faith Deposit".
*   [ ] Escrow Webhook Handler in Express.
*   [ ] WhatsApp Deep-link Generator (Constructs pre-filled message with Short Order ID).

### Week 4: Vendor Dashboard Alpha
*   [ ] "Price Competitiveness Index" UI (Dynamic Gauge component).
*   [ ] Order Management: Tracking WhatsApp handshakes.
*   [ ] 2FA & Basic RBAC security implementation.

## Success Metrics for Phase 1
*   Average Scene Load Time < 3s (using Draco).
*   Successful end-to-end flow from 3D click -> Escrow -> WhatsApp Handoff.
*   Zero PII leak between competing vendors in the API.
