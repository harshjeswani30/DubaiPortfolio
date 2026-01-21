'use client';

import { useEffect, useRef, useState } from 'react';

export interface CircleTrailCursorProps {
  fillColor?: string;
  size?: number;
  scaleOnEnter?: number;
  opacityOnEnter?: number;
  triggerSelector?: string;
  lerpAmount?: number;
}

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

export function CircleTrailCursor({
  fillColor = '#00ADB5',
  size = 24,
  scaleOnEnter = 2,
  opacityOnEnter = 0.8,
  triggerSelector = 'a, button, [data-cursor-hover]',
  lerpAmount = 0.2
}: CircleTrailCursorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isCoarse, setIsCoarse] = useState(true);
  const cursorPos = useRef({ x: 0, y: 0 });
  const renderedStyles = useRef({
    tx: { previous: 0, current: 0 },
    ty: { previous: 0, current: 0 },
    scale: { previous: 1, current: 1 },
    opacity: { previous: 1, current: 1 }
  });
  const rafId = useRef<number | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsCoarse(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || isCoarse) return;

    const svg = svgRef.current;
    if (!svg) return;

    svg.style.opacity = '0';

    const onMouseMove = (ev: MouseEvent) => {
      cursorPos.current = { x: ev.clientX, y: ev.clientY };

      if (!initialized.current) {
        renderedStyles.current.tx.previous = renderedStyles.current.tx.current = cursorPos.current.x - size / 2;
        renderedStyles.current.ty.previous = renderedStyles.current.ty.current = cursorPos.current.y - size / 2;
        svg.style.opacity = '1';
        initialized.current = true;
        render();
      }
    };

    const enter = () => {
      renderedStyles.current.scale.current = scaleOnEnter;
      renderedStyles.current.opacity.current = opacityOnEnter;
    };

    const leave = () => {
      renderedStyles.current.scale.current = 1;
      renderedStyles.current.opacity.current = 1;
    };

    const render = () => {
      renderedStyles.current.tx.current = cursorPos.current.x - size / 2;
      renderedStyles.current.ty.current = cursorPos.current.y - size / 2;

      renderedStyles.current.tx.previous = lerp(
        renderedStyles.current.tx.previous,
        renderedStyles.current.tx.current,
        lerpAmount
      );
      renderedStyles.current.ty.previous = lerp(
        renderedStyles.current.ty.previous,
        renderedStyles.current.ty.current,
        lerpAmount
      );
      renderedStyles.current.scale.previous = lerp(
        renderedStyles.current.scale.previous,
        renderedStyles.current.scale.current,
        lerpAmount
      );
      renderedStyles.current.opacity.previous = lerp(
        renderedStyles.current.opacity.previous,
        renderedStyles.current.opacity.current,
        lerpAmount
      );

      svg.style.transform = `translateX(${renderedStyles.current.tx.previous}px) translateY(${renderedStyles.current.ty.previous}px) scale(${renderedStyles.current.scale.previous})`;
      svg.style.opacity = String(renderedStyles.current.opacity.previous);

      rafId.current = requestAnimationFrame(render);
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
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      initialized.current = false;
    };
  }, [size, scaleOnEnter, opacityOnEnter, triggerSelector, lerpAmount, isCoarse]);

  if (isCoarse) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        @media (any-pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
      <svg
        ref={svgRef}
        className="cursor"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          display: 'block',
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: 0,
          willChange: 'transform, opacity'
        }}
      >
        <circle
          className="cursor__inner"
          cx="12"
          cy="12"
          r="6"
          fill={fillColor}
        />
      </svg>
    </>
  );
}
