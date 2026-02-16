import { ShopClient } from '@/components/ShopClient';
import { Product } from '@/types';

// Placeholder data - will be replaced by Sanity/Shopify data
const placeholderProducts: Product[] = [
  {
    _id: '1',
    title: 'Gravure I',
    slug: 'gravure-i',
    price: 120,
    description: 'Gravure sur cuivre, tirage sur papier Hahnemühle.',
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
    description: 'Gravure sur cuivre, tirage sur papier Arches.',
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
    description: 'Sérigraphie sur coton bio.',
    images: [],
    available: true,
    order: 3,
  },
  {
    _id: '4',
    title: 'Gravure III',
    slug: 'gravure-iii',
    price: 90,
    description: 'Gravure sur zinc, tirage limité.',
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
    description: 'Sérigraphie sur coton bio, coupe oversize.',
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
    description: 'Sérigraphie noire sur coton blanc.',
    images: [],
    available: true,
    order: 8,
  },
];

export const metadata = {
  title: 'Shop — Timoléon Sauvillers',
  description: 'Éditions limitées, gravures et vêtements.',
};

export default function ShopPage() {
  // TODO: Fetch products from Sanity/Shopify
  // const products = await getProducts();
  
  return <ShopClient products={placeholderProducts} />;
}
