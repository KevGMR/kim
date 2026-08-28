"use client";

import { useEffect, useState } from "react";
import { Order, OrderStatus, STATUS_LABEL, STATUS_SEQUENCE } from "@/lib/data";

function formatKsh(n: number) {
  return `Ksh ${n.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;
}

export default function OrderStatusPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    const raw = window.localStorage.getItem("butchery-orders");
    const all = raw ? JSON.parse(raw) : {};
    setOrder(all[params.id] ?? null);
  }, [params.id]);

  // Demo-only: advances the order through the delivery pipeline automatically
  // so you can see what customers would see as staff update real orders.
  useEffect(() => {
    if (!order) return;
    const currentIndex = STATUS_SEQUENCE.indexOf(order.status);
    if (currentIndex >= STATUS_SEQUENCE.length - 1) return;

    const timer = setTimeout(() => {
      const nextStatus = STATUS_SEQUENCE[currentIndex + 1];
      setOrder((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, status: nextStatus };
        const raw = window.localStorage.getItem("butchery-orders");
        const all = raw ? JSON.parse(raw) : {};
        all[updated.id] = updated;
        window.localStorage.setItem("butchery-orders", JSON.stringify(all));
        return updated;
      });
    }, 4000);

    return () => clearTimeout(timer);
  }, [order]);

  if (order === undefined) return null;

  if (order === null) {
    return (
      <main style={{ maxWidth: 560, margin: "0 auto", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: 20 }}>Order not found</h1>
        <p style={{ color: "var(--muted)" }}>This order may have been placed on a different device.</p>
      </main>
    );
  }

  const currentIndex = STATUS_SEQUENCE.indexOf(order.status);

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div
        style={{
          background: "#fffdf9",
          border: "1px solid var(--line)",
          borderRadius: 10,
          padding: "24px 22px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>ORDER</div>
          <div className="mono" style={{ fontSize: 22, fontWeight: 600, letterSpacing: 1 }}>{order.id}</div>
        </div>

        <div style={{ borderTop: "1px dashed var(--line)", borderBottom: "1px dashed var(--line)", padding: "14px 0", marginBottom: 20 }}>
          {order.items.map((it) => (
            <div key={it.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
              <span>{it.name} <span className="mono" style={{ color: "var(--muted)" }}>× {it.qty}{it.unit === "kg" ? "kg" : ""}</span></span>
              <span className="mono">{formatKsh(it.price * it.qty)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, marginTop: 10 }}>
            <span>Total</span>
            <span className="mono">{formatKsh(order.total)}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {STATUS_SEQUENCE.map((status, i) => (
            <StatusRow
              key={status}
              label={STATUS_LABEL[status]}
              done={i <= currentIndex}
              active={i === currentIndex}
            />
          ))}
        </div>

        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 20, textAlign: "center" }}>
          Delivering to {order.address}
        </p>
      </div>
    </main>
  );
}

function StatusRow({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: done ? "var(--stamp)" : "transparent",
          border: done ? "none" : "1px solid var(--line)",
          color: "#fdf6ec",
          fontSize: 13,
          transition: "background 0.3s ease",
        }}
      >
        {done ? "✓" : ""}
      </div>
      <span
        style={{
          fontSize: 15,
          color: done ? "var(--ink)" : "var(--muted)",
          fontWeight: active ? 600 : 400,
        }}
      >
        {label}
      </span>
    </div>
  );
}
