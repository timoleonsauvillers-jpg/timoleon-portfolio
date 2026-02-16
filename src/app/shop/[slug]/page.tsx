import { ProductClient } from '@/components/ProductClient';
import { Product } from '@/types';
import { notFound } from 'next/navigation';

// Placeholder products data - will be replaced by Sanity/Shopify
const placeholderProducts: Product[] = [
  {
    _id: '1',
    title: 'Gravure I',
    slug: 'gravure-i',
    price: 120,
    description: 'Gravure sur cuivre, tirage sur papier Hahnemühle. Chaque impression est numérotée et signée à la main.',
    details: 'Expédition sous 5-7 jours ouvrés. Livraison en France métropolitaine et Europe.',
    edition: '3/20',
    dimensions: '30 × 40 cm',
    technique: 'Eau-forte',
    images: [],
    available: true,
    order: 1,
  },
  {
    _id: '2',
    title: 'Gravure II',
    slug: 'gravure-ii',
    price: 150,
    description: 'Gravure sur cuivre, tirage sur papier Arches. Série limitée à 20 exemplaires.',
    details: 'Expédition sous 5-7 jours ouvrés. Livraison en France métropolitaine et Europe.',
    edition: '5/20',
    dimensions: '40 × 50 cm',
    technique: 'Aquatinte',
    images: [],
    available: true,
    order: 2,
  },
  {
    _id: '3',
    title: 'T-shirt Série Noire',
    slug: 't-shirt-serie-noire',
    price: 45,
    description: 'Sérigraphie artisanale sur coton bio 180g. Coupe regular.',
    details: 'Tailles disponibles : S, M, L, XL. Expédition sous 3-5 jours ouvrés.',
    images: [],
    available: true,
    order: 3,
  },
  {
    _id: '4',
    title: 'Gravure III',
    slug: 'gravure-iii',
    price: 90,
    description: 'Gravure sur zinc, tirage limité à 15 exemplaires.',
    details: 'Expédition sous 5-7 jours ouvrés.',
    edition: '8/15',
    dimensions: '20 × 30 cm',
    technique: 'Pointe sèche',
    images: [],
    available: true,
    order: 4,
  },
  {
    _id: '5',
    title: 'Sweat Gravure',
    slug: 'sweat-gravure',
    price: 85,
    description: 'Sérigraphie sur coton bio 350g, coupe oversize.',
    details: 'Tailles disponibles : S, M, L, XL. Expédition sous 3-5 jours ouvrés.',
    images: [],
    available: true,
    order: 5,
  },
  {
    _id: '6',
    title: 'Gravure IV',
    slug: 'gravure-iv',
    price: 75,
    description: 'Linogravure, tirage sur papier japonais.',
    details: 'Expédition sous 5-7 jours ouvrés.',
    edition: '12/30',
    dimensions: '15 × 20 cm',
    technique: 'Linogravure',
    images: [],
    available: false,
    order: 6,
  },
  {
    _id: '7',
    title: 'Mini Print',
    slug: 'mini-print',
    price: 25,
    description: 'Petit format, idéal pour débuter une collection.',
    details: 'Expédition sous 5-7 jours ouvrés.',
    edition: '20/50',
    dimensions: '10 × 15 cm',
    technique: 'Risographie',
    images: [],
    available: true,
    order: 7,
  },
  {
    _id: '8',
    title: 'T-shirt Blanc',
    slug: 't-shirt-blanc',
    price: 40,
    description: 'Sérigraphie noire sur coton blanc 180g.',
    details: 'Tailles disponibles : S, M, L, XL. Expédition sous 3-5 jours ouvrés.',
    images: [],
    available: true,
    order: 8,
  },
];

// Generate static params
export async function generateStaticParams() {
  return placeholderProducts.map((product) => ({
    slug: product.slug,
  }));
}

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = placeholderProducts.find((p) => p.slug === params.slug);
  
  if (!product) {
    return {
      title: 'Produit non trouvé — Timoléon Sauvillers',
    };
  }

  return {
    title: `${product.title} — Shop — Timoléon Sauvillers`,
    description: product.description,
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = placeholderProducts.find((p) => p.slug === params.slug);
  
  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
