'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price);

const snapEase = [0.16, 1, 0.3, 1] as const;

export function CartDrawer() {
  const { items, itemCount, totalPrice, isOpen, checkoutError, closeCart, removeItem, updateQty, checkout } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-foreground/20"
            onClick={closeCart}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: snapEase }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-80 bg-background flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-nav-height border-b border-border flex-shrink-0">
              <span className="text-nav font-medium">
                Panier{itemCount > 0 && ` (${itemCount})`}
              </span>
              <button
                onClick={closeCart}
                className="text-muted hover:text-foreground transition-colors duration-300 text-nav"
              >
                ✕
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {items.length === 0 ? (
                <p className="text-nav text-muted text-center py-8">Votre panier est vide.</p>
              ) : (
                items.map((item) => {
                  const key = `${item.productId}__${item.variantId}`;
                  return (
                    <div key={key} className="flex gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-10 h-10 object-cover flex-shrink-0 bg-border/10"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-nav font-normal truncate">{item.title}</p>
                        {item.size && (
                          <p className="text-nav text-muted">{item.size}</p>
                        )}
                        <p className="text-nav text-muted">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <button
                          onClick={() => removeItem(key)}
                          className="text-muted hover:text-foreground transition-colors duration-200 text-nav"
                        >
                          ✕
                        </button>
                        <div className="flex items-center gap-2 text-nav">
                          <button
                            onClick={() => updateQty(key, item.quantity - 1)}
                            className="text-muted hover:text-foreground transition-colors duration-200 w-4 text-center"
                          >
                            −
                          </button>
                          <span className="w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(key, item.quantity + 1)}
                            className="text-muted hover:text-foreground transition-colors duration-200 w-4 text-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-4 py-4 border-t border-border flex-shrink-0 space-y-3">
                <div className="flex justify-between text-nav">
                  <span className="text-muted">Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {checkoutError && (
                  <p className="text-nav text-red-500">{checkoutError}</p>
                )}
                <button
                  onClick={checkout}
                  className="w-full py-3 text-nav font-normal uppercase tracking-wide bg-foreground text-background hover:opacity-80 transition-opacity duration-300"
                >
                  Commander
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
