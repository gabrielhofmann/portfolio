"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // movimento
    const move = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.12,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", move);

    // click
    const down = () => cursor.classList.add("click");
    const up = () => cursor.classList.remove("click");

    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    // hover
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor='hover']")) {
        cursor.classList.add("hover");
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor='hover']")) {
        cursor.classList.remove("hover");
      }
    };

    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="cursor-shape relative w-10 h-9">
          {/* TOP LEFT */}
          <div className="corner tl" />
          {/* TOP RIGHT */}
          <div className="corner tr" />
          {/* BOTTOM LEFT */}
          <div className="corner bl" />
          {/* BOTTOM RIGHT */}
          <div className="corner br" />

          {/* X (click state) */}
          <div className="cross cross-1" />
          <div className="cross cross-2" />
        </div>
      </div>

      <style jsx>{`
        .cursor-shape {
          transition: transform 0.2s ease;
        }

        /* 🔶 CORNERS (pointer state) */
        .corner {
          position: absolute;
          width: 8px;
          height: 8px;
          border: 2px solid var(--color-orange);
          transform-origin: center;
        }

        /* 🔺 TOP LEFT */
        .tl {
          top: 0;
          left: 0;
          border-right: none;
          border-bottom: none;
          transform: rotate(-180deg);
        }

        /* 🔺 TOP RIGHT */
        .tr {
          top: 0;
          right: 0;
          border-left: none;
          border-bottom: none;
          transform: rotate(180deg);
        }

        /* 🔻 BOTTOM LEFT */
        .bl {
          bottom: 0;
          left: 0;
          border-right: none;
          border-top: none;
          transform: rotate(180deg);
        }

        /* 🔻 BOTTOM RIGHT */
        .br {
          bottom: 0;
          right: 0;
          border-left: none;
          border-top: none;
          transform: rotate(-180deg);
        }

        /* ❌ CROSS (click state) */
        .cross {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 2px;
          background: var(--color-orange);
          transform-origin: center;
          opacity: 0;
        }

        .cross-1 {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .cross-2 {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        /* 🖱️ HOVER */
        div.hover .cursor-shape {
          transform: scale(1.4);
        }

        /* 💥 CLICK → vira X */
        div.click .corner {
          opacity: 0;
        }

        div.click .cross {
          opacity: 1;
        }

        div.click .cursor-shape {
          transform: scale(0.9);
        }
      `}</style>
    </>
  );
}
