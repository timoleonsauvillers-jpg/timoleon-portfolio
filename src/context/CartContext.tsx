'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CartItem } from '@/types';
import { createCheckout } from '@/lib/shopify';

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isOpen: boolean;
  checkoutError: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'timoleon-cart';

function itemKey(item: Pick<CartItem, 'productId' | 'variantId'>) {
  return `${item.productId}__${item.variantId}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Load from localStorage after mount (avoid SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    const key = itemKey(item);
    setItems((prev) => {
      const existing = prev.find((i) => itemKey(i) === key);
      if (existing) {
        return prev.map((i) => itemKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => itemKey(i) !== key));
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => itemKey(i) !== key));
    } else {
      setItems((prev) => prev.map((i) => itemKey(i) === key ? { ...i, quantity: qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const checkout = useCallback(async () => {
    if (items.length === 0) return;
    setCheckoutError(null);

    const validItems = items.filter((i) => i.variantId && i.variantId !== 'undefined');
    if (validItems.length === 0) {
      setCheckoutError('Aucun produit valide dans le panier.');
      return;
    }
    if (validItems.length < items.length) {
      setCheckoutError('Certains produits ne peuvent pas être achetés (variante manquante).');
      return;
    }

    try {
      const result = await createCheckout(
        validItems.map((i) => ({ variantId: i.variantId, quantity: i.quantity }))
      );
      if (result?.webUrl) {
        window.open(result.webUrl, '_blank');
        clearCart();
        setIsOpen(false);
      } else {
        setCheckoutError('Impossible de créer le checkout. Réessaie.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err instanceof Error ? err.message : 'Erreur lors du checkout.');
    }
  }, [items, clearCart]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, itemCount, totalPrice, isOpen, checkoutError,
      openCart, closeCart, addItem, removeItem, updateQty, clearCart, checkout,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
