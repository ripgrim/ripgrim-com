import { Copy } from "./interactive";
import { ActivityGraph } from "./activity-graph";
import { Connect } from "./connect";
import { PROFILE, PROJECTS, SECTIONS } from "./constants";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-medium tracking-tight text-[var(--text)]">
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-xl space-y-12 px-6 py-12 md:space-y-14 md:py-16">
      <section>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-medium tracking-tight">{PROFILE.name}</h1>
          <Connect />
        </div>
        <p className="mt-4 max-w-lg text-[17px] font-normal leading-7 text-[var(--text-secondary)]">
          <Copy segments={PROFILE.intro} />
        </p>
      </section>

      <section>
        <SectionTitle>{SECTIONS.projects}</SectionTitle>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <article
              key={project.cta.href}
              className="project-preview w-full overflow-visible"
            >
              <img
                src={project.image}
                alt={project.alt}
                width={1200}
                height={630}
                className="aspect-[40/21] w-full object-cover"
              />
              <div className="p-4">
                <p className="text-[15px] font-normal leading-6 text-[var(--text-secondary)]">
                  <Copy segments={project.description} />
                </p>
                <p className="mt-3 text-[13px] text-[var(--text-secondary)]">
                  Try it{" "}
                  <a
                    href={project.cta.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cuelume-hover="sparkle"
                    data-cuelume-press="success"
                    className="project-preview-cta"
                  >
                    {project.cta.label}
                  </a>
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>{SECTIONS.activity}</SectionTitle>
        <div className="mt-6">
          <ActivityGraph />
        </div>
      </section>
    </main>
  );
}
