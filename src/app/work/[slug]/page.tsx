import { ProjectClient } from '@/components/ProjectClient';
import { getProjectBySlug, getProjectSlugs, getFeaturedProjects } from '@/lib/queries';
import { notFound } from 'next/navigation';

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    return { title: 'Projet non trouvé — Timoléon Sauvillers' };
  }

  return {
    title: `${project.title} — Timoléon Sauvillers`,
    description: project.context || `Projet ${project.category} par Timoléon Sauvillers.`,
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }

  // Get all featured projects to determine prev/next
  const allProjects = await getFeaturedProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === params.slug);
  
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  return (
    <ProjectClient 
      project={project} 
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
