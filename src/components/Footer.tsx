'use client';

import { motion } from 'framer-motion';

interface FooterProps {
  email?: string;
  phone?: string;
  instagram?: string;
}

export function Footer({ email, phone, instagram }: FooterProps) {
  if (!email && !phone && !instagram) return null;

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed bottom-0 left-0 right-0 z-40 h-footer-height bg-background/5"
    >
      <div className="h-full w-full px-4 flex items-center justify-end">
        <div className="flex items-center gap-2 md:gap-3 text-nav text-muted">
          {email && (
            <a
              href={`mailto:${email}`}
              className="hidden md:inline hover:text-foreground transition-colors duration-300"
            >
              {email}
            </a>
          )}

          {email && phone && (
            <span className="hidden md:inline opacity-30">·</span>
          )}

          {phone && (
            <a
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="hover:text-foreground transition-colors duration-300"
            >
              {phone}
            </a>
          )}

          {(email || phone) && instagram && (
            <span className="hidden md:inline opacity-30">·</span>
          )}

          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline hover:text-foreground transition-colors duration-300"
            >
              Instagram
            </a>
          )}
        </div>
      </div>
    </motion.footer>
  );
}
