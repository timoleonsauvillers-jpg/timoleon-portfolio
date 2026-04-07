import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oz88eact',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2024-01-01',
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Returns the original CDN URL for GIFs (to preserve animation), or the image builder URL otherwise
export function urlForImage(source: { asset?: { _ref?: string } } | null | undefined, width = 600): string {
  if (!source?.asset?._ref) return '';
  const ref = source.asset._ref;
  // Sanity ref format: image-{id}-{WxH}-{format}
  if (ref.endsWith('-gif')) {
    const parts = ref.split('-');
    const format = parts[parts.length - 1];
    const dimensions = parts[parts.length - 2];
    const id = parts.slice(1, parts.length - 2).join('-');
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'oz88eact';
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`;
  }
  return builder.image(source as SanityImageSource).width(width).quality(80).url();
}
