// Project types
export interface Project {
  _id: string;
  title: string;
  slug: string;
  category: 'motion' | 'print' | 'identite' | 'bac-a-sable';
  year: string;
  context?: string;
  role?: string;
  link?: string;
  thumbnail: SanityImage;
  gallery?: GalleryItem[];
  featured: boolean;
  order: number;
}

export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
  };
}

export interface SanityVideo {
  _type: 'file';
  _key: string;
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
  };
}

export type GalleryItem =
  | (SanityImage & { _key: string })
  | { _type: 'file'; _key: string; asset: { url: string } };

// Shop types
export interface SizeVariant {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL';
  shopifyVariantId: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  category?: ShopCategory;
  price: number;
  compareAtPrice?: number;
  description?: string;
  details?: string;
  edition?: string;
  dimensions?: string;
  technique?: string;
  images: SanityImage[];
  isClothing?: boolean;
  sizeVariants?: SizeVariant[];
  shopifyVariantId?: string;
  available: boolean;
  order: number;
}

// Shop category (dynamic, from Sanity)
export interface ShopCategory {
  _id: string;
  title: string;
  slug: string;
  order: number;
}

// Work filter categories
export const CATEGORIES = [
  { slug: 'motion', label: 'Motion' },
  { slug: 'print', label: 'Print' },
  { slug: 'identite', label: 'Identité' },
  { slug: 'bac-a-sable', label: 'Bac à sable' },
] as const;

export type CategorySlug = typeof CATEGORIES[number]['slug'];

// Cart
export interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  price: number;
  size?: string;
  imageUrl: string;
  quantity: number;
}

// About page
export interface AboutContent {
  portrait?: SanityImage;
  title: string;
  subtitle: string;
  location: string;
  bio: string;
  email: string;
  phone: string;
  instagram: string;
}
