'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types';
import { urlFor, urlForImage } from '@/lib/sanity';

interface ProjectClientProps {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
}

export function ProjectClient({ project, prevProject, nextProject }: ProjectClientProps) {
  const [activeImage, setActiveImage] = useState(0);

  // Build media list from thumbnail + gallery
  const getMediaItems = () => {
    const items: { type: 'image' | 'video'; url: string; thumbUrl: string }[] = [];

    if (project.gallery && project.gallery.length > 0) {
      project.gallery.forEach((item) => {
        if (item._type === 'image' && 'asset' in item && item.asset) {
          const url = urlForImage(item, 1400);
          const thumbUrl = urlFor(item).width(96).quality(80).url();
          if (url) items.push({ type: 'image', url, thumbUrl });
        } else if (item._type === 'file' && 'asset' in item && (item.asset as { url?: string }).url) {
          const videoUrl = (item.asset as { url: string }).url;
          items.push({ type: 'video', url: videoUrl, thumbUrl: videoUrl });
        }
      });
    }

    if (items.length === 0) {
      const fallback = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1400&q=80';
      items.push({ type: 'image', url: fallback, thumbUrl: fallback });
    }

    return items;
  };

  const mediaItems = getMediaItems();
  const images = mediaItems.map((m) => m.url);

  const scrollToImage = (index: number) => {
    setActiveImage(index);
    const el = document.getElementById(`project-image-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Update active thumbnail on scroll
  useEffect(() => {
    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;

      images.forEach((_, index) => {
        const el = document.getElementById(`project-image-${index}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - elementCenter);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      setActiveImage(closestIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [images]);

  return (
    <div className="min-h-screen pt-nav-height pb-footer-height">
      {/* Thumbnails - fixed left, aligned with navbar (hidden on mobile) */}
      {images.length > 1 && (
        <div className="hidden md:flex fixed left-4 top-1/2 -translate-y-1/2 z-10 flex-col gap-2">
          {mediaItems.map((media, index) => (
            <button
              key={index}
              onClick={() => scrollToImage(index)}
              className={`
                relative w-12 h-12 overflow-hidden bg-border/10
                transition-opacity duration-300
                ${activeImage === index ? 'opacity-100' : 'opacity-40 hover:opacity-70'}
              `}
            >
              {media.type === 'video' ? (
                <video
                  src={media.thumbUrl}
                  className="w-full h-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={media.thumbUrl}
                  alt={`${project.title} - vue ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}

      <div className="w-full px-4">
        <div className="md:px-[10rem]">

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
          <div className="flex flex-wrap items-start gap-x-12 gap-y-4 text-nav">
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
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-foreground"
              >
                Lien ↗
              </a>
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
          {mediaItems.map((media, index) => (
            <div key={index} id={`project-image-${index}`} className="w-full">
              {media.type === 'video' ? (
                <video
                  src={media.url}
                  className="w-full h-auto"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={media.url}
                  alt={`${project.title} - ${index + 1}`}
                  className="w-full h-auto"
                />
              )}
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
              href={`/work/${nextProject.slug}`}
              className="text-nav text-muted hover:text-foreground transition-colors duration-300"
            >
              Projet suivant →
            </Link>
          ) : prevProject ? (
            <Link
              href={`/work/${prevProject.slug}`}
              className="text-nav text-muted hover:text-foreground transition-colors duration-300"
            >
              ← Projet précédent
            </Link>
          ) : null}
        </motion.nav>
        </div>
      </div>
    </div>
  );
}
