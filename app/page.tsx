"use client";

import Link from "next/link";
import { MENU } from "@/lib/data";
import { useCart } from "@/lib/cart-context";

function formatKsh(n: number) {
  return `Ksh ${n.toLocaleString("en-KE", { maximumFractionDigits: 0 })}`;
}

function QtyStepper({ itemId }: { itemId: string }) {
  const { qtyFor, setQty } = useCart();
  const item = MENU.find((m) => m.id === itemId)!;
  const qty = qtyFor(itemId);

  if (qty <= 0) {
    return (
      <button className="btn-secondary" onClick={() => setQty(item, item.step)}>
        Add
      </button>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <button
        aria-label={`Remove one ${item.name}`}
        className="btn-secondary"
        style={{ width: 36, height: 36, padding: 0 }}
        onClick={() => setQty(item, Math.max(0, +(qty - item.step).toFixed(2)))}
      >
        −
      </button>
      <span className="mono" style={{ minWidth: 44, textAlign: "center" }}>
        {qty}
        {item.unit === "kg" ? "kg" : ""}
      </span>
      <button
        aria-label={`Add one ${item.name}`}
        className="btn-secondary"
        style={{ width: 36, height: 36, padding: 0 }}
        onClick={() => setQty(item, +(qty + item.step).toFixed(2))}
      >
        +
      </button>
    </div>
  );
}

export default function MenuPage() {
  const { total, count } = useCart();
  const butchery = MENU.filter((m) => m.category === "butchery");
  const kitchen = MENU.filter((m) => m.category === "kitchen");

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: "28px 20px 120px" }}>
      <header style={{ marginBottom: 28 }}>
        <p className="mono" style={{ color: "var(--muted)", fontSize: 13, letterSpacing: 1, marginBottom: 4 }}>
          NYAMA FRESH · PICKUP OR DELIVERY
        </p>
        <h1 style={{ fontSize: 28 }}>What are you having today?</h1>
      </header>

      <Section title="Butchery" items={butchery} />
      <Section title="Kitchen" items={kitchen} />

      {count > 0 && (
        <div
          style={{
            position: "sticky",
            bottom: 16,
            marginTop: 24,
            background: "var(--ink)",
            color: "var(--paper)",
            borderRadius: 10,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 13, opacity: 0.75 }}>
              {count} item{count > 1 ? "s" : ""}
            </div>
            <div className="mono" style={{ fontSize: 18, fontWeight: 600 }}>
              {formatKsh(total)}
            </div>
          </div>
          <Link href="/checkout">
            <button className="btn-primary">View cart</button>
          </Link>
        </div>
      )}
    </main>
  );
}

function Section({ title, items }: { title: string; items: typeof MENU }) {
  return (
    <section style={{ marginBottom: 28 }}>
      <h2 style={{ fontSize: 18, marginBottom: 12, color: "var(--stamp-dark)" }}>{title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "#fffdf9",
              border: "1px solid var(--line)",
              borderRadius: 8,
              padding: "12px 14px",
            }}
          >
            <div>
              <div style={{ fontWeight: 500, fontSize: 15 }}>{item.name}</div>
              <div className="mono" style={{ fontSize: 13, color: "var(--muted)" }}>
                {formatKsh(item.price)} / {item.unit}
              </div>
            </div>
            <QtyStepper itemId={item.id} />
          </div>
        ))}
      </div>
    </section>
  );
}
