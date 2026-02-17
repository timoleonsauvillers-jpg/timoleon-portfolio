'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, CATEGORIES, CategorySlug } from '@/types';
import { urlFor } from '@/lib/sanity';

interface WorkClientProps {
  projects: Project[];
}

export function WorkClient({ projects }: WorkClientProps) {
  const [activeFilter, setActiveFilter] = useState<CategorySlug | 'all'>('all');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  // Get image URL from Sanity or fallback
  const getImageUrl = (project: Project) => {
    if (project.thumbnail?.asset) {
      return urlFor(project.thumbnail).width(600).quality(80).url();
    }
    return `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80`;
  };

  return (
    <div className="min-h-screen pt-nav-height pb-footer-height">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-nav-height z-40 bg-background/5"
      >
        <div className="w-full px-4 py-4">
          <div className="flex items-center gap-4 md:gap-6 text-nav">
            <button
              onClick={() => setActiveFilter('all')}
              className={`
                transition-colors duration-300
                ${activeFilter === 'all' ? 'text-foreground' : 'text-muted hover:text-foreground'}
              `}
            >
              Tout
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveFilter(cat.slug)}
                className={`
                  transition-colors duration-300
                  ${activeFilter === cat.slug ? 'text-foreground' : 'text-muted hover:text-foreground'}
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Masonry Grid - columns for native aspect ratios */}
      <div className="w-full px-4 py-4">
        <motion.div
          layout
          className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="break-inside-avoid mb-3"
              >
                {/* Image - native aspect ratio */}
                <div className="relative overflow-hidden bg-border/10">
                  <img
                    src={getImageUrl(project)}
                    alt={project.title}
                    className="w-full h-auto"
                    style={{ maxWidth: '100%' }}
                  />
                </div>

                {/* Title below image */}
                <p className="text-project-title font-normal mt-1.5 text-muted">
                  {project.title}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredProjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-muted py-20"
          >
            Aucun projet dans cette catégorie.
          </motion.p>
        )}
      </div>
    </div>
  );
}
