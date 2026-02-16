'use client';

import { motion } from 'framer-motion';

// TODO: Replace with actual contact info
const contactInfo = {
  email: 'contact@timoleonsauvillers.com',
  phone: '+33 X XX XX XX XX',
  instagram: 'https://instagram.com/timoleon.sauvillers',
  instagramHandle: '@timoleon.sauvillers',
};

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-40 h-footer-height backdrop-blur-sm"
      style={{ backgroundColor: 'rgb(250 250 250 / 0.01)' }}
    >
      <div className="h-full w-full px-6 md:px-8 flex items-center justify-end">
        <div className="flex items-center gap-2 md:gap-3 text-nav text-muted">
          <a
            href={`mailto:${contactInfo.email}`}
            className="hover:text-foreground transition-colors duration-300"
          >
            {contactInfo.email}
          </a>

          <span className="hidden md:inline opacity-30">·</span>

          <a
            href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
            className="hidden md:inline hover:text-foreground transition-colors duration-300"
          >
            {contactInfo.phone}
          </a>

          <span className="opacity-30">·</span>

          <a
            href={contactInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors duration-300"
          >
            Instagram
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
