/**
 * Single source of truth for all site copy, links, and GitHub config.
 * Keep this file free of JSX / "use client" so it can be imported from both
 * server and client components.
 */

// A run of body copy: plain strings, or a highlighted keyword with a tooltip.
export type CopySegment = string | { keyword: string; tooltip: string };

export const SITE = {
  title: "ripgrim",
  url: "https://ripgrim.com",
  siteName: "ripgrim",
  userAgent: "ripgrim.com",
} as const;

// Born December 2004. Age = current year - 2004, minus one if December hasn't
// arrived yet this year. Computed at render so it stays correct over time.
const BIRTH_YEAR = 2004;
const BIRTH_MONTH = 12; // December (1-indexed)

function computeAge(now = new Date()) {
  const hadBirthday = now.getMonth() + 1 >= BIRTH_MONTH;
  return now.getFullYear() - BIRTH_YEAR - (hadBirthday ? 0 : 1);
}

const age = computeAge();

export const PROFILE = {
  name: "grim",
  intro: [
    "from ",
    { keyword: "Oregon", tooltip: "trees, rain, no sales tax" },
    ", ",
    { keyword: String(age), tooltip: age > 21 ? "old" : "9 + 10" },
    ", and way too into ",
    { keyword: "open source", tooltip: "giving the work away for free" },
    ". i mostly build things i'd use anyway and just put them out there.",
  ] satisfies CopySegment[],
} as const;

export const SECTIONS = {
  projects: "Projects",
  activity: "Activity",
} as const;

export type Project = {
  image: string;
  alt: string;
  description: CopySegment[];
  cta: { label: string; href: string };
};

export const PROJECTS: Project[] = [
  {
    image: "/images/og.jpg",
    alt: "tripwire, a firewall for your repo",
    description: [
      "a ",
      { keyword: "firewall", tooltip: "blocks it, passes it, or flags it" },
      " for your repo. it checks every ",
      { keyword: "contribution", tooltip: "before it ever hits your inbox" },
      " so you keep the good stuff and drop the rest.",
    ],
    cta: { label: "here", href: "https://tripwire.sh" },
  }
];

export type SocialIcon = "x" | "github" | "instagram" | "email";

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "X", href: "https://x.com/grimcodes", icon: "x" },
  { label: "GitHub", href: "https://github.com/ripgrim", icon: "github" },
];

export const GITHUB = {
  username: "ripgrim",
  // Repos that get the accent colour in the contribution graph.
  highlightRepos: ["v2"] as string[],
} as const;
