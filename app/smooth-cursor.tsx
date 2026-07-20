"use client";

import { useEffect, useRef } from "react";

/**
 * A smooth, physics-driven custom cursor.
 *
 * - Position follows the pointer with a critically-tuned spring
 *   (stiffness 400, damping 45, mass 1) integrated per animation frame.
 * - The arrow stays upright — no directional rotation or squash-stretch.
 *
 * No external animation library — just a hand-written spring + rAF.
 */
export function SmoothCursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip on touch / coarse-pointer devices — there's no cursor to replace.
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const STIFFNESS = 400;
    const DAMPING = 45;
    const MASS = 1;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let vx = 0;
    let vy = 0;
    let visible = false;
    let last = performance.now();
    let raf = 0;

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        visible = true;
        x = tx;
        y = ty;
        el!.style.opacity = "1";
      }
    }
    function onLeave() {
      el!.style.opacity = "0";
    }
    function onEnter() {
      if (visible) el!.style.opacity = "1";
    }
    function syncCursorMode(target: Element | null) {
      const isHand = Boolean(
        target?.closest("a, button, [data-clickable], [role='button']"),
      );
      el!.classList.toggle("is-hand", isHand);
    }
    function onPointerOver(e: PointerEvent) {
      syncCursorMode(e.target as Element | null);
    }
    function onPointerOut(e: PointerEvent) {
      const next = e.relatedTarget as Element | null;
      syncCursorMode(next);
    }

    function frame(now: number) {
      // Clamp dt so a backgrounded tab doesn't fling the spring.
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      // Fixed-timestep spring (semi-implicit Euler). Sub-stepping at a small,
      // dt-derived fixed h makes the motion identical across refresh rates and
      // perfectly stable at high stiffness — the key to a smooth follow.
      const FIXED = 1 / 360;
      const sub = Math.max(1, Math.ceil(dt / FIXED));
      const h = dt / sub;

      for (let i = 0; i < sub; i++) {
        const ax = (STIFFNESS * (tx - x) - DAMPING * vx) / MASS;
        const ay = (STIFFNESS * (ty - y) - DAMPING * vy) / MASS;
        vx += ax * h;
        vy += ay * h;
        x += vx * h;
        y += vy * h;
      }

      // Offset by the tip position (12.5,2.5 displayed) so the SVG tip sits on
      // the pointer and matches the CSS transform-origin.
      el!.style.transform = `translate3d(${x - 12.5}px, ${y - 2.5}px, 0)`;
      raf = requestAnimationFrame(frame);
    }

    document.documentElement.classList.add("has-smooth-cursor");
    window.addEventListener("mousemove", onMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(frame);

    return () => {
      document.documentElement.classList.remove("has-smooth-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="smooth-cursor" aria-hidden>
      {/* MagicUI arrow shape/size, with a thicker round-joined border and no
          drop shadow. The fill path is stroked directly; viewBox 50×54 displays
          at 25×27 (0.5×), so strokeWidth 4.5 renders the ~2.25px outline. Nose
          at (~12.5, 2.5) matches the transform-origin / hotspot. */}
      <svg
        className="cursor-arrow"
        xmlns="http://www.w3.org/2000/svg"
        width={25}
        height={27}
        viewBox="0 0 50 54"
        fill="none"
      >
        <path
          d="M42.6817 41.1495L27.5103 6.79925C26.7269 5.02557 24.2082 5.02558 23.3927 6.79925L7.59814 41.1495C6.75833 42.9759 8.52712 44.8902 10.4125 44.1954L24.3757 39.0496C24.8829 38.8627 25.4385 38.8627 25.9422 39.0496L39.8121 44.1954C41.6849 44.8902 43.4884 42.9759 42.6817 41.1495Z"
          fill="var(--cursor-fill)"
          stroke="var(--cursor-stroke)"
          strokeWidth={4.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="cursor-hand"
        xmlns="http://www.w3.org/2000/svg"
        width={27}
        height={27}
        viewBox="0 0 54 54"
        fill="none"
      >
        <path
          d="M20.5 31V10.5C20.5 6.5 23 4 26 4C29 4 31.5 6.5 31.5 10.5V22V15C31.5 11.5 34 9.5 37 9.5C40 9.5 42 12 42 15.5V24V18C42 14.5 44.5 12.5 47.5 12.5C50.5 12.5 51.5 15 51.5 18.5V33C51.5 45 43 52 32 52H28C21.5 52 17 48.5 13 44L4.5 34.5C1.5 31 2 27.5 4.5 25C7 22.5 10.5 23 13 25.5L20.5 33Z"
          fill="var(--cursor-fill)"
          stroke="var(--cursor-stroke)"
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
