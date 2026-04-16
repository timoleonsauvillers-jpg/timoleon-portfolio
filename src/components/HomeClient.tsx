'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Project } from '@/types';
import { urlFor } from '@/lib/sanity';

interface HomeClientProps {
  projects: Project[];
}

/** Wrap angle to [-π, π] */
function wrapAngle(a: number): number {
  a = ((a + Math.PI) % (2 * Math.PI));
  if (a < 0) a += 2 * Math.PI;
  return a - Math.PI;
}

export function HomeClient({ projects }: HomeClientProps) {
  const N = projects.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number; height: number }>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Animation state (refs to avoid re-renders in the rAF loop)
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const spreadRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const activeRef = useRef(0);
  const isMobileRef = useRef(false);

  // Duplicate items so the wheel looks full even with few projects
  const MIN_SLOTS = 8;
  const repeats = Math.max(1, Math.ceil(MIN_SLOTS / N));
  const SLOT_COUNT = N * repeats;
  const BASE_ANGLE = (2 * Math.PI) / SLOT_COUNT;

  // Tuning constants
  const SCROLL_K = 0.0012;
  const SPREAD_CAP = 0.3;
  const SPREAD_DECAY = 0.92;
  const VEL_DECAY = 0.94;
  const SPRING_K = 0.12;
  const PARALLAX_MAX = 15;
  const OP_MIN = 0.6;

  const fmt = (n: number) => String(n + 1).padStart(2, '0');

  const imgUrl = useCallback((p: Project) =>
    p.thumbnail?.asset
      ? urlFor(p.thumbnail).width(1200).quality(85).url()
      : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80',
  []);

  // Preload image dimensions for orientation-based sizing
  useEffect(() => {
    projects.forEach((p, i) => {
      const img = new Image();
      img.onload = () =>
        setImageDimensions(prev => ({ ...prev, [i]: { width: img.naturalWidth, height: img.naturalHeight } }));
      img.src = imgUrl(p);
    });
  }, [projects, imgUrl]);

  // Responsive breakpoint
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      isMobileRef.current = mobile;
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Image container size based on orientation (compact for wheel)
  const sizeOf = useCallback((i: number): { width: number; height: number } => {
    const d = imageDimensions[i];
    if (!d) return { width: 200, height: 160 };
    const landscape = d.width > d.height;
    const ratio = d.height / d.width;
    if (isMobileRef.current) {
      const w = landscape ? 280 : 200;
      return { width: w, height: Math.round(w * ratio) };
    }
    const w = landscape ? 320 : 200;
    return { width: w, height: Math.round(w * ratio * 0.85) };
  }, [imageDimensions]);

  // ─── Core paint: position every slot on the wheel ───
  const paint = useCallback(() => {
    const a = angleRef.current;
    const sp = spreadRef.current;
    const mobile = isMobileRef.current;
    let bestIdx = 0;
    let bestDist = Infinity;

    const RAD2DEG = 180 / Math.PI;

    // Velocity-based global shrink: proportional to smoothed velocity (spread)
    const velShrink = 1 - (sp / SPREAD_CAP) * 0.35;

    for (let slot = 0; slot < SLOT_COUNT; slot++) {
      const el = itemsRef.current[slot];
      if (!el) continue;

      const theta = wrapAngle(slot * (BASE_ANGLE + sp) + a);
      const absDist = Math.abs(theta);
      const origIdx = slot % N;

      if (absDist < bestDist) {
        bestDist = absDist;
        bestIdx = origIdx;
      }

      // focal: 1 at center, 0 at back of wheel
      const cos = Math.cos(theta);
      const focal = (cos + 1) / 2;

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const r = mobile ? vw * 0.5 : vh * 0.42;

      // Perspective projection: front items spread out, back items compress
      const camDist = r * 2;
      const depth = Math.cos(theta);
      const proj = camDist / (camDist - r * depth);
      const disp = Math.sin(theta) * r * proj;
      const par = (theta / Math.PI) * PARALLAX_MAX * proj;
      // Smooth scale with front boost + velocity shrink
      const baseScale = 0.25 + 0.75 * focal;
      const boost = focal > 0.8 ? ((focal - 0.8) / 0.2) * 0.1 : 0;
      const sc = (baseScale + boost) * velShrink;
      const op = 0.35 + 0.65 * focal;

      // Show 3/4 of the wheel
      const vis = focal > 0.12;

      // Full rotation: front faces viewer, back faces viewer but upside-down (180°)
      const rawDeg = theta * RAD2DEG;

      el.style.transform = mobile
        ? `perspective(900px) translate3d(${disp}px,${par}px,0) rotateY(${rawDeg.toFixed(1)}deg) scale(${sc.toFixed(3)})`
        : `perspective(900px) translate3d(${par}px,${disp}px,0) rotateX(${(-rawDeg).toFixed(1)}deg) scale(${sc.toFixed(3)})`;
      el.style.opacity = vis ? op.toFixed(2) : '0';
      el.style.zIndex = String(Math.round(focal * 100));
      el.style.pointerEvents = vis && focal > 0.3 ? 'auto' : 'none';
    }

    if (bestIdx !== activeRef.current) {
      activeRef.current = bestIdx;
      setActiveIndex(bestIdx);
    }
  }, [SLOT_COUNT, BASE_ANGLE, N]);

  // ─── Animation tick ───
  const tick = useCallback(() => {
    // Spring toward target when set (used by scrollToProject)
    if (targetRef.current !== null) {
      const diff = wrapAngle(targetRef.current - angleRef.current);
      if (Math.abs(diff) < 0.002) {
        angleRef.current = targetRef.current;
        targetRef.current = null;
        velocityRef.current = 0;
      } else {
        velocityRef.current = diff * SPRING_K;
      }
    }

    angleRef.current += velocityRef.current;
    velocityRef.current *= VEL_DECAY;
    spreadRef.current *= SPREAD_DECAY;

    paint();

    const moving =
      Math.abs(velocityRef.current) > 0.00003 ||
      Math.abs(spreadRef.current) > 0.0003 ||
      targetRef.current !== null;

    if (moving) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      velocityRef.current = 0;
      spreadRef.current = 0;
      runningRef.current = false;
      paint();
    }
  }, [paint]);

  const kick = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  // ─── Navigate wheel to a specific project ───
  const goTo = useCallback((idx: number) => {
    // Find the nearest duplicate slot for this project
    let bestSlot = idx;
    let bestDist = Infinity;
    for (let r = 0; r < repeats; r++) {
      const slot = idx + r * N;
      const slotAngle = wrapAngle(slot * BASE_ANGLE + angleRef.current);
      if (Math.abs(slotAngle) < bestDist) {
        bestDist = Math.abs(slotAngle);
        bestSlot = slot;
      }
    }
    const diff = wrapAngle(-(bestSlot * BASE_ANGLE) - angleRef.current);
    targetRef.current = angleRef.current + diff;
    kick();
  }, [N, repeats, BASE_ANGLE, kick]);

  // ─── Wheel input ───
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      targetRef.current = null;
      const d = e.deltaY || e.deltaX;
      velocityRef.current += d * SCROLL_K;
      spreadRef.current = Math.min(SPREAD_CAP, spreadRef.current + Math.abs(d * SCROLL_K) * 1.8);
      kick();
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, [kick]);

  // ─── Touch input (drag + flick with momentum) ───
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let lastX = 0, lastY = 0, lastTime = 0;
    let flickVel = 0;
    let isDragging = false;
    const TOUCH_K = 0.005;

    const start = (e: TouchEvent) => {
      e.preventDefault(); // Block iOS pull-to-refresh & address bar
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      lastTime = Date.now();
      flickVel = 0;
      isDragging = true;
      velocityRef.current = 0;
      targetRef.current = null;
    };

    const move = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const cx = e.touches[0].clientX;
      const cy = e.touches[0].clientY;
      const t = Date.now();
      const dt = Math.max(t - lastTime, 1);

      const dx = lastX - cx;
      const dy = lastY - cy;

      // Use whichever axis has the larger movement
      const delta = Math.abs(dy) >= Math.abs(dx) ? dy : dx;

      // Direct drag: move the wheel proportionally
      angleRef.current += delta * TOUCH_K;

      // Track velocity for flick release (smooth it to avoid jitter)
      const instantVel = (delta * TOUCH_K) / (dt / 16);
      flickVel = flickVel * 0.5 + instantVel * 0.5;

      spreadRef.current = Math.min(SPREAD_CAP, spreadRef.current + Math.abs(delta * TOUCH_K) * 1.2);
      lastX = cx;
      lastY = cy;
      lastTime = t;

      // Paint immediately during drag for responsiveness
      paint();
    };

    const end = () => {
      if (!isDragging) return;
      isDragging = false;
      // Transfer flick velocity for momentum after release
      velocityRef.current = flickVel * 0.8;
      spreadRef.current = Math.min(SPREAD_CAP, spreadRef.current + Math.abs(flickVel) * 2);
      kick();
    };

    el.addEventListener('touchstart', start, { passive: false });
    el.addEventListener('touchmove', move, { passive: false });
    el.addEventListener('touchend', end, { passive: true });
    el.addEventListener('touchcancel', end, { passive: true });
    return () => {
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchmove', move);
      el.removeEventListener('touchend', end);
      el.removeEventListener('touchcancel', end);
    };
  }, [kick, paint]);

  // Forward wheel events from the project list panel
  const fwdWheel = useCallback((e: React.WheelEvent) => {
    targetRef.current = null;
    const d = e.deltaY || e.deltaX;
    velocityRef.current += d * SCROLL_K;
    spreadRef.current = Math.min(SPREAD_CAP, spreadRef.current + Math.abs(d * SCROLL_K) * 1.8);
    kick();
  }, [kick]);

  // Initial paint + cleanup
  useEffect(() => { paint(); }, [paint]);
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  // Repaint on resize
  useEffect(() => {
    const handler = () => paint();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [paint]);

  return (
    <div className="fixed inset-0 pt-nav-height pb-footer-height flex overflow-hidden" style={{ overscrollBehavior: 'none' }}>
      {/* ── Left: Project list (desktop) ── */}
      <div
        onWheel={fwdWheel}
        className="hidden md:flex absolute left-0 top-0 bottom-0 w-1/2 items-center justify-center z-10"
      >
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
                      {fmt(index)}/
                    </span>
                    <span className="text-project-title font-normal text-foreground uppercase tracking-wide transition-opacity duration-200 ease-in-out group-hover:opacity-50">
                      {project.title}
                    </span>
                  </Link>
                ) : (
                  <button
                    onClick={() => goTo(index)}
                    className="group inline-flex items-baseline gap-1 cursor-pointer text-left"
                  >
                    <span className="text-project-number font-normal text-muted transition-colors duration-200 ease-in-out group-hover:text-foreground">
                      {fmt(index)}/
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

      {/* ── Right: Wheel carousel ── */}
      <div
        ref={containerRef}
        className="absolute right-0 top-0 bottom-0 w-full md:w-1/2"
        style={{ touchAction: 'none', overscrollBehavior: 'none', WebkitOverflowScrolling: 'auto' }}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {Array.from({ length: SLOT_COUNT }, (_, slot) => {
            const origIdx = slot % N;
            const project = projects[origIdx];
            const isActive = origIdx === activeIndex;
            const { width, height } = sizeOf(origIdx);

            return (
              <div
                key={`${project._id}-${slot}`}
                ref={el => { itemsRef.current[slot] = el; }}
                className="absolute inset-0 m-auto will-change-transform"
                style={{ width, height }}
              >
                <Link
                  href={`/work/${project.slug}`}
                  onClick={e => {
                    if (!isActive && !isMobile) {
                      e.preventDefault();
                      goTo(origIdx);
                    }
                  }}
                  className="block w-full h-full overflow-hidden"
                >
                  <img
                    src={imgUrl(project)}
                    alt={project.title}
                    className="w-full h-auto"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Mobile: active project label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute bottom-[20%] left-0 right-0 text-center pointer-events-none z-[200]"
          >
            <Link
              href={`/work/${projects[activeIndex].slug}`}
              className="pointer-events-auto inline-flex items-baseline gap-1"
            >
              <span className="text-project-number font-normal text-foreground">
                {fmt(activeIndex)}/
              </span>
              <span className="text-project-title font-normal text-foreground uppercase tracking-wide">
                {projects[activeIndex].title}
              </span>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
