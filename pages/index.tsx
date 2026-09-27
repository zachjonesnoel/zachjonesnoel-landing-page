import { useEffect, useReducer, useRef } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout';
import { useTypewriter } from '@/lib/hooks/use-typewriter';

// ─── animation variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0,  transition: { type: 'spring', damping: 20, stiffness: 120 } },
};

const stagger = (delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren } },
});

// ─── data ─────────────────────────────────────────────────────────────────────

const TALKS = [
  { conf: 'AWS Community Day India 2024', title: 'Observability on Serverless — doing more with less noise', date: '2024-10' },
  { conf: 'AWS re:Skill',                 title: 'Serverless-first developer experience at scale',           date: '2024-08' },
  { conf: 'AWS UG Bengaluru',             title: 'Event-driven patterns you might be missing',               date: '2024-06' },
  { conf: 'AWS Summit India',             title: 'From code to community: the DevRel playbook',              date: '2024-05' },
];

const WRITING = [
  { type: 'newsletter', label: 'newsletter', title: 'Issue #28 — Lambda power tuning and what the numbers actually mean', date: '2024-09' },
  { type: 'blog',       label: 'blog',       title: 'Why developer experience is a product problem, not a docs problem',  date: '2024-08' },
  { type: 'blog',       label: 'blog',       title: 'AWS Lambda cold starts in 2024: what actually matters',              date: '2024-07' },
  { type: 'newsletter', label: 'newsletter', title: 'Issue #25 — Event-driven architectures beyond SQS + Lambda',         date: '2024-06' },
];

const TOPIC_TAGS = [
  'Serverless & AWS',
  'Developer Experience',
  'Observability',
  'DevRel craft',
  'Community building',
  'AWS Architecture',
];

const CONSULT_AREAS = [
  'DevRel program design',
  'Developer experience audit',
  'Technical content strategy',
  'Community strategy',
  'Serverless architecture review',
];

// ─── typewriter hero sequence ─────────────────────────────────────────────────

const PROMPT_LINE   = '~/zachjonesnoel $ whoami';
const HEADLINE_LINE = "Hi, I'm Jones.\nI bridge developers\nand great products.";

type HeroState = 'prompt' | 'pause' | 'headline' | 'done';

function useHeroSequence(reducedMotion: boolean) {
  const [phase, setPhase] = useReducer(
    (_: HeroState, next: HeroState) => next,
    reducedMotion ? 'done' : 'prompt'
  );

  const prompt   = useTypewriter(PROMPT_LINE,   { speed: 40, instant: reducedMotion || phase === 'done' });
  const headline = useTypewriter(HEADLINE_LINE, { speed: 35, delay: 0, instant: reducedMotion || phase === 'done' });

  useEffect(() => {
    if (reducedMotion) return;
    if (phase === 'prompt' && prompt.done) {
      const t = setTimeout(() => setPhase('pause'), 320);
      return () => clearTimeout(t);
    }
    if (phase === 'pause') {
      const t = setTimeout(() => setPhase('headline'), 200);
      return () => clearTimeout(t);
    }
    if (phase === 'headline' && headline.done) {
      setPhase('done');
    }
  }, [phase, prompt.done, headline.done, reducedMotion]);

  return { phase, promptText: prompt.displayed, headlineText: headline.displayed };
}

// ─── components ───────────────────────────────────────────────────────────────

function Tag({ children, amber }: { children: React.ReactNode; amber?: boolean }) {
  return (
    <span
      className={`font-mono text-[11px] tracking-wider border rounded px-2 py-0.5 ${
        amber
          ? 'text-accent2 border-amber-500/25'
          : 'text-muted border-border'
      }`}
    >
      {children}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted">
      {children}
    </span>
  );
}

function SectionLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="font-mono text-[11px] text-muted hover:text-accent transition-colors tracking-wider">
      {children}
    </a>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const prefersReduced = useRef(false);
  useEffect(() => {
    prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const { phase, promptText, headlineText } = useHeroSequence(prefersReduced.current);

  const showPrompt   = phase !== 'prompt' || promptText.length > 0;
  const showHeadline = phase === 'headline' || phase === 'done';
  const showBio      = phase === 'done';

  // split headline on newlines for rendering
  const headlineLines = headlineText.split('\n');

  return (
    <Layout>
      <div className="mx-auto max-w-content px-5 xl:px-0">

        {/* ── HERO ── */}
        <section className="pt-32 pb-16 border-b border-border">
          {/* prompt line */}
          {showPrompt && (
            <p className="font-mono text-xs text-muted mb-4 tracking-wider">
              {promptText}
              {phase === 'prompt' && <span className="cursor" />}
            </p>
          )}

          {/* headline */}
          {showHeadline && (
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6" style={{ lineHeight: 1.15 }}>
              {headlineLines.map((line, i) => (
                <span key={i} className="block">
                  {i === 1 ? (
                    <>
                      {'I bridge '}
                      <span className="text-accent">{
                        line.startsWith('I bridge ') ? line.slice('I bridge '.length) : ''
                      }</span>
                    </>
                  ) : line}
                </span>
              ))}
              {phase === 'headline' && <span className="cursor" />}
            </h1>
          )}

          {/* bio + tags + links — appear after typing done */}
          <motion.div
            initial="hidden"
            animate={showBio ? 'show' : 'hidden'}
            variants={stagger(0)}
          >
            <motion.p
              variants={fadeUp}
              className="text-base text-text/70 max-w-lg leading-relaxed mb-6"
            >
              Started as a full-stack engineer. Moved into solutions engineering.
              Now doing DevRel at{' '}
              <a href="https://www.newrelic.com/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                New Relic
              </a>{' '}
              — because the best thing I can do for developers is make their experience with
              technology genuinely better.{' '}
              <a href="https://aws.amazon.com/developer/community/heroes/jones-zachariah-noel/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                AWS Serverless Hero
              </a>
              . Co-organiser of AWS UG Bengaluru. Builder of communities and products developers
              actually want to use.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-6">
              {['AWS Serverless Hero', 'Developer Experience', 'Serverless', 'Developer Relations', 'New Relic', 'Technical Writing', 'Community Builder'].map((t) => (
                <Tag key={t} amber={t === 'AWS Serverless Hero'}>{t}</Tag>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
              {[
                { label: 'twitter',   href: 'https://twitter.com/zachjonesnoel' },
                { label: 'linkedin',  href: 'https://www.linkedin.com/in/jones-zachariah-noel-n' },
                { label: 'github',    href: 'https://github.com/zachjonesnoel' },
                { label: 'dev.to',    href: 'https://dev.to/zachjonesnoel' },
                { label: 'newsletter', href: 'https://www.theserverlessterminal.com/' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-muted hover:text-accent border border-border hover:border-accent/30 hover:bg-accent/5 px-3 py-1.5 rounded transition-all tracking-wider"
                >
                  {s.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* ── TALKS ── */}
        <motion.section
          id="talks"
          className="py-12 border-b border-border"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger(0.1)}
        >
          <motion.div variants={fadeUp} className="flex justify-between items-center mb-6">
            <SectionTitle>Latest talks</SectionTitle>
            <SectionLink href="https://www.youtube.com/@thezacsshowtalkingaws">all talks →</SectionLink>
          </motion.div>
          <div className="flex flex-col">
            {TALKS.map((t, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="grid grid-cols-[1fr_auto] gap-4 items-start py-3.5 border-t border-border first:border-t-0 first:pt-0 group"
              >
                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase text-muted mb-1">{t.conf}</p>
                  <p className="text-sm text-text group-hover:text-accent transition-colors leading-snug">{t.title}</p>
                </div>
                <span className="font-mono text-[11px] text-muted whitespace-nowrap">{t.date}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── WRITING ── */}
        <motion.section
          id="writing"
          className="py-12 border-b border-border"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger(0.1)}
        >
          <motion.div variants={fadeUp} className="flex justify-between items-center mb-6">
            <SectionTitle>Recent writing</SectionTitle>
            <SectionLink href="https://blog.theserverlessterminal.com/">all writing →</SectionLink>
          </motion.div>
          <div className="flex flex-col">
            {WRITING.map((w, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="grid grid-cols-[auto_1fr_auto] gap-3 items-start py-3 border-t border-border first:border-t-0 first:pt-0 group"
              >
                <span
                  className={`font-mono text-[9px] tracking-widest uppercase mt-0.5 px-1.5 py-0.5 rounded-sm ${
                    w.type === 'newsletter'
                      ? 'bg-accent2 text-black'
                      : 'bg-accent text-black'
                  }`}
                >
                  {w.label}
                </span>
                <span className="text-sm text-text group-hover:text-accent transition-colors leading-snug">{w.title}</span>
                <span className="font-mono text-[11px] text-muted whitespace-nowrap">{w.date}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── SHOWS ── */}
        <motion.section
          id="shows"
          className="py-12 border-b border-border"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger(0.1)}
        >
          <motion.div variants={fadeUp} className="flex justify-between items-center mb-6">
            <SectionTitle>Shows &amp; community</SectionTitle>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                label:  '// podcast · newsletter',
                name:   'The Serverless Terminal',
                desc:   'Serverless patterns, AWS deep dives, and the people shipping production systems at scale.',
                href:   'https://www.theserverlessterminal.com/',
                cta:    '→ subscribe',
              },
              {
                label:  '// live show',
                name:   "The Zacs' Show",
                desc:   'Live conversations on DevRel, developer tools, and community building — with Arshad Zackeriya.',
                href:   'https://www.youtube.com/@thezacsshowtalkingaws',
                cta:    '→ watch',
              },
            ].map((show) => (
              <motion.a
                key={show.name}
                href={show.href}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                className="border border-border rounded-md p-5 bg-bg2 hover:border-accent/30 transition-colors block"
              >
                <p className="font-mono text-[10px] tracking-widest text-accent mb-2">{show.label}</p>
                <p className="text-sm font-semibold mb-2">{show.name}</p>
                <p className="text-xs text-muted leading-relaxed mb-4">{show.desc}</p>
                <span className="font-mono text-[11px] text-muted border border-border px-2 py-1 rounded hover:text-accent transition-colors tracking-wider">
                  {show.cta}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.section>

        {/* ── SPEAKING ── */}
        <motion.section
          id="speaking"
          className="py-12 border-b border-border"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger(0.1)}
        >
          <motion.div variants={fadeUp} className="flex justify-between items-center mb-4">
            <SectionTitle>Speaking</SectionTitle>
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm text-text/60 max-w-lg leading-relaxed mb-5">
            I talk about serverless architecture, developer experience, observability, and the craft of DevRel.
            Available for conferences, meetups, podcasts, and panels.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            {TOPIC_TAGS.map((t) => (
              <span key={t} className="font-mono text-xs text-muted border border-border px-3 py-1.5 rounded tracking-wider">
                {t}
              </span>
            ))}
          </motion.div>
        </motion.section>

        {/* ── CONSULT ── */}
        <motion.section
          id="consult"
          className="py-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={stagger(0.1)}
        >
          <motion.div
            variants={fadeUp}
            className="border border-amber-500/20 rounded-lg p-7 bg-amber-500/[0.02]"
          >
            <p className="font-mono text-[10px] tracking-widest uppercase text-accent2 mb-3">
              {'// available for consultations'}
            </p>
            <h2 className="text-xl font-semibold mb-3">Work with me</h2>
            <p className="text-sm text-text/60 leading-relaxed max-w-lg mb-5">
              I help developer-focused companies build better DevRel programs, sharpen their
              developer experience, and create content and community strategies that actually move
              the needle. Former engineer-turned-DevRel — I understand both sides of the table.
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {CONSULT_AREAS.map((a) => (
                <Tag key={a} amber>{a}</Tag>
              ))}
            </div>
            <a
              href="mailto:hello@zachjonesnoel.com"
              className="inline-block bg-accent2 text-black font-mono text-xs font-semibold tracking-wider px-5 py-2.5 rounded hover:opacity-90 transition-opacity"
            >
              → get in touch
            </a>
          </motion.div>
        </motion.section>

      </div>
    </Layout>
  );
}
