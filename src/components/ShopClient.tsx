'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/types';

interface ShopClientProps {
  products: Product[];
}

// Placeholder images with varying aspect ratios
const placeholderImages = [
  { url: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=600&q=80', aspect: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', aspect: 'square' },
  { url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=600&q=80', aspect: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', aspect: 'landscape' },
  { url: 'https://images.unsplash.com/photo-1489914099268-1dad649f76bf?w=600&q=80', aspect: 'square' },
  { url: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80', aspect: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=600&q=80', aspect: 'landscape' },
  { url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600&q=80', aspect: 'square' },
];

const getAspectClass = (aspect: string) => {
  switch (aspect) {
    case 'portrait':
      return 'aspect-[3/4]';
    case 'landscape':
      return 'aspect-[4/3]';
    case 'square':
    default:
      return 'aspect-square';
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);
};

export function ShopClient({ products }: ShopClientProps) {
  return (
    <div className="min-h-screen pt-nav-height pb-footer-height">
      {/* Grid - Full Width, Top Aligned */}
      <div className="w-full px-4 py-4">
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 items-start"
        >
          {products.map((product, index) => {
            const placeholder = placeholderImages[index % placeholderImages.length];
            const isAvailable = product.available;
            
            return (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <Link
                  href={`/shop/${product.slug}`}
                  className={`group block ${!isAvailable ? 'pointer-events-none' : ''}`}
                >
                  {/* Image */}
                  <div className={`
                    relative overflow-hidden bg-border/10
                    ${getAspectClass(placeholder.aspect)}
                    ${!isAvailable ? 'opacity-40' : ''}
                  `}>
                    <img
                      src={placeholder.url}
                      alt={product.title}
                      className="
                        w-full h-full object-cover
                        transition-transform duration-500 ease-out
                        group-hover:scale-[1.02]
                      "
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

                  {/* Price below image - gray, black on hover */}
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
