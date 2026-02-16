'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types';

interface ProjectClientProps {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
}

// Placeholder images for project gallery
const placeholderGallery = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&q=80',
  'https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=1000&q=80',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1000&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1400&q=80',
  'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=1000&q=80',
  'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=1000&q=80',
];

export function ProjectClient({ project, prevProject, nextProject }: ProjectClientProps) {
  return (
    <div className="min-h-screen pt-nav-height pb-footer-height">
      <div className="w-full px-6 md:px-8">
        
        {/* Header Section - No scroll, visible immediately */}
        <motion.header
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="py-8 md:py-12"
        >
          {/* Context - Main description */}
          {project.context && (
            <p className="text-body leading-relaxed max-w-xl mb-8">
              {project.context}
            </p>
          )}

          {/* Meta info - Columns like etienne.studio */}
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

        {/* Gallery - This is where scrolling happens */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          {/* Full width image */}
          <div className="w-full">
            <img
              src={placeholderGallery[0]}
              alt={`${project.title}`}
              className="w-full h-auto"
            />
          </div>

          {/* Two column */}
          <div className="grid grid-cols-2 gap-3">
            <img
              src={placeholderGallery[1]}
              alt={`${project.title}`}
              className="w-full h-auto"
            />
            <img
              src={placeholderGallery[2]}
              alt={`${project.title}`}
              className="w-full h-auto"
            />
          </div>

          {/* Full width */}
          <div className="w-full">
            <img
              src={placeholderGallery[3]}
              alt={`${project.title}`}
              className="w-full h-auto"
            />
          </div>

          {/* Two column */}
          <div className="grid grid-cols-2 gap-3">
            <img
              src={placeholderGallery[4]}
              alt={`${project.title}`}
              className="w-full h-auto"
            />
            <img
              src={placeholderGallery[5]}
              alt={`${project.title}`}
              className="w-full h-auto"
            />
          </div>
        </motion.section>

        {/* Navigation to next project */}
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
