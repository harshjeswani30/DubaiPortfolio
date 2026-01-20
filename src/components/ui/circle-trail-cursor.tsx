'use client';

import { useEffect, useRef, useState } from 'react';

export interface CircleTrailCursorProps {
  fillColor?: string;
  baseRadius?: number;
  hoverRadius?: number;
  triggerSelector?: string;
}

export function CircleTrailCursor({
  fillColor = '#00ADB5',
  baseRadius = 8,
  hoverRadius = 20,
  triggerSelector = 'a, button, [data-cursor-hover]'
}: CircleTrailCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isCoarse, setIsCoarse] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isCoarse) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const currentRadius = isHovering ? hoverRadius : baseRadius;

    const onMouseMove = (ev: MouseEvent) => {
      posRef.current = { x: ev.clientX, y: ev.clientY };
      cursor.style.transform = `translate(${ev.clientX - currentRadius}px, ${ev.clientY - currentRadius}px)`;
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
  }, [baseRadius, hoverRadius, triggerSelector, isCoarse, isHovering]);

  useEffect(() => {
    if (isCoarse) return;
    const cursor = cursorRef.current;
    if (!cursor) return;
    
    const currentRadius = isHovering ? hoverRadius : baseRadius;
    cursor.style.transform = `translate(${posRef.current.x - currentRadius}px, ${posRef.current.y - currentRadius}px)`;
  }, [isHovering, baseRadius, hoverRadius, isCoarse]);

  if (isCoarse) {
    return null;
  }

  const currentRadius = isHovering ? hoverRadius : baseRadius;

  return (
    <>
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: currentRadius * 2,
          height: currentRadius * 2,
          borderRadius: '50%',
          backgroundColor: isHovering ? 'transparent' : fillColor,
          border: isHovering ? `2px solid ${fillColor}` : 'none',
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: 0,
          willChange: 'transform',
          transition: 'width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border 0.2s ease',
        }}
      />
    </>
  );
}
