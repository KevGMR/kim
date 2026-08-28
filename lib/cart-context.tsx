"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MenuItem } from "./data";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  unit: string;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  setQty: (item: MenuItem, qty: number) => void;
  qtyFor: (id: string) => number;
  total: number;
  count: number;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "butchery-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setLines(JSON.parse(raw));
      } catch {
        setLines([]);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    }
  }, [lines, hydrated]);

  const setQty = (item: MenuItem, qty: number) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === item.id);
      if (qty <= 0) {
        return prev.filter((l) => l.id !== item.id);
      }
      if (existing) {
        return prev.map((l) => (l.id === item.id ? { ...l, qty } : l));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, unit: item.unit, qty }];
    });
  };

  const qtyFor = (id: string) => lines.find((l) => l.id === id)?.qty ?? 0;

  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const count = lines.reduce((sum, l) => sum + (l.qty > 0 ? 1 : 0), 0);

  const clear = () => setLines([]);

  return (
    <CartContext.Provider value={{ lines, setQty, qtyFor, total, count, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
