'use client';

import { useEffect, useRef, useState } from 'react';

export interface CircleTrailCursorProps {
  strokeColor?: string;
  baseRadius?: number;
  radiusOnEnter?: number;
  triggerSelector?: string;
}

export function CircleTrailCursor({
  strokeColor = '#00ADB5',
  baseRadius = 15,
  radiusOnEnter = 40,
  triggerSelector = 'a, button, [data-cursor-hover]'
}: CircleTrailCursorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const [isCoarse, setIsCoarse] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isCoarse) return;

    const svg = svgRef.current;
    const circle = circleRef.current;
    if (!svg || !circle) return;

    let currentRadius = baseRadius;
    let targetRadius = baseRadius;

    const onMouseMove = (ev: MouseEvent) => {
      svg.style.transform = `translate(${ev.clientX - 50}px, ${ev.clientY - 50}px)`;
      svg.style.opacity = '1';
    };

    const animateRadius = () => {
      if (Math.abs(currentRadius - targetRadius) > 0.1) {
        currentRadius += (targetRadius - currentRadius) * 0.15;
        circle.setAttribute('r', String(currentRadius));
      }
      requestAnimationFrame(animateRadius);
    };

    const enter = () => {
      targetRadius = radiusOnEnter;
    };

    const leave = () => {
      targetRadius = baseRadius;
    };

    window.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(animateRadius);

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
  }, [baseRadius, radiusOnEnter, triggerSelector, isCoarse]);

  if (isCoarse) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
      <svg 
        ref={svgRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: 0,
          willChange: 'transform'
        }}
        width="100" 
        height="100" 
        viewBox="0 0 100 100"
      >
        <circle 
          ref={circleRef}
          cx="50" 
          cy="50" 
          r={baseRadius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1"
        />
      </svg>
    </>
  );
}
