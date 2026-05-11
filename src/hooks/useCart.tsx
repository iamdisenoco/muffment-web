"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Item del carrito. Si el producto soporta selector de color, color
 * captura el color elegido (id + name + hex para mostrar la bolita).
 */
export type CartItem = {
  slug: string;
  code: string;
  name: string;
  shortName: string;
  priceLabel: string;
  price: number;
  hero: string; // hero original del producto (sin color)
  shippingSize: "pequeno" | "mediano" | "grande";
  quantity: number;
  color?: {
    id: string;
    name: string;
    hex: string;
  };
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "muffment-cart-v1";

// Cada item se identifica por slug + color id (el mismo producto en
// 2 colores distintos son 2 line items separados).
function getItemKey(item: Pick<CartItem, "slug" | "color">) {
  return `${item.slug}::${item.color?.id ?? "default"}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hidratar desde localStorage al montar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persistir cada cambio
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const add: CartContextValue["add"] = useCallback((item, quantity = 1) => {
    setItems((prev) => {
      const key = getItemKey(item);
      const existing = prev.find((p) => getItemKey(p) === key);
      if (existing) {
        return prev.map((p) =>
          getItemKey(p) === key
            ? { ...p, quantity: p.quantity + quantity }
            : p,
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setIsOpen(true);
  }, []);

  const remove: CartContextValue["remove"] = useCallback((key) => {
    setItems((prev) => prev.filter((p) => getItemKey(p) !== key));
  }, []);

  const updateQuantity: CartContextValue["updateQuantity"] = useCallback(
    (key, quantity) => {
      if (quantity <= 0) {
        setItems((prev) => prev.filter((p) => getItemKey(p) !== key));
        return;
      }
      setItems((prev) =>
        prev.map((p) => (getItemKey(p) === key ? { ...p, quantity } : p)),
      );
    },
    [],
  );

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    isOpen,
    open,
    close,
    toggle,
    add,
    remove,
    updateQuantity,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { getItemKey };
