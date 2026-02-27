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
  const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number; height: number }>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isJumpingRef = useRef(false);

  // 3x for infinite loop
  const extendedProjects = [...projects, ...projects, ...projects];
  const middleStart = projects.length;

  const formatNumber = (num: number) => String(num + 1).padStart(2, '0');

  const getImageUrl = (project: Project) => {
    if (project.thumbnail?.asset) {
      return urlFor(project.thumbnail).width(1200).quality(85).url();
    }
    return `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80`;
  };

  // Detect image dimensions
  useEffect(() => {
    projects.forEach((project, index) => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions((prev) => ({
          ...prev,
          [index]: { width: img.naturalWidth, height: img.naturalHeight },
        }));
      };
      img.src = getImageUrl(project);
    });
  }, [projects]);

  // Detect mobile viewport
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Compute container size preserving original ratio
  const getContainerStyle = (index: number) => {
    const dims = imageDimensions[index];
    if (!dims) return { width: '400px', height: '400px' };

    const isLandscape = dims.width >= dims.height;
    const ratio = dims.width / dims.height;

    if (isLandscape) {
      return { height: '300px', width: `${300 * ratio}px` };
    } else {
      return { width: '300px', height: `${300 / ratio}px` };
    }
  };

  // Detect which image is closest to center + infinite loop
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isJumpingRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const scrollCenter = scrollTop + containerHeight / 2;

    // Find closest image to center
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

    // Parallax effect on images
    imageRefs.current.forEach((ref) => {
      if (!ref) return;
      const img = ref.querySelector('img');
      if (!img) return;

      const rect = ref.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = containerHeight / 2;
      const offset = (elementCenter - viewportCenter) / containerHeight;

      img.style.transform = `translateY(${offset * -80}px)`;
    });

    // Infinite loop jump
    const totalHeight = container.scrollHeight;
    const oneSetHeight = totalHeight / 3;

    if (scrollTop < oneSetHeight * 0.3) {
      isJumpingRef.current = true;
      container.scrollTop = scrollTop + oneSetHeight;
      requestAnimationFrame(() => { isJumpingRef.current = false; });
    } else if (scrollTop > oneSetHeight * 1.7) {
      isJumpingRef.current = true;
      container.scrollTop = scrollTop - oneSetHeight;
      requestAnimationFrame(() => { isJumpingRef.current = false; });
    }
  }, [activeIndex, projects.length]);

  // Scroll to a specific project
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

  // Initialize scroll to middle set
  useEffect(() => {
    if (containerRef.current) {
      const totalHeight = containerRef.current.scrollHeight;
      const oneSetHeight = totalHeight / 3;
      containerRef.current.scrollTop = oneSetHeight;
    }
  }, []);

  // Scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Forward wheel events from project list to image container
  const handleListWheel = useCallback((e: React.WheelEvent) => {
    if (containerRef.current) {
      containerRef.current.scrollTop += e.deltaY;
    }
  }, []);

  return (
    <div className="fixed inset-0 pt-nav-height pb-footer-height flex">
      {/* Left side — Project list at 2nd quarter (hidden on mobile) */}
      <div onWheel={handleListWheel} className="hidden md:flex absolute left-0 top-0 bottom-0 w-1/2 items-center justify-center z-10">
        <nav className="absolute left-[50%] space-y-1">
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
                    href={`/work/${project.slug}`}
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

      {/* Right side — Scrollable column of images (full width on mobile) */}
      <div
        ref={containerRef}
        className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 overflow-y-auto hide-scrollbar"
      >
        <div className="flex flex-col items-center py-[30vh]">
          {extendedProjects.map((project, index) => {
            const originalIndex = index % projects.length;
            const isActive = originalIndex === activeIndex;

            return (
              <div
                key={`${project._id}-${index}`}
                ref={(el) => { imageRefs.current[index] = el; }}
                className="flex justify-center"
              >
                <Link
                  href={`/work/${project.slug}`}
                  onClick={(e) => {
                    if (!isActive && !isMobile) {
                      e.preventDefault();
                      scrollToProject(originalIndex);
                    }
                  }}
                  className={`
                    block overflow-hidden transition-all duration-300 ease-smooth max-w-[90vw] md:max-w-none
                    ${isActive ? 'opacity-100' : 'opacity-30 grayscale hover:opacity-50'}
                  `}
                  style={getContainerStyle(originalIndex)}
                >
                  <img
                    src={getImageUrl(projects[originalIndex])}
                    alt={project.title}
                    className="w-full will-change-transform"
                    style={{ height: '140%', objectFit: 'cover', marginTop: '-20%' }}
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
