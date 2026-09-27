/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts}'],
  theme: {
    extend: {
      colors: {
        // All mapped to CSS vars — respond to html.light class automatically
        bg:      'var(--bg)',
        bg2:     'var(--bg2)',
        bg3:     'var(--bg3)',
        border:  'var(--border)',
        txt:     'var(--txt)',
        muted:   'var(--muted)',
        accent:  'var(--accent)',
        accent2: 'var(--accent2)',
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", 'ui-monospace', 'monospace'],
      },
      maxWidth: { content: '760px' },
    },
  },
};
