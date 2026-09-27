/* zachjonesnoel.com — terminal engine v2.0.0 */
(function () {
  'use strict';

  // ── data ──────────────────────────────────────────────────────────────────
  const raw  = document.getElementById('terminal-data');
  const DATA = raw ? JSON.parse(raw.textContent || '{}') : {};
  const { profile = {}, talks = [], writing = [] } = DATA;

  // ── DOM ───────────────────────────────────────────────────────────────────
  const output = document.getElementById('terminal-output');
  const input  = document.getElementById('terminal-input');
  const hint   = document.getElementById('tab-hint');
  if (!output || !input) return;

  // ── state ─────────────────────────────────────────────────────────────────
  const cmdHistory = [];
  let   histIdx    = -1;
  const COMMANDS   = [
    'help', 'whoami', 'talks', 'writing', 'shows', 'consult', 'map', 'clear', 'open',
  ];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── helpers ───────────────────────────────────────────────────────────────
  function sleep(ms) {
    return reduced ? Promise.resolve() : new Promise(r => setTimeout(r, ms));
  }

  function appendLine(html, cls) {
    const row = document.createElement('div');
    row.className = 'leading-relaxed whitespace-pre-wrap break-all ' + (cls || '');
    row.innerHTML = html;
    output.appendChild(row);
    output.scrollTop = output.scrollHeight;
    return row;
  }

  function text(str, cls)  { return appendLine(esc(str), cls); }
  function blank()          { appendLine(''); }
  function esc(s)           { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  async function stream(lines, cls, ms) {
    const delay = ms ?? 20;
    for (const l of lines) {
      text(l, cls);
      await sleep(delay);
    }
  }

  function echoCmd(raw) {
    const row = document.createElement('div');
    row.className = 'flex gap-2 leading-relaxed';
    row.innerHTML = `<span style="color:var(--accent);user-select:none">$</span><span style="color:var(--txt)">${esc(raw)}</span>`;
    output.appendChild(row);
    output.scrollTop = output.scrollHeight;
  }

  // ── ASCII world map ────────────────────────────────────────────────────────
  // Equirectangular projection onto a 72×22 char grid
  function buildMap(locations) {
    const W = 72, H = 22;
    const grid = Array.from({ length: H }, () => Array(W).fill('\u00b7'));

    // Simplified land outline segments [row, colStart, colEnd]
    const LAND_SEGS = [
      // North America
      [2,4,9],[3,4,10],[4,5,11],[5,6,11],[6,7,12],[7,9,12],
      // Central America / Caribbean
      [8,9,13],[9,10,13],
      // South America
      [9,11,14],[10,10,14],[11,10,14],[12,10,14],[13,11,14],[14,12,14],[15,12,13],
      // Europe
      [2,32,36],[3,32,37],[4,33,38],[5,33,38],
      // Africa
      [5,33,37],[6,33,37],[7,33,37],[8,33,37],[9,33,37],[10,33,36],[11,34,36],[12,34,36],[13,35,36],
      // Middle East
      [4,38,42],[5,38,44],[6,39,44],
      // Central Asia
      [3,38,56],[4,38,57],[5,38,56],[6,38,55],[7,42,52],
      // India
      [6,46,48],[7,46,49],[8,46,49],[9,47,49],[10,47,48],
      // SE Asia
      [8,50,56],[9,50,57],[10,51,55],
      // East Asia / China / Japan
      [3,50,60],[4,50,62],[5,50,62],[6,50,60],[7,50,58],
      // Australia
      [12,55,62],[13,54,63],[14,55,63],[15,56,62],[16,57,61],
    ];

    for (const [row, c0, c1] of LAND_SEGS) {
      for (let c = c0; c <= c1; c++) {
        if (grid[row] && grid[row][c] !== undefined) grid[row][c] = '\u2591';
      }
    }

    // Plot markers
    const placed = [];
    const seen = new Set();
    for (const loc of locations) {
      const key = `${loc.lat},${loc.lng}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const col = Math.round((loc.lng + 180) / 360 * (W - 1));
      const row = Math.round((90  - loc.lat) / 180 * (H - 1));
      if (row >= 0 && row < H && col >= 0 && col < W) {
        grid[row][col] = '*';
        placed.push({ col, row, city: loc.city, country: loc.country });
      }
    }

    const mapLines = grid.map(r => '  ' + r.join(''));
    return { mapLines, placed };
  }

  // ── command table ──────────────────────────────────────────────────────────
  const HANDLERS = {

    help: async () => {
      blank();
      const rows = [
        ['help',             'show this help'],
        ['whoami',           'who is Jones?'],
        ['talks',            'recent conference talks'],
        ['talks --upcoming', 'upcoming only'],
        ['talks --all',      'full list'],
        ['writing',          'recent posts & newsletters'],
        ['writing --type X', 'filter: blog | newsletter | linkedin'],
        ['shows',            'The Serverless Terminal & The Zacs\' Show'],
        ['consult',          'consultation areas + contact'],
        ['map',              'ASCII world map of talk locations'],
        ['open <name>',      'open: twitter | linkedin | github | newsletter | calendly'],
        ['clear',            'clear terminal'],
      ];
      const maxCmd = Math.max(...rows.map(r => r[0].length));
      await stream(['COMMANDS', '\u2500'.repeat(maxCmd + 22)], 'color-muted', 0);
      for (const [cmd, desc] of rows) {
        appendLine(
          `  <span style="color:var(--accent)">${esc(cmd.padEnd(maxCmd + 2))}</span>` +
          `<span style="color:var(--muted)">${esc(desc)}</span>`,
          ''
        );
        await sleep(16);
      }
      await stream(['\u2500'.repeat(maxCmd + 22)], 'color-muted', 0);
      blank();
    },

    whoami: async () => {
      blank();
      await stream([
        `  ${profile.name}  (@${profile.handle})`,
        `  ${profile.title} \u00b7 ${profile.employer}`,
        '',
        `  ${profile.bio}`,
        '',
        '  LINKS',
      ], '', 22);
      for (const [k, v] of Object.entries(profile.socials || {})) {
        appendLine(
          `  <span style="color:var(--muted)">${esc(k.padEnd(12))}</span>` +
          `<span style="color:var(--accent)">${esc(v)}</span>`,
          ''
        );
        await sleep(18);
      }
      blank();
    },

    talks: async (args) => {
      const upcomingOnly = args.includes('--upcoming');
      const showAll      = args.includes('--all');
      let   list         = [...talks];
      if (upcomingOnly) list = list.filter(t => t.upcoming);
      if (!showAll && !upcomingOnly) list = list.slice(0, 5);

      blank();
      if (!list.length) {
        await stream(['  no talks found.'], '', 0);
        blank();
        return;
      }

      const header = '  DATE      CONFERENCE                         TITLE';
      const rule   = '  ' + '\u2500'.repeat(header.length - 2);
      await stream([header, rule], 'color-muted', 0);

      for (const t of list) {
        const conf  = t.conference.substring(0, 34).padEnd(34);
        const title = t.title.substring(0, 44);
        const col   = t.upcoming ? 'var(--accent2)' : 'var(--txt)';
        appendLine(
          `<span style="color:var(--muted)">  ${esc(t.date)}  </span>` +
          `<span style="color:${col}">${esc(conf)}  ${esc(title)}</span>` +
          (t.slides ? ` <span style="color:var(--accent)">[slides]</span>` : '') +
          (t.video  ? ` <span style="color:var(--accent)">[video]</span>`  : ''),
          ''
        );
        await sleep(25);
      }

      if (!showAll && !upcomingOnly && talks.length > 5) {
        blank();
        text(`  \u2026 and ${talks.length - 5} more. Run 'talks --all' to see everything.`, 'color-muted');
      }
      blank();
    },

    writing: async (args) => {
      let list = [...writing];
      const typeIdx = args.indexOf('--type');
      if (typeIdx !== -1 && args[typeIdx + 1]) {
        list = list.filter(w => w.type === args[typeIdx + 1].toLowerCase());
      }

      blank();
      if (!list.length) {
        await stream(['  no writing found for that filter.'], '', 0);
        blank();
        return;
      }

      const TYPE_COLOR = {
        blog:       'var(--accent)',
        newsletter: 'var(--accent2)',
        linkedin:   '#60a5fa',
      };

      await stream(['  DATE      TYPE          TITLE', '  ' + '\u2500'.repeat(60)], 'color-muted', 0);

      for (const w of list) {
        const typeStr = w.type.padEnd(13);
        const title   = w.title.substring(0, 50);
        const tc      = TYPE_COLOR[w.type] || 'var(--txt)';
        appendLine(
          `<span style="color:var(--muted)">  ${esc(w.date)}  </span>` +
          `<span style="color:${tc}">${esc(typeStr)}</span>` +
          `<span style="color:var(--txt)">  ${esc(title)}</span>`,
          ''
        );
        await sleep(25);
      }
      blank();
    },

    shows: async () => {
      blank();
      for (const s of (profile.shows || [])) {
        await stream([
          `  \u2500\u2500 ${s.name}`,
          `     ${s.description}`,
        ], '', 20);
        appendLine(
          `     <span style="color:var(--accent)">${esc(s.url)}</span>`,
          ''
        );
        blank();
        await sleep(30);
      }
    },

    consult: async () => {
      blank();
      await stream([
        '  AVAILABLE FOR CONSULTATIONS',
        '  ' + '\u2500'.repeat(48),
        '  I help developer-focused companies build better DevRel',
        '  programs, sharpen their developer experience, and create',
        '  content strategies that actually move the needle.',
        '',
        '  AREAS',
      ], '', 20);
      for (const a of (profile.consultAreas || [])) {
        appendLine(
          `  <span style="color:var(--accent2)">\u00b7 ${esc(a)}</span>`,
          ''
        );
        await sleep(22);
      }
      blank();
      const contact = profile.calendly || `mailto:${profile.email}`;
      appendLine(
        `  <span style="color:var(--accent)">\u2192 get in touch: ${esc(contact)}</span>`,
        ''
      );
      blank();
    },

    map: async () => {
      const locs = talks.map(t => t.location);
      const { mapLines, placed } = buildMap(locs);

      blank();
      await stream(['  TALK LOCATIONS', '  ' + '\u2500'.repeat(68)], '', 0);
      blank();

      for (const l of mapLines) {
        // highlight * markers and land vs ocean
        const html = l
          .replace(/\*/g,      '<span style="color:var(--accent);font-weight:bold">*</span>')
          .replace(/\u2591/g,  '<span style="color:#2a2a2a">\u2591</span>')
          .replace(/\u00b7/g,  '<span style="color:#1a1a1a">\u00b7</span>');
        appendLine(html, 'font-mono text-xs leading-none');
        await sleep(8);
      }

      if (placed.length) {
        blank();
        await stream(['  LOCATIONS'], '', 0);
        for (const p of placed) {
          appendLine(
            `    <span style="color:var(--accent)">*</span> <span style="color:var(--txt)">${esc(p.city)}, ${esc(p.country)}</span>`,
            ''
          );
          await sleep(20);
        }
      }
      blank();
      text("  Update data/talks.json to add new locations.", 'color-muted');
      blank();
    },

    clear: async () => {
      output.innerHTML = '';
    },

    open: async (args) => {
      const target = (args[0] || '').toLowerCase();
      const socials = profile.socials || {};
      const shows   = profile.shows   || [];
      const MAP = {
        twitter:    socials.twitter,
        linkedin:   socials.linkedin,
        github:     socials.github,
        devto:      socials.devto,
        instagram:  socials.instagram,
        newsletter: shows.find(s => s.type === 'newsletter')?.url,
        youtube:    shows.find(s => s.type === 'youtube')?.url,
        calendly:   profile.calendly   || `mailto:${profile.email}`,
        email:      `mailto:${profile.email}`,
      };

      const url = MAP[target];
      blank();
      if (!url) {
        text(`  unknown target '${target}'.`, '');
        text(`  available: ${Object.keys(MAP).join(', ')}`, 'color-muted');
        blank();
        return;
      }
      appendLine(
        `  <span style="color:var(--accent)">\u2192 opening ${esc(target)} \u2026</span>`,
        ''
      );
      blank();
      setTimeout(() => window.open(url, '_blank', 'noopener,noreferrer'), 380);
    },
  };

  // ── dispatch ───────────────────────────────────────────────────────────────
  async function dispatch(raw) {
    const parts   = raw.trim().split(/\s+/);
    const cmd     = (parts[0] || '').toLowerCase();
    const args    = parts.slice(1);
    if (!cmd) return;

    echoCmd(raw);

    // Notify GUI layer so it can scroll to the right section
    document.dispatchEvent(new CustomEvent('term:command', { detail: { cmd, args } }));

    const handler = HANDLERS[cmd];
    if (handler) {
      await handler(args);
    } else {
      blank();
      text(`  command not found: ${cmd}. Type 'help' for available commands.`, '');
      blank();
    }
    output.scrollTop = output.scrollHeight;
  }

  // Expose dispatch globally so app.js CLI-hint buttons can call it
  window.__termDispatch = dispatch;

  // ── tab completion ─────────────────────────────────────────────────────────
  function updateHint(val) {
    if (!val) { hint.textContent = ''; return; }
    const match = COMMANDS.find(c => c.startsWith(val) && c !== val);
    hint.textContent = match || '';
  }

  // ── keyboard ───────────────────────────────────────────────────────────────
  input.addEventListener('input', () => updateHint(input.value));

  input.addEventListener('keydown', async e => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      if (val) { cmdHistory.unshift(val); histIdx = -1; }
      input.value   = '';
      hint.textContent = '';
      await dispatch(val);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < cmdHistory.length - 1) {
        histIdx++;
        input.value = cmdHistory[histIdx];
        updateHint(input.value);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) { histIdx--; input.value = cmdHistory[histIdx]; }
      else             { histIdx = -1; input.value = ''; }
      updateHint(input.value);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (hint.textContent) {
        input.value      = hint.textContent;
        hint.textContent = '';
      }
    }
  });

  // click anywhere → focus input
  document.getElementById('terminal-root')
    ?.addEventListener('click', () => input.focus());

  // ── boot sequence ──────────────────────────────────────────────────────────
  async function boot() {
    const lines = [
      `zachjonesnoel.com  \u2014  v2.0.0`,
      `${profile.name || ''} \u00b7 ${profile.title || ''} \u00b7 ${profile.employer || ''}`,
      '',
      `Type \u2018help\u2019 for available commands.`,
      '',
    ];
    await stream(lines, 'color-muted', reduced ? 0 : 38);
    input.focus();
  }

  boot();
})();
