'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/types';
import { urlFor } from '@/lib/sanity';
import { createCheckout } from '@/lib/shopify';

interface ProductClientProps {
  product: Product;
}

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
  const [error, setError] = useState<string | null>(null);

  // Get all image URLs from Sanity
  const getImageUrls = () => {
    if (product.images && product.images.length > 0) {
      return product.images
        .filter((img) => img?.asset)
        .map((img) => urlFor(img).width(800).quality(85).url());
    }
    return ['https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?w=800&q=80'];
  };

  const imageUrls = getImageUrls();

  const handleAddToCart = async () => {
    if (!product.available) return;
    
    // Check if product has Shopify variant ID
    if (!product.shopifyVariantId) {
      setError('Produit non configuré pour la vente');
      return;
    }
    
    setIsAdding(true);
    setError(null);
    
    try {
      const checkout = await createCheckout(product.shopifyVariantId, 1);
      
      if (checkout?.webUrl) {
        // Redirect to Shopify checkout
        window.open(checkout.webUrl, '_blank');
      } else {
        setError('Erreur lors de la création du panier');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Erreur lors de la création du panier');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 pt-nav-height pb-footer-height flex items-center">
      {/* Desktop layout */}
      <div className="hidden md:flex w-full h-full px-4">

        {/* Left - Image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-1/2 flex items-center justify-center pr-8"
        >
          {/* Thumbnails - fixed left, aligned with navbar px-4 */}
          {imageUrls.length > 1 && (
            <div className="fixed left-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2">
              {imageUrls.map((url, index) => (
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
                    src={url}
                    alt={`${product.title} - vue ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ maxWidth: '100%' }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="relative w-[70%]">
            <img
              src={imageUrls[activeImage]}
              alt={product.title}
              className="w-full h-auto"
            />

            {!product.available && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <span className="text-body font-normal">Épuisé</span>
              </div>
            )}
          </div>
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

          {/* Error message */}
          {error && (
            <p className="text-nav text-red-500 mb-4">{error}</p>
          )}

          {/* Add to cart / Buy button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.available || isAdding || !product.shopifyVariantId}
            className={`
              w-full max-w-xs py-3 text-nav font-normal uppercase tracking-wide
              transition-all duration-300
              ${product.available && product.shopifyVariantId
                ? 'bg-foreground text-background hover:opacity-80' 
                : 'bg-border text-muted cursor-not-allowed'
              }
            `}
          >
            {isAdding 
              ? 'Redirection...' 
              : product.available 
                ? 'Acheter' 
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

      {/* Mobile layout - image behind, info fixed position */}
      <div className="flex md:hidden w-full h-full relative px-4">
        {/* Main image - centered, behind info block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-start justify-center pt-4"
        >
          <div className="relative w-[70%]">
            <img
              src={imageUrls[activeImage]}
              alt={product.title}
              className="w-full h-auto"
            />

            {!product.available && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                <span className="text-body font-normal">Épuisé</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Thumbnails left + info right, fixed at bottom third */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="absolute bottom-0 left-0 right-0 px-4 pb-4 flex gap-8 z-10"
        >
          {/* Thumbnails - vertical column (invisible spacer if single image) */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            {imageUrls.length > 1 ? (
              imageUrls.map((url, index) => (
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
                    src={url}
                    alt={`${product.title} - vue ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ maxWidth: '100%' }}
                  />
                </button>
              ))
            ) : (
              <div className="w-12 h-12" />
            )}
          </div>

          {/* Info - pr to compensate thumbnails width visually */}
          <div className="flex-1 pr-[calc(3rem+2rem)]">
            <Link
              href="/shop"
              className="text-nav text-muted hover:text-foreground transition-colors duration-300 mb-6 block"
            >
              ← Retour
            </Link>

            <h1 className="text-heading font-normal mb-2">
              {product.title}
            </h1>

            <p className={`
              text-body mb-6
              ${!product.available ? 'text-muted line-through' : 'text-foreground'}
            `}>
              {formatPrice(product.price)}
            </p>

            {product.description && (
              <p className="text-body text-muted mb-6">
                {product.description}
              </p>
            )}

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

            {error && (
              <p className="text-nav text-red-500 mb-4">{error}</p>
            )}

            <button
              onClick={handleAddToCart}
              disabled={!product.available || isAdding || !product.shopifyVariantId}
              className={`
                w-full py-3 text-nav font-normal uppercase tracking-wide
                transition-all duration-300
                ${product.available && product.shopifyVariantId
                  ? 'bg-foreground text-background hover:opacity-80'
                  : 'bg-border text-muted cursor-not-allowed'
                }
              `}
            >
              {isAdding
                ? 'Redirection...'
                : product.available
                  ? 'Acheter'
                  : 'Épuisé'
              }
            </button>

            {product.details && (
              <p className="text-nav text-muted mt-4">
                {product.details}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
