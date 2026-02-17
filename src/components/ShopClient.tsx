'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/types';
import { urlFor } from '@/lib/sanity';

interface ShopClientProps {
  products: Product[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);
};

export function ShopClient({ products }: ShopClientProps) {
  // Get image URL from Sanity or fallback
  const getImageUrl = (product: Product) => {
    if (product.images && product.images[0]?.asset) {
      return urlFor(product.images[0]).width(600).quality(80).url();
    }
    return 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=600&q=80';
  };

  return (
    <div className="min-h-screen pt-nav-height pb-footer-height">
      {/* Masonry Grid - columns for native aspect ratios */}
      <div className="w-full px-4 py-4">
        <motion.div
          layout
          className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-3"
        >
          {products.map((product, index) => {
            const isAvailable = product.available;
            
            return (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="break-inside-avoid mb-3"
              >
                <Link
                  href={`/shop/${product.slug}`}
                  className={`group block ${!isAvailable ? 'pointer-events-none' : ''}`}
                >
                  {/* Image - native aspect ratio */}
                  <div className={`
                    relative overflow-hidden bg-border/10
                    ${!isAvailable ? 'opacity-40' : ''}
                  `}>
                    <img
                      src={getImageUrl(product)}
                      alt={product.title}
                      className="
                        w-full h-auto
                        transition-transform duration-500 ease-out
                        group-hover:scale-[1.02]
                      "
                      style={{ maxWidth: '100%' }}
                    />
                    
                    {/* Sold out overlay */}
                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-nav font-normal text-foreground uppercase tracking-wide">
                          Épuisé
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price below image */}
                  <p className={`
                    text-project-title font-normal mt-1.5 transition-colors duration-300
                    ${isAvailable 
                      ? 'text-muted group-hover:text-foreground' 
                      : 'text-muted line-through'
                    }
                  `}>
                    {formatPrice(product.price)}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty state */}
        {products.length === 0 && (
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
