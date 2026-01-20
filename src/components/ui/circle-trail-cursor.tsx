'use client';

import { useEffect, useRef, useState } from 'react';

export interface CircleTrailCursorProps {
  fillColor?: string;
  baseRadius?: number;
  triggerSelector?: string;
}

export function CircleTrailCursor({
  fillColor = '#00ADB5',
  baseRadius = 8,
  triggerSelector = 'a, button, [data-cursor-hover]'
}: CircleTrailCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isCoarse, setIsCoarse] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isCoarse) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (ev: MouseEvent) => {
      cursor.style.transform = `translate(${ev.clientX - baseRadius}px, ${ev.clientY - baseRadius}px)`;
      cursor.style.opacity = '1';
    };

    const enter = () => setIsHovering(true);
    const leave = () => setIsHovering(false);

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
  }, [baseRadius, triggerSelector, isCoarse]);

  if (isCoarse) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        * {
          cursor: ${isHovering ? 'auto' : 'none'} !important;
        }
      `}</style>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: baseRadius * 2,
          height: baseRadius * 2,
          borderRadius: '50%',
          backgroundColor: fillColor,
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.2s ease',
          display: isHovering ? 'none' : 'block'
        }}
      />
    </>
  );
}
