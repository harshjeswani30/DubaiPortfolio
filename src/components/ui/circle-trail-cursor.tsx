'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

interface CursorPosition {
  x: number;
  y: number;
}

interface RenderedStyle {
  previous: number;
  current: number;
  amt: number;
}

interface RenderedStyles {
  tx: RenderedStyle;
  ty: RenderedStyle;
  radius: RenderedStyle;
  opacity: RenderedStyle;
}

export interface CircleTrailCursorProps {
  strokeColor?: string;
  trailCount?: number;
  baseRadius?: number;
  radiusOnEnter?: number;
  triggerSelector?: string;
}

export function CircleTrailCursor({
  strokeColor = '#00ADB5',
  trailCount = 8,
  baseRadius = 15,
  radiusOnEnter = 40,
  triggerSelector = 'a, button, [data-cursor-hover]'
}: CircleTrailCursorProps) {
  const cursorRef = useRef<CursorPosition>({ x: 0, y: 0 });
  const elementsRef = useRef<SVGSVGElement[]>([]);
  const circlesRef = useRef<SVGCircleElement[]>([]);
  const stylesRef = useRef<RenderedStyles[]>([]);
  const boundsRef = useRef<DOMRect[]>([]);
  const opacitiesRef = useRef<number[]>([]);
  const feTurbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const filterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const primitiveValuesRef = useRef({ turbulence: 0 });
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const amts = [0.15, 0.13, 0.115, 0.1, 0.085, 0.07, 0.055, 0.04];
    const baseOpacities = [1, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

    elementsRef.current.forEach((el, i) => {
      if (!el) return;
      const circle = circlesRef.current[i];
      const bounds = el.getBoundingClientRect();
      boundsRef.current[i] = bounds;
      opacitiesRef.current[i] = baseOpacities[i] ?? 0.1;

      stylesRef.current[i] = {
        tx: { previous: 0, current: 0, amt: amts[i] ?? 0.04 },
        ty: { previous: 0, current: 0, amt: amts[i] ?? 0.04 },
        radius: { previous: baseRadius, current: baseRadius, amt: amts[i] ?? 0.04 },
        opacity: { previous: baseOpacities[i] ?? 0.1, current: baseOpacities[i] ?? 0.1, amt: amts[i] ?? 0.04 }
      };

      el.style.opacity = '0';
      if (circle) {
        circle.setAttribute('r', String(baseRadius));
      }
    });

    if (feTurbulenceRef.current) {
      filterTimelineRef.current = gsap.timeline({
        paused: true,
        onUpdate: () => {
          feTurbulenceRef.current?.setAttribute('baseFrequency', String(primitiveValuesRef.current.turbulence));
        },
        onComplete: () => {
          const firstCircle = circlesRef.current[0];
          if (firstCircle) {
            firstCircle.style.filter = 'none';
          }
        }
      }).to(primitiveValuesRef.current, {
        duration: 0.5,
        ease: 'sine.in',
        startAt: { turbulence: 1 },
        turbulence: 0
      });
    }

    const onMouseMove = (ev: MouseEvent) => {
      cursorRef.current = { x: ev.clientX, y: ev.clientY };

      if (!initializedRef.current) {
        initializedRef.current = true;
        elementsRef.current.forEach((el, i) => {
          if (!el) return;
          const bounds = boundsRef.current[i];
          const styles = stylesRef.current[i];
          if (bounds && styles) {
            styles.tx.previous = styles.tx.current = cursorRef.current.x - bounds.width / 2;
            styles.ty.previous = styles.ty.current = cursorRef.current.y - bounds.height / 2;
            el.style.opacity = String(opacitiesRef.current[i]);
          }
        });
        requestAnimationFrame(render);
      }
    };

    const enter = () => {
      stylesRef.current.forEach((styles) => {
        if (styles) {
          styles.radius.current = radiusOnEnter;
          styles.opacity.current = 1;
        }
      });
      
      const firstCircle = circlesRef.current[0];
      if (firstCircle && filterTimelineRef.current) {
        firstCircle.style.filter = 'url(#cursor-filter)';
        filterTimelineRef.current.restart();
      }
    };

    const leave = () => {
      stylesRef.current.forEach((styles, i) => {
        if (styles) {
          styles.radius.current = baseRadius;
          styles.opacity.current = opacitiesRef.current[i] ?? 0.1;
        }
      });
      
      if (filterTimelineRef.current) {
        filterTimelineRef.current.progress(1).kill();
      }
    };

    const render = () => {
      elementsRef.current.forEach((el, i) => {
        if (!el) return;
        const styles = stylesRef.current[i];
        const bounds = boundsRef.current[i];
        const circle = circlesRef.current[i];
        if (!styles || !bounds || !circle) return;

        styles.tx.current = cursorRef.current.x - bounds.width / 2;
        styles.ty.current = cursorRef.current.y - bounds.height / 2;

        for (const key in styles) {
          const style = styles[key as keyof RenderedStyles];
          style.previous = lerp(style.previous, style.current, style.amt);
        }

        el.style.transform = `translateX(${styles.tx.previous}px) translateY(${styles.ty.previous}px)`;
        circle.setAttribute('r', String(styles.radius.previous));
        el.style.opacity = String(styles.opacity.previous);
      });

      requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove);

    const triggers = document.querySelectorAll(triggerSelector);
    triggers.forEach((trigger) => {
      trigger.addEventListener('mouseenter', enter);
      trigger.addEventListener('mouseleave', leave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      triggers.forEach((trigger) => {
        trigger.removeEventListener('mouseenter', enter);
        trigger.removeEventListener('mouseleave', leave);
      });
    };
  }, [baseRadius, radiusOnEnter, triggerSelector]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        .cursor {
          position: fixed;
          top: 0;
          left: 0;
          display: block;
          pointer-events: none;
          z-index: 10000;
        }
        .cursor__inner {
          fill: none;
          stroke: ${strokeColor};
          stroke-width: 1px;
        }
      `}</style>

      <svg className="cursor" width="100" height="100" viewBox="0 0 100 100" ref={(el) => { if (el) elementsRef.current[0] = el; }}>
        <defs>
          <filter id="cursor-filter" x="-50%" y="-50%" width="200%" height="200%" filterUnits="objectBoundingBox">
            <feTurbulence 
              ref={feTurbulenceRef}
              type="fractalNoise" 
              baseFrequency="0" 
              numOctaves={1} 
              result="warp" 
            />
            <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale={30} in="SourceGraphic" />
          </filter>
        </defs>
        <circle className="cursor__inner" cx="50" cy="50" r={baseRadius} ref={(el) => { if (el) circlesRef.current[0] = el; }} />
      </svg>

      {Array.from({ length: trailCount - 1 }).map((_, i) => (
        <svg 
          key={i + 1}
          className="cursor" 
          width="100" 
          height="100" 
          viewBox="0 0 100 100"
          ref={(el) => { if (el) elementsRef.current[i + 1] = el; }}
        >
          <circle 
            className="cursor__inner" 
            cx="50" 
            cy="50" 
            r={baseRadius}
            ref={(el) => { if (el) circlesRef.current[i + 1] = el; }}
          />
        </svg>
      ))}
    </>
  );
}
