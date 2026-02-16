'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, CATEGORIES, CategorySlug } from '@/types';

interface WorkClientProps {
  projects: Project[];
}

// Placeholder images with varying aspect ratios for masonry effect
const placeholderImages = [
  { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80', aspect: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=600&q=80', aspect: 'landscape' },
  { url: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&q=80', aspect: 'square' },
  { url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&q=80', aspect: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=600&q=80', aspect: 'landscape' },
  { url: 'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=600&q=80', aspect: 'square' },
  { url: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&q=80', aspect: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600&q=80', aspect: 'landscape' },
  { url: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=600&q=80', aspect: 'square' },
  { url: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80', aspect: 'portrait' },
  { url: 'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&q=80', aspect: 'landscape' },
  { url: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&q=80', aspect: 'square' },
];

const getAspectClass = (aspect: string) => {
  switch (aspect) {
    case 'portrait':
      return 'aspect-[3/4]';
    case 'landscape':
      return 'aspect-[4/3]';
    case 'square':
    default:
      return 'aspect-square';
  }
};

export function WorkClient({ projects }: WorkClientProps) {
  const [activeFilter, setActiveFilter] = useState<CategorySlug | 'all'>('all');

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projects;
    return projects.filter((p) => p.category === activeFilter);
  }, [projects, activeFilter]);

  return (
    <div className="min-h-screen pt-nav-height pb-footer-height">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-nav-height z-40 backdrop-blur-sm"
        style={{ backgroundColor: 'rgb(250 250 250 / 0.01)' }}
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

      {/* Masonry Grid — presentation only, no links */}
      <div className="w-full px-4 py-4">
        <motion.div
          layout
          className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => {
              const placeholder = placeholderImages[index % placeholderImages.length];

              return (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="break-inside-avoid mb-3"
                >
                  {/* Image only — no link */}
                  <div className={`
                    relative overflow-hidden bg-border/10
                    ${getAspectClass(placeholder.aspect)}
                  `}>
                    <img
                      src={placeholder.url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              );
            })}
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
