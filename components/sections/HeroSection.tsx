"use client";

import gsap from "gsap";
import Overlay from "../overlay/Overlay";
import { useLayoutEffect, useRef } from "react";
import { ScrambleTextPlugin, ScrollTrigger, SplitText } from "gsap/all";
import HUD from "../HUD";

gsap.registerPlugin(ScrambleTextPlugin, SplitText, ScrollTrigger);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const webdevRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current || !headlineRef.current || !webdevRef.current)
      return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current!;
      const headline = headlineRef.current!;
      const webdev = webdevRef.current!;
      const h1 = headline.querySelector("#h1") as HTMLElement | null;

      if (!h1) return;

      const introTl = gsap.timeline();
      const words = "GABRIEL HOFMANN MARINHO".split(" ");

      const split = SplitText.create(h1, {
        type: "words",
      });

      const [gabrielWord, hofmannWord, marinhoWord] =
        split.words as HTMLElement[];

      gsap.set(split.words, {
        textContent: "",
        display: "inline-block",
        willChange: "transform, opacity",
      });

      gsap.set(webdev, {
        textContent: "",
      });

      introTl
        .to(split.words, {
          scrambleText: {
            text: (i: number) => words[i],
            chars: "0123456789!@#$%&_+=<>",
            revealDelay: 0.5,
          } as any,
          stagger: 1,
          duration: 3,
          ease: "power2.out",
        })
        .to(
          webdev,
          {
            scrambleText: {
              text: "WEB DEVELOPER",
              chars: "0123456789!@#$%&_+=<>",
              revealDelay: 0.5,
            } as any,
            duration: 2,
            ease: "power2.out",
          },
          "-=1.5",
        );

      gsap.set(headline, {
        transformOrigin: "top left",
        willChange: "transform",
        zIndex: 30,
      });

      const getUniformScale = () => {
        const rect = headline.getBoundingClientRect();

        return Math.max(
          window.innerWidth / rect.width,
          window.innerHeight / rect.height,
        );
      };

      const getWordTravel = () => {
        const rect = headline.getBoundingClientRect();
        return rect.width * 0.333;
      };

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          //   end: "=100%",
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          // markers: true,
        },
      });

      const applyScrollAnimation = () => {
        const scale = getUniformScale() * 1.04;
        const travel = getWordTravel();

        scrollTl.clear();

        gsap.set([gabrielWord, hofmannWord, marinhoWord], {
          x: 0,
          opacity: 1,
        });

        scrollTl
          .to(
            headline,
            {
              scale,
              ease: "none",
            },
            0,
          )
          .to(
            gabrielWord,
            {
              x: travel,
              y: -travel - 50,
              scale: 3,
              ease: "none",
            },
            0,
          )
          .to(
            hofmannWord,
            {
            //   x: -travel,
              scale: 1,
              ease: "none",
            },
            0,
          )
          .to(
            marinhoWord,
            {
              x: travel,
              y: +travel + 50,
              scale: 3,
              ease: "none",
            },
            0,
          )
          .to(
            webdev,
            {
              yPercent: 20,
              opacity: 0,
              ease: "none",
            },
            0,
          );
      };

      applyScrollAnimation();

      ScrollTrigger.addEventListener("refreshInit", applyScrollAnimation);
      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.removeEventListener("refreshInit", applyScrollAnimation);
        split.revert();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-screen grid grid-cols-12 grid-rows-6 overflow-hidden"
    >
      <Overlay />

      <div className="col-start-1 row-start-1 row-end-3 xl:row-end-4 xl:col-end-6 col-end-13 absolute top-0 z-10 h-full w-full bg-background" />

      <div
        ref={headlineRef}
        id="headline"
        className="col-start-1 row-start-1 row-end-3 xl:row-end-4 xl:col-end-6 col-end-13 absolute top-0 left-0 z-20 h-full w-full flex items-center justify-start px-8 py-16 text-center bg-orange text-background"
      >
        <h1
          id="h1"
          className="m-0 text-7xl lg:text-[10rem] leading-[60px] lg:leading-32 tracking-light font-black font-bebas text-shadow-sm text-start"
        >
          GABRIEL<br/>HOFMANN<br/>MARINHO
        </h1>
      </div>

      <div className="absolute w-full h-full col-start-1 row-start-3 row-end-4 xl:row-start-4 xl:row-end-5 xl:col-end-6 col-end-13 bg-background" />

      <div
        ref={webdevRef}
        id="webdev"
        className="absolute w-full h-full col-start-1 row-start-3 row-end-4 xl:row-start-4 xl:row-end-5 xl:col-end-6 col-end-13 bg-background text-orange text-center items-center flex justify-center text-2xl xl:text-[50px] font-semibold font-bebas border-b-8 border-r-8 border-orange z-10"
      >
        {"WEB DEVELOPER"}
      </div>

      <div className="hidden xl:block absolute w-full h-full bg-background col-start-9 col-end-13 row-start-3 row-end-7" />

      <div className="hidden xl:block absolute w-full h-full bg-background col-start-9 col-end-13 row-start-3 row-end-7 border-t-8 border-l-8 border-orange">
        <HUD />
      </div>

      <div className="hidden xl:flex absolute col-start-1 lg:col-start-9 col-end-13 col-span-12 row-start-6 row-end-6 bg-orange w-full h-full items-center justify-center px-8 2xl:px-16 border-t-8 border-l-8 border-orange p-0">
        <p className="text-3xl text-background font-black flex items-center gap-4 font-bebas">
          MADE IN BRAZIL
          <svg
            viewBox="0 0 1000 700"
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-auto shrink-0 overflow-visible rounded-[2px] shadow-lg mb-1 cursor-pointer select-none"
            aria-label="Bandeira do Brasil"
            role="button"
          >
            <rect width="1000" height="700" fill="#009B3A" />
            <polygon points="500,110 860,350 500,590 140,350" fill="#FFDF00" />
            <circle cx="500" cy="350" r="150" fill="#002776" />
            <path
              d="M 355 325 Q 500 255 645 325"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="36"
              strokeLinecap="round"
            />
          </svg>
        </p>
      </div>
    </section>
  );
}
