"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

export default function CircleBackground({source} : {source: "dashboard" | "landing"}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initUnicorn = () => {
      if (!window.UnicornStudio) return;
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    };

    // 1️⃣ Load script only once
    if (!window.UnicornStudio?.isInitialized) {
      const existingScript = document.querySelector(
        'script[src*="unicornstudio"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
        script.async = true;
        script.onload = initUnicorn;
        document.body.appendChild(script);
      }
    }

    // 2️⃣ Reflow on resize (debounced)
    const handleResize = () => {
      if (!window.UnicornStudio?.isInitialized) return;

      if (resizeTimeout) clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        window.UnicornStudio?.init();
      }, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div className={cn("-z-10", source === "landing" ? "fixed top-0 left-0 w-full h-full" : "absolute inset-0")}>
      <div
        data-us-project="bKN5upvoulAmWvInmHza"
        className="
          absolute inset-0 -z-10
          invert hue-rotate-180
          dark:invert-0 dark:hue-rotate-0
        "
      />
    </div>
  );
}
