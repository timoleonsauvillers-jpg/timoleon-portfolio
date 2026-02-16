import { HomeClient } from '@/components/HomeClient';

// Placeholder data - will be replaced by Sanity CMS data
const placeholderProjects = [
  {
    _id: '1',
    title: 'Projet Un',
    slug: 'projet-un',
    category: 'motion' as const,
    year: '2024',
    thumbnail: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const } },
    images: [],
    featured: true,
    order: 1,
  },
  {
    _id: '2',
    title: 'Projet Deux',
    slug: 'projet-deux',
    category: 'print' as const,
    year: '2024',
    thumbnail: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const } },
    images: [],
    featured: true,
    order: 2,
  },
  {
    _id: '3',
    title: 'Projet Trois',
    slug: 'projet-trois',
    category: 'identite' as const,
    year: '2023',
    thumbnail: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const } },
    images: [],
    featured: true,
    order: 3,
  },
  {
    _id: '4',
    title: 'Projet Quatre',
    slug: 'projet-quatre',
    category: 'motion' as const,
    year: '2023',
    thumbnail: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const } },
    images: [],
    featured: true,
    order: 4,
  },
  {
    _id: '5',
    title: 'Projet Cinq',
    slug: 'projet-cinq',
    category: 'bac-a-sable' as const,
    year: '2023',
    thumbnail: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const } },
    images: [],
    featured: true,
    order: 5,
  },
  {
    _id: '6',
    title: 'Projet Six',
    slug: 'projet-six',
    category: 'print' as const,
    year: '2022',
    thumbnail: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const } },
    images: [],
    featured: true,
    order: 6,
  },
  {
    _id: '7',
    title: 'Projet Sept',
    slug: 'projet-sept',
    category: 'identite' as const,
    year: '2022',
    thumbnail: { _type: 'image' as const, asset: { _ref: '', _type: 'reference' as const } },
    images: [],
    featured: true,
    order: 7,
  },
];

export default function HomePage() {
  // TODO: Fetch featured projects from Sanity
  // const projects = await getFeaturedProjects();
  
  return <HomeClient projects={placeholderProjects} />;
}
