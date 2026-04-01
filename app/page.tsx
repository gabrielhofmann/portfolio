"use client";

import { HeroSection } from "@/components/sections/HeroSection";
import { useState } from "react";

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />

      {/* Próximas seções */}
      <section className="h-screen w-screen bg-orange flex items-center justify-center">
        <h2 className="text-5xl text-background">Segunda Seção</h2>
      </section>
      <section className="h-screen w-screen bg-background flex items-center justify-center">
        <h2 className="text-5xl text-orange">Segunda Seção</h2>
      </section>
    </main>
  );
}
