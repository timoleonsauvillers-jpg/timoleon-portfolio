import { AboutClient } from '@/components/AboutClient';
import { AboutContent } from '@/types';

// Placeholder data - will be replaced by Sanity CMS data
const placeholderAbout: AboutContent = {
  title: 'Timoléon Sauvillers',
  subtitle: 'Motion Designer & Graveur',
  location: 'Paris',
  bio: `Motion Designer et Graveur, je développe des univers visuels à la croisée du mouvement et de l'artisanat. Mon travail explore la tension entre le numérique et l'analogique, le fluide et le ciselé.

Je collabore avec des agences et des marques qui cherchent une direction artistique singulière, où chaque projet est une occasion de repousser les limites de l'image en mouvement.

Parallèlement, je poursuis une pratique personnelle de la gravure, exposée régulièrement et disponible en éditions limitées.`,
  email: 'contact@timoleonsauvillers.com',
  phone: '+33 6 XX XX XX XX',
  instagram: 'https://instagram.com/timoleon.sauvillers',
};

export const metadata = {
  title: 'About — Timoléon Sauvillers',
  description: 'Motion Designer et Graveur basé à Paris. Direction artistique, animation et gravure.',
};

export default function AboutPage() {
  // TODO: Fetch about content from Sanity
  // const about = await getAboutContent();
  
  return <AboutClient content={placeholderAbout} />;
}
