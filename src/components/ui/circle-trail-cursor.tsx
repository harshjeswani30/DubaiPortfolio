'use client';

import { useEffect, useRef, useState } from 'react';

export interface CircleTrailCursorProps {
  fillColor?: string;
  baseRadius?: number;
  hoverRadius?: number;
  triggerSelector?: string;
  proximityThreshold?: number;
}

export function CircleTrailCursor({
  fillColor = '#00ADB5',
  baseRadius = 8,
  hoverRadius = 20,
  triggerSelector = 'a, button, [data-cursor-hover]',
  proximityThreshold = 50
}: CircleTrailCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isCoarse, setIsCoarse] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const shrinkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNearTriggerRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isCoarse) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const checkProximity = (x: number, y: number) => {
      const triggers = document.querySelectorAll(triggerSelector);
      for (const trigger of triggers) {
        const rect = trigger.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const threshold = Math.max(rect.width, rect.height) / 2 + proximityThreshold;
        if (distance < threshold) {
          return true;
        }
      }
      return false;
    };

    const onMouseMove = (ev: MouseEvent) => {
      posRef.current = { x: ev.clientX, y: ev.clientY };
      const currentRadius = isHovering ? hoverRadius : baseRadius;
      cursor.style.transform = `translate(${ev.clientX - currentRadius}px, ${ev.clientY - currentRadius}px)`;
      cursor.style.opacity = '1';
      
      isNearTriggerRef.current = checkProximity(ev.clientX, ev.clientY);
    };

    const enter = () => {
      if (shrinkTimeoutRef.current) {
        clearTimeout(shrinkTimeoutRef.current);
        shrinkTimeoutRef.current = null;
      }
      setIsHovering(true);
    };

    const leave = () => {
      if (shrinkTimeoutRef.current) {
        clearTimeout(shrinkTimeoutRef.current);
      }
      shrinkTimeoutRef.current = setTimeout(() => {
        if (!isNearTriggerRef.current) {
          setIsHovering(false);
        } else {
          const checkAndShrink = () => {
            if (!isNearTriggerRef.current) {
              setIsHovering(false);
            } else {
              shrinkTimeoutRef.current = setTimeout(checkAndShrink, 100);
            }
          };
          shrinkTimeoutRef.current = setTimeout(checkAndShrink, 100);
        }
      }, 150);
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
      if (shrinkTimeoutRef.current) {
        clearTimeout(shrinkTimeoutRef.current);
      }
    };
  }, [baseRadius, hoverRadius, triggerSelector, isCoarse, isHovering, proximityThreshold]);

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
