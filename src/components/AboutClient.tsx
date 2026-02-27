'use client';

import { motion } from 'framer-motion';
import { AboutContent } from '@/types';
import { urlFor } from '@/lib/sanity';

interface AboutClientProps {
  content: AboutContent;
}

export function AboutClient({ content }: AboutClientProps) {
  // Get portrait URL from Sanity or fallback
  const getPortraitUrl = () => {
    if (content.portrait?.asset) {
      return urlFor(content.portrait).width(600).quality(85).url();
    }
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80';
  };

  return (
    <div className="fixed inset-0 pt-nav-height pb-footer-height flex">
      {/* Spacer - 1st quarter (hidden on mobile) */}
      <div className="hidden md:block w-1/4" />

      {/* Content - full width on mobile, 2nd quarter on desktop */}
      <div className="w-full md:w-1/4 flex flex-col justify-center px-4 md:px-0 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Bio */}
          <p className="text-body leading-relaxed text-foreground">
            {content.bio}
          </p>

          {/* Contact */}
          <div className="space-y-1">
            <a
              href={`mailto:${content.email}`}
              className="block text-body text-foreground hover:opacity-50 transition-opacity duration-300"
            >
              {content.email}
            </a>

            {content.phone && (
              <a
                href={`tel:${content.phone.replace(/\s/g, '')}`}
                className="block text-body text-foreground hover:opacity-50 transition-opacity duration-300"
              >
                {content.phone}
              </a>
            )}

            {content.instagram && (
              <a
                href={content.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-body text-foreground hover:opacity-50 transition-opacity duration-300"
              >
                @timoleon.sauvillers
              </a>
            )}
          </div>

          {/* Portrait image - aligned left on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="pt-4"
          >
            <img
              src={getPortraitUrl()}
              alt="Portrait"
              className="w-full md:w-full max-w-[250px] md:max-w-none aspect-[3/4] object-cover"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Remaining space (hidden on mobile) */}
      <div className="hidden md:block w-1/2" />
    </div>
  );
}
