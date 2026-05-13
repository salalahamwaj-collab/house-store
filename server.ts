import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  /**
   * WEBHOOK: Escrow Payment Gateway
   * This bridges the payment gateway with the WhatsApp handover.
   */
  app.post("/api/webhooks/escrow", async (req, res) => {
    // In production, verify Stripe signature here
    const { order_id, status } = req.body;

    if (status === "succeeded") {
      console.log(`Escrow succeeded for Order ${order_id}`);
      
      // 1. Update order status in DB to 'HANDSHAKE'
      // 2. Generate WhatsApp handover URL
      // 3. Notify vendor dashboard (via WebSocket if implemented)
      
      return res.status(200).json({ received: true });
    }

    res.status(400).json({ error: "Invalid status" });
  });

  /**
   * Ranking Engine: Blind Price Competition
   * Fetches products for a specific 3D mesh target, hiding vendor identities.
   */
  app.get("/api/products/slot/:tag", async (req, res) => {
    const { tag } = req.params;
    
    // Logic: 
    // SELECT id, title, price, description 
    // FROM products 
    // WHERE object_tag = :tag 
    // ORDER BY price ASC
    
    // MOCK DATA for demonstration
    const products = [
      { id: "1", title: "Modern Coffee Table - Oak", price: 120, description: "Solid oak table with glass top." },
      { id: "2", title: "Industrial Table", price: 145, description: "Metal frame with reclaimed wood." },
    ];

    res.json(products);
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`OmniView Server running on http://localhost:${PORT}`);
  });
}

startServer();
