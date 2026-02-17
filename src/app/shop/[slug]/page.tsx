import { ProductClient } from '@/components/ProductClient';
import { getProductBySlug, getProductSlugs } from '@/lib/queries';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    return { title: 'Produit non trouvé — Timoléon Sauvillers' };
  }

  return {
    title: `${product.title} — Shop — Timoléon Sauvillers`,
    description: product.description || `${product.title} - Édition limitée.`,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  
  if (!product) {
    notFound();
  }

  return <ProductClient product={product} />;
}
