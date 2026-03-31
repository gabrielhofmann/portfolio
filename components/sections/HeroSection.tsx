import gsap from "gsap";
import Overlay from "../overlay/Overlay";
import { useEffect } from "react";
import { ScrambleTextPlugin, SplitText } from "gsap/all";
import HUD from "../HUD";

gsap.registerPlugin(ScrambleTextPlugin);
gsap.registerPlugin(SplitText);

export function HeroSection() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1100px)", () => {
      const tl = gsap.timeline();

      const words = "GABRIEL HOFMANN MARINHO".split(" ");

      const split = SplitText.create("#h1", {
        type: "words",
      });

      gsap.set(split.words, {
        textContent: "",
      });

      gsap.set("#webdev", {
        textContent: "",
      });

      tl.to(split.words, {
        scrambleText: {
          text: (i: number) => words[i],
          chars: "0123456789!@#$%&_+=<>",
          revealDelay: 0.5,
        } as any,
        stagger: 1,
        duration: 3,
        ease: "power2.out",
      }).to(
        "#webdev",

        {
          scrambleText: {
            text: "<> WEB DEVELOPER </>",
            chars: "0123456789!@#$%&_+=<>",
            revealDelay: 0.5,
          },
          duration: 2,
          ease: "power2.out",
        },
        "-=1.5",
      );

      return () => {
        split.revert();
      };
    });

    // 👇 mobile
    mm.add("(max-width: 1099px)", () => {
      const tl = gsap.timeline();

      const words = "GABRIEL HOFMANN MARINHO".split(" ");

      const split = SplitText.create("#h1", {
        type: "words",
      });

      gsap.set(split.words, {
        textContent: "",
      });

      tl.to(split.words, {
        scrambleText: {
          text: (i: number) => words[i],
          chars: "0123456789!@#$%&_+=<>",
        } as any,
        stagger: 1,
        duration: 3,
        delay: -1,
        ease: "power2.out",
      }).fromTo(
        "#webdev",
        {
          opacity: 0,
        },
        {
          scrambleText: {
            text: "<> WEB DEVELOPER </>",
            chars: "0123456789!@#$%&_+=<>",
            revealDelay: 0.5,
          },
          duration: 2,
          ease: "power2.out",
          opacity: 1,
        },
        "-=1",
      );

      return () => {
        split.revert();
      };
    });

    return () => {
      mm.revert(); // 👈 MUITO importante
    };
  }, []);

  return (
    <section className="relative h-screen w-screen grid grid-cols-12 grid-rows-6">
      <Overlay />

      <div className="col-start1 row-start-1 row-end-3 xl:row-end-4 xl:col-end-6 col-end-13 absolute top-0 z-10 h-full w-full bg-background"></div>

      <div
        id="headline"
        className="col-start1 row-start-1 row-end-3 xl:row-end-4 xl:col-end-6 col-end-13 absolute top-0 z-10 h-full w-full items-center justify-center text-center flex px-8 py-16 bg-orange text-background"
      >
        <h1
          id="h1"
          className="3xl:text-9xl lg:text-7xl 2xl:text-[90px] text-5xl m-0 lg:leading-[100px] 2xl:leading-[90px] font-black font-orbitron tracking-widest"
        >
          GABRIEL HOFMANN MARINHO
        </h1>
      </div>

      <div className="absolute w-full h-full col-start1 row-start-3 row-end-4 xl:row-start-4 xl:row-end-5 xl:col-end-6 col-end-13 bg-background"></div>

      <div
        id="webdev"
        className="absolute w-full h-full col-start1 row-start-3 row-end-4 xl:row-start-4 xl:row-end-5 xl:col-end-6 col-end-13 bg-background text-orange text-center items-center flex justify-center text-2xl xl:text-[50px] font-semibold font-grotesk border-b-8 border-orange border-r-8 "
      >
        {"<> WEB DEVELOPER </>"}
      </div>

      <div className="hidden xl:block absolute w-full h-full bg-background col-start-9 col-end-13 row-start-4 row-end-7"></div>

      <div className="hidden xl:block absolute w-full h-full bg-background col-start-9 col-end-13 row-start-4 row-end-7 border-t-8 border-l-8 border-orange">
        <HUD />
      </div>

      <div className="absolute col-start-1 lg:col-start-9 col-end-13 col-span-12 row-start-6 row-end-6 bg-background w-full h-full flex items-center justify-center px-8 2xl:px-16 border-t-8 border-l-8 border-orange p-0">
        <p className="text-[20px] text-orange font-medium tracking-widest xl:tracking-[0.3rem] flex items-center gap-4 font-orbitron">
          MADE IN BRAZIL
          <svg
            viewBox="0 0 1000 700"
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-auto shrink-0 overflow-visible rounded-[2px] shadow-lg mt-1 cursor-pointer select-none mb-1"
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
