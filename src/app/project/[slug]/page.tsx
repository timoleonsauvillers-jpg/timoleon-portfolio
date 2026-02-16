import { ProjectClient } from '@/components/ProjectClient';
import { Project } from '@/types';
import { notFound } from 'next/navigation';

// Placeholder projects data - will be replaced by Sanity CMS
const placeholderProjects: Project[] = [
  {
    _id: '1',
    title: 'Projet Alpha',
    slug: 'projet-alpha',
    category: 'motion',
    year: '2024',
    context: 'Direction artistique et animation pour une campagne digitale.',
    role: 'Motion Design, Direction Artistique',
    link: 'https://example.com',
    thumbnail: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
    images: [],
    featured: true,
    order: 1,
  },
  {
    _id: '2',
    title: 'Gravure Série Noire',
    slug: 'gravure-serie-noire',
    category: 'print',
    year: '2024',
    context: 'Série de gravures sur cuivre, tirage limité à 20 exemplaires.',
    role: 'Gravure, Impression',
    thumbnail: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
    images: [],
    featured: true,
    order: 2,
  },
  {
    _id: '3',
    title: 'Identité Maison Blanche',
    slug: 'identite-maison-blanche',
    category: 'identite',
    year: '2024',
    context: 'Création de l\'identité visuelle complète pour un restaurant gastronomique.',
    role: 'Direction Artistique, Identité Visuelle',
    link: 'https://example.com',
    thumbnail: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
    images: [],
    featured: false,
    order: 3,
  },
  {
    _id: '4',
    title: 'Motion Reel 2024',
    slug: 'motion-reel-2024',
    category: 'motion',
    year: '2024',
    context: 'Compilation des travaux d\'animation de l\'année.',
    role: 'Motion Design',
    thumbnail: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
    images: [],
    featured: true,
    order: 4,
  },
  {
    _id: '5',
    title: 'Expérimentation 01',
    slug: 'experimentation-01',
    category: 'bac-a-sable',
    year: '2023',
    context: 'Recherches visuelles autour de la matière et du mouvement.',
    role: 'Expérimentation',
    thumbnail: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
    images: [],
    featured: false,
    order: 5,
  },
  {
    _id: '6',
    title: 'Campagne Luxe',
    slug: 'campagne-luxe',
    category: 'motion',
    year: '2023',
    context: 'Animation pour une maison de luxe.',
    role: 'Motion Design, Direction Artistique',
    thumbnail: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
    images: [],
    featured: true,
    order: 6,
  },
  {
    _id: '7',
    title: 'Affiche Festival',
    slug: 'affiche-festival',
    category: 'print',
    year: '2023',
    context: 'Affiche officielle pour un festival de musique électronique.',
    role: 'Direction Artistique, Print',
    thumbnail: { _type: 'image', asset: { _ref: '', _type: 'reference' } },
    images: [],
    featured: false,
    order: 7,
  },
];

// Generate static params for all projects
export async function generateStaticParams() {
  // TODO: Fetch all project slugs from Sanity
  return placeholderProjects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate metadata for each project
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = placeholderProjects.find((p) => p.slug === params.slug);
  
  if (!project) {
    return {
      title: 'Projet non trouvé — Timoléon Sauvillers',
    };
  }

  return {
    title: `${project.title} — Timoléon Sauvillers`,
    description: project.context || `Projet ${project.category} par Timoléon Sauvillers.`,
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  // TODO: Fetch project from Sanity by slug
  const project = placeholderProjects.find((p) => p.slug === params.slug);
  
  if (!project) {
    notFound();
  }

  // Get prev/next projects for navigation
  const currentIndex = placeholderProjects.findIndex((p) => p.slug === params.slug);
  const prevProject = currentIndex > 0 ? placeholderProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < placeholderProjects.length - 1 ? placeholderProjects[currentIndex + 1] : null;

  return (
    <ProjectClient 
      project={project} 
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
