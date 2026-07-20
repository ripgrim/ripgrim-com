"use client";

import { useEffect, useState, type ReactNode } from "react";
import { bind, setEnabled } from "cuelume";
import { SOCIAL_LINKS, type SocialIcon } from "./constants";

const STORAGE_KEY = "sound-muted";
const iconClass =
  "transition-colors hover:text-[var(--text)] [&>svg]:h-[19px] [&>svg]:w-[19px]";

const ICONS: Record<SocialIcon, ReactNode> = {
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  github: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  ),
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  email: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="m3 6 9 6 9-6" />
    </svg>
  ),
};

// Wires up every data-cuelume-* attribute on the page once the DOM is hydrated,
// and restores the persisted mute preference before any sound can play.
export function Connect() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    let stored = false;
    try {
      stored = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {}
    setMuted(stored);
    setEnabled(!stored);
    bind();
  }, []);

  function toggleMute() {
    setMuted((prev) => {
      const next = !prev;
      setEnabled(!next);
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  return (
    <div className="flex items-center gap-4 text-[var(--text-tertiary)]">
      {SOCIAL_LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          {...(link.icon === "email"
            ? {}
            : { target: "_blank", rel: "noreferrer" })}
          aria-label={link.label}
          data-cuelume-hover=""
          data-cuelume-press=""
          className={iconClass}
        >
          {ICONS[link.icon]}
        </a>
      ))}
      <button
        type="button"
        onClick={toggleMute}
        data-cuelume-toggle=""
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
        aria-pressed={muted}
        data-clickable
        className={`${iconClass} cursor-none`}
      >
        {muted ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 5 6 9H2v6h4l5 4z" />
            <line x1="22" y1="9" x2="16" y2="15" />
            <line x1="16" y1="9" x2="22" y2="15" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M11 5 6 9H2v6h4l5 4z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M19 5a9 9 0 0 1 0 14" />
          </svg>
        )}
      </button>
    </div>
  );
}
