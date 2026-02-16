'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductClientProps {
  product: Product;
}

// Placeholder images for product gallery
const placeholderGallery = [
  'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800&q=80',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
  'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&q=80',
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  }).format(price);
};

export function ProductClient({ product }: ProductClientProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product.available) return;
    
    setIsAdding(true);
    
    // TODO: Implement Shopify add to cart
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setIsAdding(false);
    alert('Produit ajouté au panier');
  };

  return (
    <div className="fixed inset-0 pt-nav-height pb-footer-height flex items-center">
      <div className="w-full h-full px-6 md:px-8 flex">
        
        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-1/2 flex flex-col justify-center pr-8"
        >
          {/* Main image */}
          <div className="relative aspect-[3/4] max-h-[65vh] overflow-hidden bg-border/10">
            <img
              src={placeholderGallery[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            
            {!product.available && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <span className="text-body font-normal">Épuisé</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {placeholderGallery.length > 1 && (
            <div className="flex gap-2 mt-3">
              {placeholderGallery.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`
                    relative w-12 h-12 overflow-hidden bg-border/10
                    transition-opacity duration-300
                    ${activeImage === index ? 'opacity-100' : 'opacity-40 hover:opacity-70'}
                  `}
                >
                  <img
                    src={img}
                    alt={`${product.title} - vue ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right - Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-1/2 flex flex-col justify-center"
        >
          {/* Back link */}
          <Link
            href="/shop"
            className="text-nav text-muted hover:text-foreground transition-colors duration-300 mb-6"
          >
            ← Retour
          </Link>

          {/* Title */}
          <h1 className="text-heading font-normal mb-2">
            {product.title}
          </h1>

          {/* Price */}
          <p className={`
            text-body mb-6
            ${!product.available ? 'text-muted line-through' : 'text-foreground'}
          `}>
            {formatPrice(product.price)}
          </p>

          {/* Description */}
          {product.description && (
            <p className="text-body text-muted mb-6 max-w-sm">
              {product.description}
            </p>
          )}

          {/* Specs */}
          <div className="space-y-1 mb-8 text-nav">
            {product.edition && (
              <div className="flex gap-4">
                <span className="text-muted w-20">Édition</span>
                <span className="text-foreground">{product.edition}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex gap-4">
                <span className="text-muted w-20">Dimensions</span>
                <span className="text-foreground">{product.dimensions}</span>
              </div>
            )}
            {product.technique && (
              <div className="flex gap-4">
                <span className="text-muted w-20">Technique</span>
                <span className="text-foreground">{product.technique}</span>
              </div>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={!product.available || isAdding}
            className={`
              w-full max-w-xs py-3 text-nav font-normal uppercase tracking-wide
              transition-all duration-300
              ${product.available 
                ? 'bg-foreground text-background hover:opacity-80' 
                : 'bg-border text-muted cursor-not-allowed'
              }
            `}
          >
            {isAdding 
              ? 'Ajout...' 
              : product.available 
                ? 'Ajouter au panier' 
                : 'Épuisé'
            }
          </button>

          {/* Shipping */}
          {product.details && (
            <p className="text-nav text-muted mt-4 max-w-sm">
              {product.details}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
