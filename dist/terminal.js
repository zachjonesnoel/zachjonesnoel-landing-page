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
    'help', 'whoami', 'talks', 'writing', 'shows', 'consult', 'map', 'figlet', 'clear', 'open',
  ];
  const BANNER = ["             _     _                               _ ","  _____ _ __| |_  (_)___ _ _  ___ ____ _  ___  ___| |"," |_ / _` / _| ' \\ | / _ \\ ' \\/ -_|_-< ' \\/ _ \\/ -_) |"," /__\\__,_\\__|_||_|/ \\___/_||_\\___/__/_||_\\___/\\___|_|","                |__/                                 "];
  // Newest first; dates are 'YYYY-MM' or 'YYYY-MM-DD'.
  const byDateDesc = (a, b) => String(b.date).localeCompare(String(a.date));
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

  // Parses '--flag value with spaces --bool' into { flag: 'value with spaces' | true }.
  function parseFlags(args) {
    const flags = {};
    let cur = null;
    for (const a of args) {
      if (a.startsWith('--')) { cur = a.slice(2).toLowerCase(); flags[cur] = true; }
      else if (cur) { flags[cur] = flags[cur] === true ? a : flags[cur] + ' ' + a; }
    }
    return flags;
  }
  const flagStr = v => (typeof v === 'string' ? v.toLowerCase() : '');

  // Types the figlet command, then scans the banner in left to right.
  async function playBanner() {
    const cmd = 'figlet zachjonesnoel';
    const width = Math.max(...BANNER.map(r => r.length));
    const row = appendLine('', '');
    row.className = 'flex gap-2 leading-relaxed';
    const typed = i => {
      row.innerHTML = `<span style="color:var(--accent);user-select:none">$</span><span style="color:var(--txt)">${esc(cmd.slice(0, i))}</span>`;
    };
    for (let i = 1; i <= cmd.length; i++) { typed(i); await sleep(45); }
    await sleep(250);
    const pre = document.createElement('pre');
    pre.className = 'whitespace-pre leading-[1.15] text-[9px] sm:text-[12px] overflow-x-auto';
    pre.style.color = 'var(--accent)';
    pre.setAttribute('aria-label', 'zachjonesnoel');
    output.appendChild(pre);
    if (reduced) { pre.textContent = BANNER.join('\n'); }
    else {
      for (let col = 0; col <= width; col += 2) {
        pre.textContent = BANNER.map(r => r.slice(0, col).padEnd(col, ' ') + (col < width ? '\u258c' : '')).join('\n');
        output.scrollTop = output.scrollHeight;
        await sleep(22);
      }
      pre.textContent = BANNER.join('\n');
    }
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
      const sections = [
        ['GENERAL', [
          ['help',             'show this help'],
          ['whoami',           'who is Jones?'],
          ['shows',            'The Serverless Terminal & The Zacs\' Show'],
          ['consult',          'consultation areas + contact'],
          ['figlet',           'replay the zachjonesnoel banner'],
          ['map',              'ASCII world map of talk locations'],
          ['open <name>',      'twitter | linkedin | github | devto | instagram | newsletter | youtube | calendly | email'],
          ['clear',            'clear terminal'],
        ]],
        ['TALKS  (newest first, default 5)', [
          ['talks',                  'most recent talks'],
          ['talks --all',            'full list'],
          ['talks --upcoming',       'upcoming only'],
          ['talks --city <name>',    'filter by city, e.g. --city London'],
          ['talks --tag <tag>',      'filter by tag, e.g. --tag serverless'],
          ['talks --slides',         'only talks with slides'],
          ['talks --video',          'only talks with a recording'],
          ['talks --cities | --tags','list available cities / tags'],
        ]],
        ['WRITING  (newest first, default 10)', [
          ['writing',                    'latest posts & newsletters'],
          ['writing --all',              'full list'],
          ['writing --limit <n>',        'show n entries'],
          ['writing --type <type>',      'blog | newsletter'],
          ['writing --platform <name>',  'e.g. --platform New Relic'],
          ['writing --tag <tag>',        'e.g. --tag dynamodb'],
          ['writing --platforms | --tags','list available platforms / tags'],
        ]],
      ];
      const maxCmd = Math.max(...sections.flatMap(([, r]) => r.map(x => x[0].length)));
      const rule = '\u2500'.repeat(Math.min(maxCmd + 40, 72));
      for (const [title, rows] of sections) {
        await stream([title, rule], 'color-muted', 0);
        for (const [cmd, desc] of rows) {
          appendLine(
            `  <span style="color:var(--accent)">${esc(cmd.padEnd(maxCmd + 2))}</span>` +
            `<span style="color:var(--muted)">${esc(desc)}</span>`,
            ''
          );
          await sleep(12);
        }
        blank();
      }
      await stream(['Filters combine (e.g. writing --type blog --tag aws --platform New Relic).',
                    'Tab completes commands; \u2191/\u2193 browse history.'], 'color-muted', 0);
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
      const f = parseFlags(args);
      const countBy = (arr) => {
        const m = {};
        for (const x of arr) m[x] = (m[x] || 0) + 1;
        return Object.entries(m).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      };
      blank();
      if (f.cities || f.tags) {
        const rows = f.cities
          ? countBy(talks.map(t => t.location && t.location.city).filter(Boolean))
          : countBy(talks.flatMap(t => (t.tags || []).map(x => x.toLowerCase())));
        await stream([f.cities ? '  CITIES' : '  TAGS'], 'color-muted', 0);
        appendLine('  ' + rows.map(([k, n]) => `<span style="color:var(--accent)">${esc(k)}</span><span style="color:var(--muted)">(${n})</span>`).join('  '), '');
        blank();
        return;
      }

      let list = [...talks].sort(byDateDesc);
      if (f.upcoming) list = list.filter(t => window.isUpcomingTalk(t));
      if (flagStr(f.city)) list = list.filter(t => (t.location.city || '').toLowerCase().includes(flagStr(f.city)));
      if (flagStr(f.tag))  list = list.filter(t => (t.tags || []).some(x => x.toLowerCase() === flagStr(f.tag)));
      if (f.slides) list = list.filter(t => t.slides);
      if (f.video)  list = list.filter(t => t.video);
      const filtered = list.length;
      const limited  = !f.all && !f.upcoming && !flagStr(f.city) && !flagStr(f.tag) && !f.slides && !f.video;
      if (limited) list = list.slice(0, 5);

      if (!list.length) {
        await stream(['  no talks match those filters.'], '', 0);
        blank();
        return;
      }

      const header = '  DATE      CONFERENCE                         TITLE';
      const rule   = '  ' + '\u2500'.repeat(header.length - 2);
      await stream([header, rule], 'color-muted', 0);

      for (const t of list) {
        const conf  = t.conference.substring(0, 34).padEnd(34);
        const title = t.title.substring(0, 44);
        const col   = window.isUpcomingTalk(t) ? 'var(--accent2)' : 'var(--txt)';
        appendLine(
          `<span style="color:var(--muted)">  ${esc(t.date)}  </span>` +
          `<span style="color:${col}">${esc(conf)}  ${esc(title)}</span>` +
          (t.slides ? ` <span style="color:var(--accent)">[slides]</span>` : '') +
          (t.video  ? ` <span style="color:var(--accent)">[video]</span>`  : ''),
          ''
        );
        await sleep(25);
      }

      blank();
      if (limited && talks.length > 5) {
        text(`  \u2026 and ${talks.length - 5} more. Run 'talks --all' to see everything.`, 'color-muted');
      } else {
        text(`  ${filtered} talk${filtered === 1 ? '' : 's'}.`, 'color-muted');
      }
      blank();
    },

    writing: async (args) => {
      const f = parseFlags(args);
      const countBy = (arr) => {
        const m = {};
        for (const x of arr) m[x] = (m[x] || 0) + 1;
        return Object.entries(m).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
      };
      blank();
      if (f.platforms || f.tags) {
        const rows = f.platforms
          ? countBy(writing.map(w => w.platform))
          : countBy(writing.flatMap(w => (w.tags || []).map(x => x.toLowerCase())));
        await stream([f.platforms ? '  PLATFORMS' : '  TAGS'], 'color-muted', 0);
        appendLine('  ' + rows.map(([k, n]) => `<span style="color:var(--accent)">${esc(k)}</span><span style="color:var(--muted)">(${n})</span>`).join('  '), '');
        blank();
        return;
      }

      let list = [...writing].filter(w => !String(w.id).includes('template')).sort(byDateDesc);
      if (flagStr(f.type))     list = list.filter(w => w.type === flagStr(f.type));
      if (flagStr(f.platform)) list = list.filter(w => w.platform.toLowerCase().includes(flagStr(f.platform)));
      if (flagStr(f.tag))      list = list.filter(w => (w.tags || []).some(x => x.toLowerCase() === flagStr(f.tag)));
      const filtered = list.length;
      const n = parseInt(f.limit, 10);
      const limit = n > 0 ? n : (f.all ? Infinity : 10);
      list = list.slice(0, limit);

      if (!list.length) {
        await stream(['  no writing matches those filters.'], '', 0);
        blank();
        return;
      }

      const TYPE_COLOR = {
        blog:       'var(--accent)',
        newsletter: 'var(--accent2)',
        linkedin:   '#60a5fa',
      };

      await stream(['  DATE        TYPE        PLATFORM                  TITLE', '  ' + '\u2500'.repeat(76)], 'color-muted', 0);

      for (const w of list) {
        const tc = TYPE_COLOR[w.type] || 'var(--txt)';
        appendLine(
          `<span style="color:var(--muted)">  ${esc(w.date.padEnd(10))}  </span>` +
          `<span style="color:${tc}">${esc(w.type.padEnd(10))}  </span>` +
          `<span style="color:var(--muted)">${esc(w.platform.substring(0, 24).padEnd(24))}  </span>` +
          `<span style="color:var(--txt)">${esc(w.title.substring(0, 50))}</span>`,
          ''
        );
        await sleep(15);
      }
      blank();
      text(list.length < filtered
        ? `  showing ${list.length} of ${filtered}. Use --all or --limit <n> for more.`
        : `  ${filtered} entr${filtered === 1 ? 'y' : 'ies'}.`, 'color-muted');
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

    figlet: async () => {
      blank();
      await playBanner();
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

    const handler = HANDLERS[cmd === 'banner' ? 'figlet' : cmd];
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
    await playBanner();
    blank();
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
