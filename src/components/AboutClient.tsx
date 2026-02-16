'use client';

import { motion } from 'framer-motion';
import { AboutContent } from '@/types';

interface AboutClientProps {
  content: AboutContent;
}

// Placeholder portrait
const placeholderPortrait = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80';

export function AboutClient({ content }: AboutClientProps) {
  return (
    <div className="fixed inset-0 pt-nav-height pb-footer-height">
      {/* Full-bleed portrait image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0"
      >
        <img
          src={placeholderPortrait}
          alt={content.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content column — 2nd quarter left */}
      <div className="relative h-full flex">
        <div className="w-1/4" />
        <div className="w-1/4 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title */}
            <div>
              <h1 className="text-body font-medium text-foreground">
                {content.title}
              </h1>
              <p className="text-nav text-muted">
                {content.subtitle}
              </p>
              <p className="text-nav text-muted">
                {content.location}
              </p>
            </div>

            {/* Bio */}
            <p className="text-body leading-relaxed text-foreground">
              {content.bio.split('\n\n')[0]}
            </p>

            {content.bio.split('\n\n')[1] && (
              <p className="text-body leading-relaxed text-foreground">
                {content.bio.split('\n\n')[1]}
              </p>
            )}

            {content.bio.split('\n\n')[2] && (
              <p className="text-body leading-relaxed text-foreground">
                {content.bio.split('\n\n')[2]}
              </p>
            )}

            {/* Contact */}
            <div className="space-y-1 pt-2">
              <a
                href={`mailto:${content.email}`}
                className="block text-body text-foreground hover:opacity-50 transition-opacity duration-300"
              >
                {content.email}
              </a>

              <a
                href={`tel:${content.phone.replace(/\s/g, '')}`}
                className="block text-body text-foreground hover:opacity-50 transition-opacity duration-300"
              >
                {content.phone}
              </a>

              <a
                href={content.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-body text-foreground hover:opacity-50 transition-opacity duration-300"
              >
                @timoleon.sauvillers
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
