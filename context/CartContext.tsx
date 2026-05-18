import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  competitionId: string;
  competitionTitle: string;
  slug: string;
  ticketPrice: number;
  quantity: number;
  imageUrl?: string;
  maxPerOrder: number;
  maxTickets: number;
  ticketsSold: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (competitionId: string, quantity: number) => void;
  removeItem: (competitionId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("luxraffle_cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem("luxraffle_cart", JSON.stringify(items));
    }
  }, [items, hydrated]);

  function addItem(
    incoming: Omit<CartItem, "quantity"> & { quantity?: number }
  ) {
    const qty = incoming.quantity ?? 1;
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.competitionId === incoming.competitionId
      );
      if (existing) {
        const newQty = Math.min(
          existing.quantity + qty,
          incoming.maxPerOrder,
          incoming.maxTickets - incoming.ticketsSold
        );
        return prev.map((i) =>
          i.competitionId === incoming.competitionId
            ? { ...i, quantity: newQty }
            : i
        );
      }
      return [...prev, { ...incoming, quantity: qty }];
    });
  }

  function updateQuantity(competitionId: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) => {
        if (i.competitionId !== competitionId) return i;
        const capped = Math.min(
          Math.max(1, quantity),
          i.maxPerOrder,
          i.maxTickets - i.ticketsSold
        );
        return { ...i, quantity: capped };
      })
    );
  }

  function removeItem(competitionId: string) {
    setItems((prev) => prev.filter((i) => i.competitionId !== competitionId));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce(
    (sum, i) => sum + i.ticketPrice * i.quantity,
    0
  );
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
