'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types';
import { urlFor } from '@/lib/sanity';

interface HomeClientProps {
  projects: Project[];
}

export function HomeClient({ projects }: HomeClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isJumpingRef = useRef(false);

  // Extended array for infinite loop (3x)
  const extendedProjects = [...projects, ...projects, ...projects];
  const middleStart = projects.length;

  // Format number with leading zero
  const formatNumber = (num: number) => String(num + 1).padStart(2, '0');

  // Get image URL from Sanity or fallback
  const getImageUrl = (project: Project) => {
    if (project.thumbnail?.asset) {
      return urlFor(project.thumbnail).width(1200).quality(85).url();
    }
    return `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80`;
  };

  // Handle scroll — detect active project + infinite loop
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isJumpingRef.current) return;

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

    // Parallax effect
    imageRefs.current.forEach((ref) => {
      if (!ref) return;
      const img = ref.querySelector('img');
      if (!img) return;

      const rect = ref.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = containerHeight / 2;
      const offset = (elementCenter - viewportCenter) / containerHeight;

      img.style.transform = `translateY(${offset * -50}px) scale(1.15)`;
    });

    // Handle infinite loop - jump when near edges
    const totalHeight = container.scrollHeight;
    const oneSetHeight = totalHeight / 3;

    if (scrollTop < oneSetHeight * 0.5) {
      isJumpingRef.current = true;
      container.scrollTop = scrollTop + oneSetHeight;
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
    } else if (scrollTop > oneSetHeight * 1.5) {
      isJumpingRef.current = true;
      container.scrollTop = scrollTop - oneSetHeight;
      requestAnimationFrame(() => {
        isJumpingRef.current = false;
      });
    }
  }, [activeIndex, projects.length]);

  // Scroll to specific project
  const scrollToProject = useCallback((index: number) => {
    const targetIndex = middleStart + index;
    const targetElement = imageRefs.current[targetIndex];

    if (targetElement && containerRef.current) {
      const containerHeight = containerRef.current.clientHeight;
      const elementTop = targetElement.offsetTop;
      const elementHeight = targetElement.clientHeight;
      const scrollTarget = elementTop - (containerHeight / 2) + (elementHeight / 2);

      containerRef.current.scrollTo({
        top: scrollTarget,
        behavior: 'smooth',
      });

      setActiveIndex(index);
    }
  }, [middleStart]);

  // Initialize scroll position to middle set
  useEffect(() => {
    if (containerRef.current) {
      const totalHeight = containerRef.current.scrollHeight;
      const oneSetHeight = totalHeight / 3;
      containerRef.current.scrollTop = oneSetHeight;
    }
  }, []);

  // Add scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed inset-0 flex">
      {/* Fixed left side — Project list at 2nd quarter */}
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
                    <span className="text-project-number font-normal text-foreground transition-opacity duration-200 ease-in-out group-hover:opacity-50">
                      {formatNumber(index)}/
                    </span>
                    <span className="text-project-title font-normal text-foreground uppercase tracking-wide transition-opacity duration-200 ease-in-out group-hover:opacity-50">
                      {project.title}
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={() => scrollToProject(index)}
                    className="group inline-flex items-baseline gap-1 cursor-pointer text-left"
                  >
                    <span className="text-project-number font-normal text-muted transition-colors duration-200 ease-in-out group-hover:text-foreground">
                      {formatNumber(index)}/
                    </span>
                    <span className="text-project-title font-normal text-muted uppercase tracking-wide transition-colors duration-200 ease-in-out group-hover:text-foreground">
                      {project.title}
                    </span>
                  </button>
                )}
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Right side — Scrollable images with snap */}
      <div
        ref={containerRef}
        className="w-full overflow-y-auto hide-scrollbar"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {extendedProjects.map((project, index) => {
          const originalIndex = index % projects.length;
          const isActive = originalIndex === activeIndex;

          return (
            <div
              key={`${project._id}-${index}`}
              ref={(el) => { imageRefs.current[index] = el; }}
              className="h-screen flex items-center justify-center"
              style={{ scrollSnapAlign: 'center', scrollSnapStop: 'always' }}
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
                  transition-all duration-200 ease-in-out
                  ${isActive
                    ? 'w-[50vw] h-[70vh]'
                    : 'w-[35vw] h-[45vh] opacity-40'
                  }
                `}
              >
                <div
                  className={`
                    relative w-full h-full overflow-hidden
                    transition-all duration-200 ease-in-out
                    ${isActive ? '' : 'grayscale'}
                  `}
                >
                  <img
                    src={getImageUrl(projects[originalIndex])}
                    alt={project.title}
                    className="w-full h-full object-cover will-change-transform"
                    style={{ maxWidth: '100%', transform: 'translateY(0) scale(1.15)' }}
                  />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
