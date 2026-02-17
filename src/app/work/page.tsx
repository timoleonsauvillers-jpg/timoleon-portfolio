import { WorkClient } from '@/components/WorkClient';
import { getAllProjects } from '@/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'Work — Timoléon Sauvillers',
  description: 'Projets de motion design, gravure, identité visuelle et expérimentations.',
};

export default async function WorkPage() {
  const projects = await getAllProjects();
  
  return <WorkClient projects={projects || []} />;
}
