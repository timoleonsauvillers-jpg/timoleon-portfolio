'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types';

interface HomeClientProps {
  projects: Project[];
}

// Placeholder images for development
const placeholderImages = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
  'https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?w=800&q=80',
  'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80',
  'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=800&q=80',
  'https://images.unsplash.com/photo-1614851099511-773084f6911d?w=800&q=80',
  'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&q=80',
];

export function HomeClient({ projects }: HomeClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const parallaxRefs = useRef<(HTMLImageElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const rafRef = useRef<number>(0);

  // Format number with leading zero
  const formatNumber = (num: number) => String(num + 1).padStart(2, '0');

  // Parallax effect on scroll
  const updateParallax = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    imageRefs.current.forEach((ref, index) => {
      const img = parallaxRefs.current[index];
      if (!ref || !img) return;

      const rect = ref.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const elementCenter = rect.top - containerRect.top + rect.height / 2;
      const viewportCenter = containerHeight / 2;
      const offset = (elementCenter - viewportCenter) / containerHeight;

      // Parallax: image moves slower than container scroll
      img.style.transform = `translateY(${offset * -40}px) scale(1.15)`;
    });
  }, []);

  // Handle scroll — detect active project + parallax + infinite loop
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    // Parallax on every frame
    updateParallax();

    if (isScrollingRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const scrollCenter = scrollTop + containerHeight / 2;

    // Find which image is closest to center
    let closestIndex = 0;
    let closestDistance = Infinity;

    imageRefs.current.forEach((ref, index) => {
      if (ref) {
        const elementCenter = ref.offsetTop + ref.clientHeight / 2;
        const distance = Math.abs(scrollCenter - elementCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      }
    });

    const normalizedIndex = closestIndex % projects.length;
    if (normalizedIndex !== activeIndex) {
      setActiveIndex(normalizedIndex);
    }

    // Handle infinite loop
    const totalScrollHeight = container.scrollHeight;
    const oneSetHeight = totalScrollHeight / 3;

    if (scrollTop < oneSetHeight * 0.3) {
      isScrollingRef.current = true;
      container.scrollTop = scrollTop + oneSetHeight;
      setTimeout(() => { isScrollingRef.current = false; }, 50);
    } else if (scrollTop > oneSetHeight * 1.7) {
      isScrollingRef.current = true;
      container.scrollTop = scrollTop - oneSetHeight;
      setTimeout(() => { isScrollingRef.current = false; }, 50);
    }
  }, [activeIndex, projects.length, updateParallax]);

  // Scroll to specific project
  const scrollToProject = useCallback((index: number) => {
    const middleStartIndex = projects.length;
    const targetIndex = middleStartIndex + index;
    const targetElement = imageRefs.current[targetIndex];

    if (targetElement && containerRef.current) {
      isScrollingRef.current = true;
      const containerHeight = containerRef.current.clientHeight;
      const elementTop = targetElement.offsetTop;
      const elementHeight = targetElement.clientHeight;
      const scrollTarget = elementTop - (containerHeight / 2) + (elementHeight / 2);

      containerRef.current.scrollTo({
        top: scrollTarget,
        behavior: 'smooth',
      });

      setActiveIndex(index);

      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  }, [projects.length]);

  // Initialize scroll position to middle set
  useEffect(() => {
    if (containerRef.current) {
      const totalScrollHeight = containerRef.current.scrollHeight;
      const oneSetHeight = totalScrollHeight / 3;
      containerRef.current.scrollTop = oneSetHeight;
      // Initial parallax
      requestAnimationFrame(updateParallax);
    }
  }, [updateParallax]);

  // Add scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Extended array for infinite loop (3x)
  const extendedProjects = [...projects, ...projects, ...projects];

  return (
    <div className="fixed inset-0 flex">
      {/* Left side — Project list positioned at 2nd quarter */}
      <div className="absolute left-[25%] top-0 bottom-0 w-1/4 flex flex-col justify-center z-10 pointer-events-none">
        <nav className="space-y-1 pointer-events-auto">
          {projects.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                {isActive ? (
                  <Link
                    href={`/project/${project.slug}`}
                    className="group inline-flex items-baseline gap-1 cursor-pointer"
                  >
                    <span className="text-project-number font-normal text-foreground transition-opacity duration-300 group-hover:opacity-50">
                      {formatNumber(index)}/
                    </span>
                    <span className="text-project-title font-normal text-foreground uppercase tracking-wide transition-opacity duration-300 group-hover:opacity-50">
                      {project.title}
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToProject(index)}
                    className="group inline-flex items-baseline gap-1 cursor-pointer text-left"
                  >
                    <span className="text-project-number font-normal text-muted transition-colors duration-300 group-hover:text-foreground">
                      {formatNumber(index)}/
                    </span>
                    <span className="text-project-title font-normal text-muted uppercase tracking-wide transition-colors duration-300 group-hover:text-foreground">
                      {project.title}
                    </span>
                  </button>
                )}
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Right side — Image scroll with parallax */}
      <div
        ref={containerRef}
        className="w-full overflow-y-auto hide-scrollbar"
      >
        {/* Spacer top */}
        <div className="h-[40vh]" />

        {extendedProjects.map((project, index) => {
          const originalIndex = index % projects.length;
          const isActive = originalIndex === activeIndex;

          return (
            <div
              key={`${project._id}-${index}`}
              ref={(el) => { imageRefs.current[index] = el; }}
              className="flex justify-end pr-[8vw] py-[2vh]"
            >
              <Link
                href={isActive ? `/project/${project.slug}` : '#'}
                onClick={(e) => {
                  if (!isActive) {
                    e.preventDefault();
                    scrollToProject(originalIndex);
                  }
                }}
                className={`
                  relative block overflow-hidden
                  transition-all duration-700 ease-smooth
                  ${isActive
                    ? 'w-[50vw] h-[65vh]'
                    : 'w-[30vw] h-[40vh] opacity-40'
                  }
                `}
              >
                <div
                  className={`
                    relative w-full h-full overflow-hidden
                    transition-all duration-700 ease-smooth
                    ${isActive ? '' : 'grayscale'}
                  `}
                >
                  <img
                    ref={(el) => { parallaxRefs.current[index] = el; }}
                    src={placeholderImages[originalIndex % placeholderImages.length]}
                    alt={project.title}
                    className="w-full h-full object-cover will-change-transform"
                    style={{ transform: 'translateY(0) scale(1.15)' }}
                  />
                </div>
              </Link>
            </div>
          );
        })}

        {/* Spacer bottom */}
        <div className="h-[40vh]" />
      </div>
    </div>
  );
}
