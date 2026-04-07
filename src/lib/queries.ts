import { client } from './sanity';
import { Project, Product, AboutContent, ShopCategory } from '@/types';

// Projects
export async function getFeaturedProjects(): Promise<Project[]> {
  return client.fetch(`
    *[_type == "project" && featured == true] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      category,
      year,
      context,
      role,
      link,
      thumbnail,
      "gallery": gallery[]{
        _type,
        _key,
        _type == 'image' => {
          asset,
          hotspot,
          crop,
          alt
        },
        _type == 'file' => {
          "asset": asset->{url}
        }
      },
      featured,
      order
    }
  `);
}

export async function getAllProjects(): Promise<Project[]> {
  return client.fetch(`
    *[_type == "project" && featured != true] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      category,
      year,
      context,
      role,
      link,
      thumbnail,
      "gallery": gallery[]{
        _type,
        _key,
        _type == 'image' => {
          asset,
          hotspot,
          crop,
          alt
        },
        _type == 'file' => {
          "asset": asset->{url}
        }
      },
      featured,
      order
    }
  `);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return client.fetch(`
    *[_type == "project" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      category,
      year,
      context,
      role,
      link,
      thumbnail,
      "gallery": gallery[]{
        _type,
        _key,
        _type == 'image' => {
          asset,
          hotspot,
          crop,
          alt
        },
        _type == 'file' => {
          "asset": asset->{url}
        }
      },
      featured,
      order
    }
  `, { slug });
}

export async function getProjectSlugs(): Promise<string[]> {
  return client.fetch(`
    *[_type == "project" && featured == true].slug.current
  `);
}

// Shop categories
export async function getShopCategories(): Promise<ShopCategory[]> {
  return client.fetch(`
    *[_type == "shopCategory"] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      order
    }
  `);
}

// Products
export async function getAllProducts(): Promise<Product[]> {
  return client.fetch(`
    *[_type == "product"] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      "category": category->{ _id, title, "slug": slug.current },
      price,
      description,
      details,
      edition,
      dimensions,
      technique,
      images,
      available,
      isClothing,
      sizeVariants,
      shopifyVariantId,
      order
    }
  `);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return client.fetch(`
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      "category": category->{ _id, title, "slug": slug.current },
      price,
      description,
      details,
      edition,
      dimensions,
      technique,
      images,
      available,
      isClothing,
      sizeVariants,
      shopifyVariantId,
      order
    }
  `, { slug });
}

export async function getProductSlugs(): Promise<string[]> {
  return client.fetch(`
    *[_type == "product"].slug.current
  `);
}

// About
export async function getAboutContent(): Promise<AboutContent | null> {
  return client.fetch(`
    *[_type == "about"][0] {
      "title": "Timoléon Sauvillers",
      "subtitle": "Motion Designer & Graveur",
      "location": "Paris",
      bio,
      email,
      phone,
      instagram,
      portrait
    }
  `);
}
