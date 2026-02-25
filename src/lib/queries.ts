import { client } from './sanity';
import { Project, Product, AboutContent } from '@/types';

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
      images,
      featured,
      order
    }
  `);
}

export async function getAllProjects(): Promise<Project[]> {
  return client.fetch(`
    *[_type == "project"] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      category,
      year,
      context,
      role,
      link,
      thumbnail,
      images,
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
      images,
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

// Products
export async function getAllProducts(): Promise<Product[]> {
  return client.fetch(`
    *[_type == "product"] | order(order asc) {
      _id,
      title,
      "slug": slug.current,
      price,
      description,
      details,
      edition,
      dimensions,
      technique,
      images,
      available,
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
      price,
      description,
      details,
      edition,
      dimensions,
      technique,
      images,
      available,
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
