"use client";

import { useEffect } from "react";

/**
 * Hidden easter-egg theme toggle: press "m" anywhere to flip light/dark.
 * No visible control. Defaults to the system theme (resolved by the boot
 * script in the layout head); the choice persists once toggled.
 *
 * The flip animates as a circular reveal expanding from the pointer (matching
 * Creed's toggle) via the View Transitions API, falling back to an instant
 * switch where that API isn't available.
 */
export function ThemeKey() {
  useEffect(() => {
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    function track(e: MouseEvent) {
      px = e.clientX;
      py = e.clientY;
    }
    window.addEventListener("mousemove", track);

    function apply(nextDark: boolean) {
      document.documentElement.classList.toggle("dark", nextDark);
      try {
        localStorage.setItem("theme", nextDark ? "dark" : "light");
      } catch {}
    }

    function onKey(e: KeyboardEvent) {
      if (e.key !== "m" && e.key !== "M") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)))
        return;

      const nextDark = !document.documentElement.classList.contains("dark");

      const start = (
        document as Document & {
          startViewTransition?: (cb: () => void) => { ready: Promise<void> };
        }
      ).startViewTransition?.bind(document);

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!start || reduce) {
        apply(nextDark);
        return;
      }

      const x = px;
      const y = py;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = start(() => apply(nextDark));
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 480,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousemove", track);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
