import { ShopClient } from '@/components/ShopClient';
import { getAllProducts } from '@/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'Shop — Timoléon Sauvillers',
  description: 'Éditions limitées, gravures et vêtements.',
};

export default async function ShopPage() {
  const products = await getAllProducts();
  
  return <ShopClient products={products || []} />;
}
