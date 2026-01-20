'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

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
  proximityThreshold = 40
}: CircleTrailCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [isCoarse, setIsCoarse] = useState(true);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const isExpandedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const hoverCountRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const isOverTrigger = useCallback((x: number, y: number): boolean => {
    const triggers = document.querySelectorAll(triggerSelector);
    for (const trigger of triggers) {
      const rect = trigger.getBoundingClientRect();
      if (
        x >= rect.left - proximityThreshold &&
        x <= rect.right + proximityThreshold &&
        y >= rect.top - proximityThreshold &&
        y <= rect.bottom + proximityThreshold
      ) {
        return true;
      }
    }
    return false;
  }, [triggerSelector, proximityThreshold]);

  const updateCursorStyle = useCallback((expanded: boolean) => {
    const cursor = cursorRef.current;
    const inner = innerRef.current;
    if (!cursor || !inner) return;

    const radius = expanded ? hoverRadius : baseRadius;
    cursor.style.width = `${radius * 2}px`;
    cursor.style.height = `${radius * 2}px`;
    cursor.style.backgroundColor = expanded ? 'transparent' : fillColor;
    cursor.style.border = expanded ? `2px solid ${fillColor}` : 'none';
    
    inner.style.opacity = expanded ? '0' : '1';
  }, [baseRadius, hoverRadius, fillColor]);

  useEffect(() => {
    if (typeof window === 'undefined' || isCoarse) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let currentRadius = baseRadius;

    const animate = () => {
      const dx = targetRef.current.x - posRef.current.x;
      const dy = targetRef.current.y - posRef.current.y;
      
      posRef.current.x += dx * 0.15;
      posRef.current.y += dy * 0.15;

      currentRadius = isExpandedRef.current ? hoverRadius : baseRadius;
      
      cursor.style.transform = `translate(${posRef.current.x - currentRadius}px, ${posRef.current.y - currentRadius}px)`;
      
      rafRef.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (ev: MouseEvent) => {
      targetRef.current = { x: ev.clientX, y: ev.clientY };
      cursor.style.opacity = '1';

      const overTrigger = isOverTrigger(ev.clientX, ev.clientY);
      
      if (overTrigger && !isExpandedRef.current) {
        isExpandedRef.current = true;
        updateCursorStyle(true);
      } else if (!overTrigger && isExpandedRef.current && hoverCountRef.current === 0) {
        isExpandedRef.current = false;
        updateCursorStyle(false);
      }
    };

    const onMouseEnter = () => {
      hoverCountRef.current++;
      if (!isExpandedRef.current) {
        isExpandedRef.current = true;
        updateCursorStyle(true);
      }
    };

    const onMouseLeave = () => {
      hoverCountRef.current = Math.max(0, hoverCountRef.current - 1);
      
      setTimeout(() => {
        if (hoverCountRef.current === 0) {
          const stillOver = isOverTrigger(targetRef.current.x, targetRef.current.y);
          if (!stillOver) {
            isExpandedRef.current = false;
            updateCursorStyle(false);
          }
        }
      }, 50);
    };

    const onMouseLeaveWindow = () => {
      cursor.style.opacity = '0';
    };

    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeaveWindow);

    const attachListeners = () => {
      const triggers = document.querySelectorAll(triggerSelector);
      triggers.forEach((trigger) => {
        trigger.addEventListener('mouseenter', onMouseEnter);
        trigger.addEventListener('mouseleave', onMouseLeave);
      });
      return triggers;
    };

    let triggers = attachListeners();

    const observer = new MutationObserver(() => {
      triggers.forEach((trigger) => {
        trigger.removeEventListener('mouseenter', onMouseEnter);
        trigger.removeEventListener('mouseleave', onMouseLeave);
      });
      triggers = attachListeners();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      triggers.forEach((trigger) => {
        trigger.removeEventListener('mouseenter', onMouseEnter);
        trigger.removeEventListener('mouseleave', onMouseLeave);
      });
      observer.disconnect();
    };
  }, [baseRadius, hoverRadius, triggerSelector, isCoarse, proximityThreshold, isOverTrigger, updateCursorStyle]);

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
          border: 'none',
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: 0,
          willChange: 'transform, width, height',
          transition: 'width 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), height 0.25s cubic-bezier(0.25, 0.1, 0.25, 1), background-color 0.2s ease, border 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: '#fff',
            transition: 'opacity 0.2s ease',
            opacity: 1,
          }}
        />
      </div>
    </>
  );
}
