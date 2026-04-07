import { ShopClient } from '@/components/ShopClient';
import { getAllProducts, getShopCategories } from '@/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'Shop — Timoléon Sauvillers',
  description: 'Éditions limitées, gravures et vêtements.',
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getShopCategories(),
  ]);

  return <ShopClient products={products || []} categories={categories || []} />;
}
