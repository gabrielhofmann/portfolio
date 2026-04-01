"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const selection = selectionRef.current;
    if (!cursor || !selection) return;

    const move = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.12,
        ease: "power3.out",
      });

      if (isSelecting) {
        const x = Math.min(e.clientX, startPos.current.x);
        const y = Math.min(e.clientY, startPos.current.y);
        const w = Math.abs(e.clientX - startPos.current.x);
        const h = Math.abs(e.clientY - startPos.current.y);

        gsap.set(selection, { left: x, top: y, width: w, height: h });
      }
    };

    const down = (e: MouseEvent) => {
      cursor.classList.add("click");
      setIsSelecting(true);
      startPos.current = { x: e.clientX, y: e.clientY };
      gsap.set(selection, {
        left: e.clientX,
        top: e.clientY,
        width: 0,
        height: 0,
        opacity: 0.3,
      });
    };

    const up = () => {
      cursor.classList.remove("click");
      setIsSelecting(false);
      gsap.to(selection, { opacity: 0, duration: 0.2 });
    };

    // hover
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // hover normal
      if (target.closest("a, button, [data-cursor='hover']")) {
        cursor.classList.add("hover");
      }

      // muda a cor se o fundo não for #0b0b0b
      const bgColor = window.getComputedStyle(target).backgroundColor;
      if (!isBlack(bgColor)) {
        cursor.classList.add("hover-dark");
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-cursor='hover']")) {
        cursor.classList.remove("hover");
      }
      cursor.classList.remove("hover-dark");
    };

    const isBlack = (color: string) => {
      // recebe "rgb(r, g, b)" e verifica se é próximo de #0b0b0b
      const match = color.match(/\d+/g);
      if (!match) return false;
      const [r, g, b] = match.map(Number);
      return r <= 15 && g <= 15 && b <= 15; // tolerância
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    // previne seleção nativa
    const preventSelection = (e: Event) => e.preventDefault();
    document.addEventListener("selectstart", preventSelection);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.removeEventListener("selectstart", preventSelection);
    };
  }, [isSelecting]);

  return (
    <>
      {/* CURSOR */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <div className="cursor-shape relative w-10 h-9">
          <div className="corner tl" />
          <div className="corner tr" />
          <div className="corner bl" />
          <div className="corner br" />
          <div className="cross cross-1" />
          <div className="cross cross-2" />
        </div>
      </div>

      {/* SELECTION BOX */}
      <div
        ref={selectionRef}
        className="fixed z-[9998] pointer-events-none bg-orange"
        style={{ opacity: 0 }}
      />

      <style jsx>{`
        .cursor-shape {
          transition: transform 0.2s ease;
        }
        .corner {
          position: absolute;
          width: 10px;
          height: 10px;
          border: 3px solid var(--color-orange);
          transform-origin: center;
        }
        .tl { top: 0; left: 0; border-right: none; border-bottom: none; transform: rotate(-180deg); }
        .tr { top: 0; right: 0; border-left: none; border-bottom: none; transform: rotate(180deg); }
        .bl { bottom: 0; left: 0; border-right: none; border-top: none; transform: rotate(180deg); }
        .br { bottom: 0; right: 0; border-left: none; border-top: none; transform: rotate(-180deg); }
        .cross { position: absolute; top: 50%; left: 50%; width: 100%; height: 4px; background: var(--color-orange); transform-origin: center; opacity: 0; }
        .cross-1 { transform: translate(-50%, -50%) rotate(45deg); }
        .cross-2 { transform: translate(-50%, -50%) rotate(-45deg); }
        div.hover .cursor-shape { transform: scale(1.4); }
        div.click .corner { opacity: 0; }
        div.click .cross { opacity: 1; }
        div.click .cursor-shape { transform: scale(0.9); }

        /* CURSOR ESCURO quando hover sobre elementos claros */
        div.hover-dark .corner {
          border-color: #0b0b0b;
        }
        div.hover-dark .cross {
          background-color: #0b0b0b;
        }

        body {
          user-select: none;
        }
      `}</style>
    </>
  );
}