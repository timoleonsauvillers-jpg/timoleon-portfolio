'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types';
import { urlFor } from '@/lib/sanity';

interface ProjectClientProps {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
}

export function ProjectClient({ project, prevProject, nextProject }: ProjectClientProps) {
  // Get all images (thumbnail + gallery)
  const getAllImages = () => {
    const images = [];
    
    if (project.thumbnail?.asset) {
      images.push(urlFor(project.thumbnail).width(1400).quality(85).url());
    }
    
    if (project.images && project.images.length > 0) {
      project.images.forEach((img) => {
        if (img?.asset) {
          images.push(urlFor(img).width(1400).quality(85).url());
        }
      });
    }
    
    // Fallback if no images
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&q=80');
    }
    
    return images;
  };

  const images = getAllImages();

  return (
    <div className="min-h-screen pt-nav-height pb-footer-height">
      <div className="w-full px-6 md:px-8">
        
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="py-8 md:py-12"
        >
          {/* Context */}
          {project.context && (
            <p className="text-body leading-relaxed max-w-xl mb-8">
              {project.context}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap gap-x-12 gap-y-4 text-nav">
            {project.role && (
              <div>
                <span className="text-muted block mb-1">Rôle</span>
                <span className="text-foreground">{project.role}</span>
              </div>
            )}

            <div>
              <span className="text-muted block mb-1">Année</span>
              <span className="text-foreground">{project.year}</span>
            </div>

            {project.link && (
              <div>
                <span className="text-muted block mb-1">Lien</span>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:opacity-50 transition-opacity duration-300"
                >
                  Voir le projet ↗
                </a>
              </div>
            )}
          </div>
        </motion.header>

        {/* Gallery */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {images.map((imageUrl, index) => (
            <div key={index} className="w-full">
              <img
                src={imageUrl}
                alt={`${project.title} - ${index + 1}`}
                className="w-full h-auto"
                style={{ maxWidth: '100%' }}
              />
            </div>
          ))}
        </motion.section>

        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="py-12 flex justify-end"
        >
          {nextProject ? (
            <Link
              href={`/project/${nextProject.slug}`}
              className="text-nav text-muted hover:text-foreground transition-colors duration-300"
            >
              Projet suivant →
            </Link>
          ) : prevProject ? (
            <Link
              href={`/project/${prevProject.slug}`}
              className="text-nav text-muted hover:text-foreground transition-colors duration-300"
            >
              ← Projet précédent
            </Link>
          ) : null}
        </motion.nav>
      </div>
    </div>
  );
}
