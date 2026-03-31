"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/all";

type Cell = {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
  scrambling: boolean;
};

gsap.registerPlugin(ScrambleTextPlugin);

export default function Overlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  const [gridSize, setGridSize] = useState(72);

  // 📱 Responsividade
  useEffect(() => {
    const updateGrid = () => {
      setGridSize(window.innerWidth > 1200 ? 72 : 18);
    };

    updateGrid();
    window.addEventListener("resize", updateGrid);

    return () => window.removeEventListener("resize", updateGrid);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = Array.from(
      containerRef.current.querySelectorAll(".cell"),
    ) as HTMLDivElement[];

    const cells: Cell[] = elements.map((el) => {
      const rect = el.getBoundingClientRect();

      return {
        el,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        ox: rect.left + rect.width / 2,
        oy: rect.top + rect.height / 2,
        scrambling: false,
      };
    });

    // 🖱️ Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // ⚙️ Física
    const RADIUS = 240;
    const FORCE = 0.5;
    const SPRING = 0.08;
    const DAMPING = 0.385;

    const tick = () => {
      cells.forEach((cell) => {
        const dx = cell.ox + cell.x - mouse.current.x;
        const dy = cell.oy + cell.y - mouse.current.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        // 🧲 Repulsão
        if (dist < RADIUS) {
          const angle = Math.atan2(dy, dx);
          const force = (1 - dist / RADIUS) * FORCE;

          cell.vx += Math.cos(angle) * force * 10;
          cell.vy += Math.sin(angle) * force * 10;
        }

        // 🪄 Spring
        cell.vx += -cell.x * SPRING;
        cell.vy += -cell.y * SPRING;

        // 💨 Damping
        cell.vx *= DAMPING;
        cell.vy *= DAMPING;

        cell.x += cell.vx;
        cell.y += cell.vy;

        gsap.set(cell.el, {
          x: cell.x,
          y: cell.y,
        });
      });
    };

    gsap.ticker.add(tick);

    // 🔥 SCRAMBLE LOOP (independente)
    const MIN_CELLS = 3;
    const MAX_CELLS = gridSize === 72 ? 30 : 9;

    const texts = ["GHM", "777", "ERR", "SYS", "DEV", "SRC"];

    const runScrambleLoop = () => {
      const amount = gsap.utils.random(MIN_CELLS, MAX_CELLS, 1);

      const shuffled = gsap.utils.shuffle([...cells]);
      const selected = shuffled.slice(0, amount);

      selected.forEach((cell) => {
        if (cell.scrambling) return;

        cell.scrambling = true;

        gsap.to(cell.el, {
          duration: gsap.utils.random(0.4, 1),
          scrambleText: {
            text: gsap.utils.random(texts),
            chars: "!<>-_\\/[]{}—=+*^?#________",
            speed: 0.5,
          },
          onComplete: () => {
            cell.scrambling = false;
          },
        });
      });

      gsap.delayedCall(gsap.utils.random(0.3, 1.2), runScrambleLoop);
    };

    runScrambleLoop();

    // 🧹 Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(tick);
      cells.forEach((cell) => {
        gsap.killTweensOf(cell.el);
      });
    };
  }, [gridSize]);

  return (
    <div
      ref={containerRef}
      className="text-orange absolute w-screen h-screen z-0 pointer-events-none inset-0 grid grid-cols-3 grid-rows-6 xl:grid-cols-12 xl:grid-rows-6 items-center justify-center text-center"
    >
      {Array.from({ length: gridSize }).map((_, i) => (
        <div key={i} className="cell">
          GHM
        </div>
      ))}
    </div>
  );
}
