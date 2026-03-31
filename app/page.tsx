"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { useState } from "react";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);

  function Menu() {
    return (
      <div
        className={`w-screen border-b-8 border-background bg-orange`}
      ></div>
    );
  }

  return (
    <main className="overflow-x-hidden">
      {showMenu && <Menu />}
      <HeroSection />
    </main>
  );
}
