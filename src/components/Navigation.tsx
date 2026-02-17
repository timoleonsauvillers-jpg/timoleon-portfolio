'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 h-nav-height bg-background/5"
    >
      <nav className="h-full w-full px-4 flex items-center justify-between">
        {/* Logo / Name - Left */}
        <Link 
          href="/" 
          className="text-nav font-medium tracking-wide hover:opacity-50 transition-opacity duration-300"
        >
          Timoléon Sauvillers
        </Link>

        {/* Nav Links - Center */}
        <ul className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6 md:gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== '/' && pathname.startsWith(link.href));
            
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    text-nav font-normal tracking-wide
                    transition-opacity duration-300
                    ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100'}
                  `}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Empty right side for balance */}
        <div className="w-[140px]" />
      </nav>
    </motion.header>
  );
}
