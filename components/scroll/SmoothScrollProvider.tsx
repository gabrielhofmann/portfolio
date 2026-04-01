"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,

        smooth: 1.4,
        effects: true,
        normalizeScroll: true,
        smoothTouch: 0.1,
      });

      return () => {
        smoother.kill();
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      id="smooth-wrapper"
      className="h-screen overflow-hidden"
    >
      <div ref={contentRef} id="smooth-content">
        {children}
      </div>
    </div>
  );
}
