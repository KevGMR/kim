# Nyama Fresh — ordering prototype

A minimal 3-screen Next.js prototype: Menu/Cart → Pay → Order status.

## Run it

```
npm install
npm run dev
```

Then open http://localhost:3000

## What's real vs mocked

- **Cart, menu, checkout form, order ticket UI** — fully working, built with
  React state + localStorage (no backend needed to try the flow).
- **M-Pesa payment** — simulated. The "Pay with M-Pesa" button shows the
  waiting-for-PIN screen and auto-resolves after ~4 seconds. To make it real,
  replace the `setTimeout` block in `app/checkout/page.tsx` with an API route
  that calls Safaricom's Daraja STK Push endpoint, and use Daraja's callback
  URL to confirm payment before creating the order.
- **Order status progression** — auto-advances every 4 seconds for the demo.
  In production this would be driven by staff updating status from a POS/
  admin dashboard, pushed to the customer via a webhook or polling.
- **Delivery/location** — single location assumed. To support multiple
  branches, add a `locationId` to `Order` and `MenuItem`, and filter the menu
  and delivery-radius check by the customer's nearest branch.

## Structure

```
app/
  page.tsx              menu + cart (screen 1)
  checkout/page.tsx      payment (screen 2)
  order/[id]/page.tsx    live order ticket (screen 3)
  layout.tsx, globals.css
lib/
  data.ts                menu items + order types
  cart-context.tsx       cart state, persisted to localStorage
```
