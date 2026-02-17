import { HomeClient } from '@/components/HomeClient';
import { getFeaturedProjects } from '@/lib/queries';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const projects = await getFeaturedProjects();
  
  // Fallback if no projects
  if (!projects || projects.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p className="text-muted">Aucun projet à afficher</p>
      </div>
    );
  }
  
  return <HomeClient projects={projects} />;
}
