import { AboutClient } from '@/components/AboutClient';
import { getAboutContent } from '@/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'About — Timoléon Sauvillers',
  description: 'Motion Designer et Graveur basé à Paris. Direction artistique, animation et gravure.',
};

export default async function AboutPage() {
  const content = await getAboutContent();
  
  // Fallback content if Sanity is empty
  const fallbackContent = {
    title: 'Timoléon Sauvillers',
    subtitle: 'Motion Designer & Graveur',
    location: 'Paris',
    bio: 'Hi, i\'m a digital designer based in Paris. I work across projects from startups to established brands, bringing a blend of visual design and motion.',
    email: 'contact@timoleonsauvillers.com',
    phone: '+33 X XX XX XX XX',
    instagram: 'https://instagram.com/timoleon.sauvillers',
  };
  
  return <AboutClient content={content || fallbackContent} />;
}
