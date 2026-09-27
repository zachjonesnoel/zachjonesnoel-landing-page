import Meta from "./meta";
import { ReactNode } from "react";
import Link from "next/link";
import useScroll from "@/lib/hooks/use-scroll";

export default function Layout({
  meta,
  children,
}: {
  meta?: {
    title?: string;
    description?: string;
    image?: string;
  };
  children: ReactNode;
}) {
  const scrolled = useScroll(50);

  return (
    <>
      <Meta {...meta} />

      {/* NAV */}
      <nav
        className={`fixed top-0 w-full z-30 transition-all font-mono ${
          scrolled
            ? "border-b border-border bg-bg/90 backdrop-blur-md"
            : "bg-bg/0"
        }`}
      >
        <div className="mx-auto max-w-content px-5 xl:px-0 flex h-14 items-center justify-between">
          <Link href="/" className="text-accent text-sm tracking-widest hover:opacity-80 transition-opacity">
            <span className="text-muted">~/</span>zachjonesnoel
          </Link>
          <div className="flex items-center gap-1">
            {[
              { label: "talks", href: "#talks" },
              { label: "writing", href: "#writing" },
              { label: "shows", href: "#shows" },
              { label: "speaking", href: "#speaking" },
              { label: "consult", href: "#consult" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-muted hover:text-text text-xs tracking-wider font-mono px-2.5 py-1.5 rounded transition-colors hover:bg-bg3"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="w-full min-h-screen">{children}</main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-bg py-8">
        <div className="mx-auto max-w-content px-5 xl:px-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-mono text-xs text-muted tracking-wider">
              Jones Zachariah Noel · zachjonesnoel
            </span>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
              {[
                { label: "twitter", href: "https://twitter.com/zachjonesnoel" },
                { label: "linkedin", href: "https://www.linkedin.com/in/jones-zachariah-noel-n" },
                { label: "github", href: "https://github.com/zachjonesnoel" },
                { label: "dev.to", href: "https://dev.to/zachjonesnoel" },
                { label: "instagram", href: "https://www.instagram.com/zachariah_jones_noel/" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-muted hover:text-accent transition-colors tracking-wider"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-xs text-muted/50 tracking-wider">
            built with next.js · tailwind · aws amplify
          </p>
        </div>
      </footer>
    </>
  );
}
