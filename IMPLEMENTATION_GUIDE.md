# OmniView Backend Implementation Guide: Escrow & WhatsApp Bridge

This guide details the technical logic for bridging secure payments with physical vendor handshakes.

## 1. The Escrow Webhook Lifecycle

### A. Payment Initiation (Frontend)
When the user clicks "Secure via WhatsApp", the frontend calls `/api/orders/create`.
1.  Verify product availability.
2.  Calculate the `escrow_deposit` (e.g., 5% of `product.price` or minimum $10).
3.  Create a Stripe `PaymentIntent`.
4.  Return the `client_secret` to the frontend.

### B. The Webhook Listener (`/api/webhooks/escrow`)
This is the most critical bridge.

```typescript
app.post("/api/webhooks/escrow", async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    // 1. GENERATE HANDSHAKE
    const shortCode = generateSecureShortCode(); // e.g., "OV-X92F"
    
    // 2. UPDATE DB
    await db.orders.update({
      where: { id: orderId },
      data: { 
        status: 'HANDSHAKE',
        handshake_code: shortCode,
        escrow_paid_at: new Date()
      }
    });

    // 3. TRIGGER VENDOR NOTIFICATION
    const vendor = await getVendorByOrderId(orderId);
    await notifyVendorSocket(vendor.id, {
      type: 'NEW_ESCROW_HANDSHAKE',
      orderId: orderId,
      code: shortCode
    });
  }

  res.json({received: true});
});
```

## 2. The WhatsApp Routing Mechanism

Once the webhook confirms success, the frontend redirects to a "Success Page" which renders the WhatsApp Deep Link.

### URL Construction Rule
`https://wa.me/{vendor_whatsapp}?text={encoded_message}`

**Template Message:**
"سلام، أرغب في تأكيد طلبي لـ [اسم المنتج]. لقد دفعت عربون الجدية برقم: [ShortCode]. يرجى خصم المبلغ من الفاتورة النهائية."

## 3. Post-Purchase Feedback Loop (Automated)

To protect commissions and ensure the "7-14 day safety window":

1.  **Scheduled Trigger**: 48 hours after the WhatsApp handshake, the system sends an automated SMS/Email to the customer.
2.  **Confirmation Link**: "Did you finalize the purchase with the vendor? [YES/NO]"
    *   **IF YES**: System asks for the final invoice amount (for commission audit).
    *   **IF NO**: System triggers an investigation.
3.  **Settlement**: If no investigation is opened within 14 days, the escrow funds transition from `PENDING` to `WITHDRAWABLE` in the vendor's wallet.

## 4. Vendor Enforcement (Dashboard)
Vendors must see a "Handshake Verification" tab.
*   The vendor enters the `ShortCode` provided by the customer.
*   The system confirms validity and shows the EXACT deposit amount to be deducted.
*   If the vendor fails to deduct the deposit, the customer reported investigation will penalize the vendor's "Reliability Score".
