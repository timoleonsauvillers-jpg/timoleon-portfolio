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
  images: SanityImage[];
  videos?: SanityVideo[];
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
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
  };
}

// Shop types
export interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  details?: string;
  edition?: string;
  dimensions?: string;
  technique?: string;
  images: SanityImage[];
  shopifyVariantId?: string;
  available: boolean;
  order: number;
}

// Filter categories
export const CATEGORIES = [
  { slug: 'motion', label: 'Motion' },
  { slug: 'print', label: 'Print' },
  { slug: 'identite', label: 'Identité' },
  { slug: 'bac-a-sable', label: 'Bac à sable' },
] as const;

export type CategorySlug = typeof CATEGORIES[number]['slug'];

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
