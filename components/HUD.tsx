"use client";

import { useEffect, useState } from "react";

export default function HUD() {
  const [time, setTime] = useState("");
  const [uptime, setUptime] = useState(0);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [input, setInput] = useState("IDLE");
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [fps, setFps] = useState(0);
  const [battery, setBattery] = useState<number | null>(null);

  const [pixelRatio, setPixelRatio] = useState(1);
  const [isOnline, setIsOnline] = useState(true);

  const [language, setLanguage] = useState("");
  const [os, setOs] = useState("");
  const [browser, setBrowser] = useState("");
  const [region, setRegion] = useState("");

  // ⏱️ relógio + uptime
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
      setUptime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 🖥️ viewport + pixel ratio
  useEffect(() => {
    const update = () => {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
      });
      setPixelRatio(window.devicePixelRatio);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 🖱️ mouse + idle
  useEffect(() => {
    let lastMove = Date.now();

    const handleMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX, y: e.clientY });
      lastMove = Date.now();
      setInput("ACTIVE");
    };

    window.addEventListener("mousemove", handleMove);

    const idleCheck = setInterval(() => {
      if (Date.now() - lastMove > 2000) {
        setInput("IDLE");
      }
    }, 500);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      clearInterval(idleCheck);
    };
  }, []);

  // 🎯 FPS (corrigido)
  useEffect(() => {
    let frame = 0;
    let lastTime = performance.now();

    const loop = () => {
      frame++;
      const now = performance.now();

      if (now >= lastTime + 1000) {
        setFps(frame);
        frame = 0;
        lastTime = now;
      }

      requestAnimationFrame(loop);
    };

    loop();
  }, []);

  // 🔋 bateria
  useEffect(() => {
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((bat: any) => {
        setBattery(Math.round(bat.level * 100));
      });
    }
  }, []);

  // 🌐 ambiente do usuário
  useEffect(() => {
    setLanguage(navigator.language.toUpperCase());
    setIsOnline(navigator.onLine);

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setRegion(tz);

    const ua = navigator.userAgent;

    if (ua.includes("Win")) setOs("WINDOWS");
    else if (ua.includes("Mac")) setOs("MAC");
    else if (ua.includes("Linux")) setOs("LINUX");
    else if (ua.includes("Android")) setOs("ANDROID");
    else if (ua.includes("like Mac")) setOs("IOS");
    else setOs("UNKNOWN");

    if (ua.includes("Firefox")) setBrowser("FIREFOX");
    else if (ua.includes("Edg")) setBrowser("EDGE");
    else if (ua.includes("Chrome")) setBrowser("CHROME");
    else if (ua.includes("Safari")) setBrowser("SAFARI");
    else setBrowser("UNKNOWN");
  }, []);

  const formatUptime = () => {
    const m = Math.floor(uptime / 60);
    const s = uptime % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full text-orange font-mono text-xs xl:text-sm p-6 flex flex-col justify-between gap-4">
      <div>
        <p>{"> SYSTEM ONLINE"}</p>
      </div>

      <div className="flex w-full h-full gap-6">
        {/* LEFT */}
        <div className="space-y-4">
          <div>
            <p>AUTHOR: G.H.M</p>
            <p>INSTANCE: PORTFOLIO_V1</p>
          </div>

          <div>
            <p>
              DEVICE: {viewport.w > 768 ? "DESKTOP" : "MOBILE"}
            </p>
            <p>
              VIEWPORT: {viewport.w} x {viewport.h}
            </p>
            <p>PIXEL_RATIO: {pixelRatio}</p>
            <p>FPS: {fps}</p>
          </div>

          <div>
            <p>MOUSE_X: {mouse.x}</p>
            <p>MOUSE_Y: {mouse.y}</p>
            <p>INPUT: {input}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <div>
            <p>
              CONNECTION: {isOnline ? "ONLINE" : "OFFLINE"}
            </p>
            <p>TIME: {time}</p>
            <p>UPTIME: {formatUptime()}</p>
          </div>

          <div>
            {battery !== null && (
              <p>BATTERY: {battery}%</p>
            )}
          </div>

          <div>
            <p>LANG: {language}</p>
            <p>OS: {os}</p>
            <p>BROWSER: {browser}</p>
            <p>REGION: {region}</p>
          </div>
        </div>
      </div>
    </div>
  );
}