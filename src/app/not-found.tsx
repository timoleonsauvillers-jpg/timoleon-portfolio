'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen pt-nav-height flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center px-6"
      >
        <h1 className="text-heading font-medium mb-4">
          404
        </h1>
        <p className="text-body text-muted mb-8">
          Cette page n'existe pas.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-body hover:opacity-60 transition-opacity duration-300"
        >
          ← Retour à l'accueil
        </Link>
      </motion.div>
    </div>
  );
}
