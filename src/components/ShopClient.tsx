'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Product, ShopCategory } from '@/types';
import { urlFor } from '@/lib/sanity';
import { useCart } from '@/context/CartContext';

interface ShopClientProps {
  products: Product[];
  categories: ShopCategory[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function ShopClient({ products, categories }: ShopClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { addItem } = useCart();
  const [shuffleKey, setShuffleKey] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState<Product[]>([]);

  const getImageUrl = (product: Product) => {
    if (product.images && product.images[0]?.asset) {
      return urlFor(product.images[0]).width(600).quality(80).url();
    }
    return 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=600&q=80';
  };

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return products;
    return products.filter((p) => p.category?.slug === activeFilter);
  }, [products, activeFilter]);

  const displayed = useMemo(() => {
    if (!isShuffled) return filtered;
    // Re-shuffle when shuffleKey changes, but keep same filter
    return shuffle(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, shuffleKey]);

  const handleShuffle = useCallback(() => {
    setIsShuffled(true);
    setShuffleKey((k) => k + 1);
  }, []);

  const handleFilter = (cat: string) => {
    setActiveFilter(cat);
    setIsShuffled(false);
  };

  const handleQuickAdd = useCallback((product: Product) => {
    if (!product.shopifyVariantId) return;
    addItem({
      variantId: product.shopifyVariantId,
      productId: product._id,
      title: product.title,
      price: product.price,
      imageUrl: getImageUrl(product),
    });
  }, [addItem]);

  return (
    <div className="min-h-screen pt-nav-height pb-footer-height">
      {/* Filters + Shuffle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-nav-height z-40 bg-background/5"
      >
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between text-nav">
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => handleFilter('all')}
                className={`transition-colors duration-300 ${
                  activeFilter === 'all' ? 'text-foreground' : 'text-muted hover:text-foreground'
                }`}
              >
                Tout
              </button>
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleFilter(cat.slug)}
                  className={`transition-colors duration-300 ${
                    activeFilter === cat.slug
                      ? 'text-foreground'
                      : 'text-muted hover:text-foreground'
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            <button
              onClick={handleShuffle}
              className="text-muted hover:text-foreground transition-colors duration-300"
            >
              Shuffle
            </button>
          </div>
        </div>
      </motion.div>

      {/* Masonry Grid */}
      <div className="w-full px-4 py-4">
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-6 gap-3 items-start"
        >
          <AnimatePresence mode="popLayout">
            {displayed.map((product, index) => {
              const isAvailable = product.available;

              return (
                <motion.div
                  key={`${product._id}-${shuffleKey}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="self-start"
                >
                  <Link
                    href={`/shop/${product.slug}`}
                    className={`group block ${!isAvailable ? 'pointer-events-none' : ''}`}
                  >
                    <div
                      className={`relative overflow-hidden bg-border/10 ${
                        !isAvailable ? 'opacity-40' : ''
                      }`}
                    >
                      <img
                        src={getImageUrl(product)}
                        alt={product.title}
                        className="w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        style={{ maxWidth: '100%' }}
                      />
                      {!isAvailable && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-nav font-normal text-foreground uppercase tracking-wide">
                            Épuisé
                          </span>
                        </div>
                      )}
                      {isAvailable && !product.isClothing && product.shopifyVariantId && (
                        <button
                          onClick={(e) => { e.preventDefault(); handleQuickAdd(product); }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          aria-label="Ajouter au panier"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="mt-1.5 flex flex-col gap-0.5">
                      <p className={`text-project-title font-normal transition-colors duration-300 ${
                        isAvailable ? 'text-foreground' : 'text-muted'
                      }`}>
                        {product.title}
                      </p>
                      <p
                        className={`text-project-title font-normal transition-colors duration-300 ${
                          isAvailable
                            ? 'text-muted group-hover:text-foreground'
                            : 'text-muted line-through'
                        }`}
                      >
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {displayed.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted py-20"
          >
            Aucun produit disponible pour le moment.
          </motion.p>
        )}
      </div>
    </div>
  );
}
