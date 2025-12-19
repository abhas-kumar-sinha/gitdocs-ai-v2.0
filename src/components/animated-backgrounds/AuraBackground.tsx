"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

let resizeTimeout: NodeJS.Timeout | null = null;

export default function AuraBackground({source} : {source: "dashboard" | "landing"}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadAndInit = () => {
      if (!window.UnicornStudio) return;

      // Re-init safely (acts like resize/reflow)
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

        script.onload = loadAndInit;
        document.body.appendChild(script);
      }
    }

    // 2️⃣ Handle resize (throttled)
    const handleResize = () => {
      if (!window.UnicornStudio?.isInitialized) return;

      if (resizeTimeout) clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        window.UnicornStudio?.init();
      }, 200); // adjust if needed
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div className={cn("-z-10 bg-white dark:bg-black", source === "landing" ? "fixed top-0 left-0 w-full h-full" : "absolute inset-0")}>
      <div
        data-us-project="tPmIIl0vKqHO9yqmtge2"
        className="
          absolute inset-0 -z-10
          invert dark:invert-0 ms-3 md:ms-16
        "
      />
    </div>
  );
}
