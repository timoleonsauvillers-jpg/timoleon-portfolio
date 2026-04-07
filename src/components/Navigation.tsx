'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
];

export function Navigation() {
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

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

        {/* Nav Links - Left on mobile, Center on desktop */}
        <ul className="flex items-center gap-6 md:absolute md:left-1/2 md:-translate-x-1/2 md:gap-10">
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

        {/* Cart button - desktop text, mobile icon */}
        <button
          onClick={openCart}
          className="text-nav opacity-50 hover:opacity-100 transition-opacity duration-300 md:w-[140px] md:text-right"
          aria-label="Panier"
        >
          {/* Desktop: text */}
          <span className="hidden md:inline">
            Panier{itemCount > 0 && ` (${itemCount})`}
          </span>
          {/* Mobile: bag icon */}
          <span className="md:hidden relative inline-flex items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-foreground text-background text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center leading-none">
                {itemCount}
              </span>
            )}
          </span>
        </button>
      </nav>
    </motion.header>
  );
}
