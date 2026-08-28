"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { Order } from "@/lib/data";

function formatKsh(n: number) {
  return `Ksh ${n.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;
}

function isValidKenyanPhone(phone: string) {
  return /^(?:\+254|0)[71]\d{8}$/.test(phone.replace(/\s/g, ""));
}

function makeOrderId() {
  return "NF-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

type Stage = "form" | "waiting_for_pin" | "confirming";

export default function CheckoutPage() {
  const { lines, total, clear } = useCart();
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ phone?: string; address?: string }>({});
  const [stage, setStage] = useState<Stage>("form");

  const handlePay = () => {
    const nextErrors: typeof errors = {};
    if (!isValidKenyanPhone(phone)) {
      nextErrors.phone = "Enter a valid M-Pesa number, e.g. 0712 345 678";
    }
    if (!address.trim()) {
      nextErrors.address = "Enter a delivery address";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStage("waiting_for_pin");

    // Simulates the STK push round trip: customer receives a prompt on
    // their phone, enters their M-Pesa PIN, Safaricom confirms the payment.
    setTimeout(() => {
      setStage("confirming");
      setTimeout(() => {
        const id = makeOrderId();
        const order: Order = {
          id,
          items: lines.map((l) => ({ id: l.id, name: l.name, price: l.price, unit: l.unit, qty: l.qty })),
          total,
          phone,
          address,
          status: "paid",
          createdAt: Date.now(),
        };
        const raw = window.localStorage.getItem("butchery-orders");
        const all = raw ? JSON.parse(raw) : {};
        all[id] = order;
        window.localStorage.setItem("butchery-orders", JSON.stringify(all));
        clear();
        router.push(`/order/${id}`);
      }, 1600);
    }, 2200);
  };

  if (lines.length === 0 && stage === "form") {
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>Your cart is empty</h1>
        <p style={{ color: "var(--muted)" }}>Add something from the menu to get started.</p>
      </main>
    );
  }

  if (stage === "waiting_for_pin" || stage === "confirming") {
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "80px 20px", textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--stamp)",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fdf6ec",
            fontSize: 26,
            animation: "pulse 1.4s ease-in-out infinite",
          }}
        >
          <PhoneIcon />
        </div>
        <style>{`@keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.08); opacity: 0.85; } }`}</style>
        <h1 style={{ fontSize: 20, marginBottom: 8 }}>
          {stage === "waiting_for_pin" ? "Check your phone" : "Confirming payment"}
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>
          {stage === "waiting_for_pin"
            ? `Enter your M-Pesa PIN on the prompt sent to ${phone} to pay ${formatKsh(total)}.`
            : "Almost there — confirming with M-Pesa."}
        </p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "28px 20px 60px" }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Your order</h1>

      <div style={{ border: "1px solid var(--line)", borderRadius: 8, background: "#fffdf9", marginBottom: 24 }}>
        {lines.map((l, i) => (
          <div
            key={l.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom: i < lines.length - 1 ? "1px solid var(--line)" : "none",
              fontSize: 15,
            }}
          >
            <span>
              {l.name} <span className="mono" style={{ color: "var(--muted)" }}>× {l.qty}{l.unit === "kg" ? "kg" : ""}</span>
            </span>
            <span className="mono">{formatKsh(l.price * l.qty)}</span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 16px",
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          <span>Total</span>
          <span className="mono">{formatKsh(total)}</span>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
          M-Pesa phone number
        </label>
        <input
          type="tel"
          placeholder="0712 345 678"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone && <div className="error-text">{errors.phone}</div>}
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
          Delivery address
        </label>
        <input
          type="text"
          placeholder="e.g. Kilimani, Argwings Kodhek Rd, apartment 4B"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {errors.address && <div className="error-text">{errors.address}</div>}
      </div>

      <button className="btn-primary" style={{ width: "100%" }} onClick={handlePay}>
        Pay with M-Pesa · {formatKsh(total)}
      </button>
    </main>
  );
}

function PhoneIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
