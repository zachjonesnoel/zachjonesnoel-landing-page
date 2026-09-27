/* zachjonesnoel.com — GUI layer + terminal drawer bridge */
(function () {
  'use strict';

  // ── theme toggle ───────────────────────────────────────────────────────────
  const themeBtn   = document.getElementById('theme-toggle');
  const themeIcon  = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  const html       = document.documentElement;

  function isLight() { return html.classList.contains('light'); }

  function updateThemeUI() {
    if (isLight()) {
      if (themeIcon)  themeIcon.textContent  = '☀️';
      if (themeLabel) themeLabel.textContent = 'dark';
      themeBtn?.setAttribute('title', 'Switch to dark mode');
    } else {
      if (themeIcon)  themeIcon.textContent  = '🌙';
      if (themeLabel) themeLabel.textContent = 'light';
      themeBtn?.setAttribute('title', 'Switch to light mode');
    }
  }

  function applyTheme(light) {
    if (light) {
      html.classList.add('light');
    } else {
      html.classList.remove('light');
    }
    localStorage.setItem('theme', light ? 'light' : 'dark');
    updateThemeUI();
    // Update nav scroll bg for current theme
    updateNavBg();
  }

  themeBtn?.addEventListener('click', () => applyTheme(!isLight()));

  // Keyboard shortcut: Alt+T
  document.addEventListener('keydown', e => {
    if (e.altKey && e.key === 't') {
      e.preventDefault();
      applyTheme(!isLight());
    }
  });

  // Sync UI to whatever state the anti-flash script already set
  updateThemeUI();

  // ── nav scroll styling ─────────────────────────────────────────────────────
  const nav = document.getElementById('site-nav');

  function updateNavBg() {
    if (!nav) return;
    if (window.scrollY > 20) {
      nav.style.background       = isLight()
        ? 'rgba(249,249,247,0.92)'
        : 'rgba(10,10,10,0.92)';
      nav.style.backdropFilter   = 'blur(12px)';
      nav.style.borderBottomColor = isLight() ? '#d4d4d0' : '#222222';
    } else {
      nav.style.background       = 'transparent';
      nav.style.backdropFilter   = 'none';
      nav.style.borderBottomColor = 'transparent';
    }
  }

  if (nav) {
    window.addEventListener('scroll', updateNavBg, { passive: true });
    updateNavBg();
  }

  // ── terminal drawer ────────────────────────────────────────────────────────
  const drawer  = document.getElementById('term-drawer');
  const toggle  = document.getElementById('term-toggle');
  const close   = document.getElementById('term-close');
  const tInput  = document.getElementById('terminal-input');

  let isOpen = false;

  function openDrawer() {
    if (!drawer) return;
    drawer.style.transform = 'translateY(0)';
    isOpen = true;
    toggle?.setAttribute('aria-pressed', 'true');
    // focus input after transition
    setTimeout(() => tInput?.focus(), 310);
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.style.transform = 'translateY(100%)';
    isOpen = false;
    toggle?.setAttribute('aria-pressed', 'false');
  }

  function toggleDrawer() {
    isOpen ? closeDrawer() : openDrawer();
  }

  toggle?.addEventListener('click', toggleDrawer);
  close?.addEventListener('click',  closeDrawer);

  // Ctrl+` or Ctrl+\ to toggle from anywhere
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '`' || e.key === '\\')) {
      e.preventDefault();
      toggleDrawer();
    }
    // Escape closes
    if (e.key === 'Escape' && isOpen) closeDrawer();
  });

  // ── CLI hint buttons → dispatch into terminal ──────────────────────────────
  // These are the "$ talks", "$ writing" etc. buttons on each GUI section.
  // Clicking one opens the terminal and runs the command.
  document.querySelectorAll('.cli-hint').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const cmd = btn.getAttribute('data-cmd');
      if (!cmd) return;

      openDrawer();

      // Wait for drawer open + terminal engine to be ready, then dispatch
      setTimeout(() => {
        // Use the global dispatch exposed by terminal.js
        if (typeof window.__termDispatch === 'function') {
          window.__termDispatch(cmd);
        } else if (tInput) {
          // Fallback: fill input and simulate Enter
          tInput.value = cmd;
          tInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        }
      }, 340);
    });
  });

  // ── section → terminal sync ────────────────────────────────────────────────
  // When a section scrolls into view, briefly show its CLI command in the
  // toggle button as a hint (without running it).
  const SECTION_CMDS = {
    talks:   'talks',
    writing: 'writing',
    shows:   'shows',
    consult: 'consult',
  };

  const toggleLabel = toggle?.querySelector('span:last-child');
  const defaultLabel = 'terminal';

  if (toggleLabel && 'IntersectionObserver' in window) {
    let resetTimer;
    const obs = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const cmd = SECTION_CMDS[entry.target.id];
          if (cmd && toggleLabel) {
            clearTimeout(resetTimer);
            toggleLabel.textContent = `$ ${cmd}`;
            resetTimer = setTimeout(() => {
              toggleLabel.textContent = defaultLabel;
            }, 2200);
          }
        }
      }
    }, { threshold: 0.35 });

    Object.keys(SECTION_CMDS).forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  // ── terminal → GUI scroll sync ─────────────────────────────────────────────
  // terminal.js fires a custom event 'term:command' with { cmd, args }
  // so we can scroll the GUI to the right section.
  const CMD_SECTION = {
    talks:   'talks',
    writing: 'writing',
    shows:   'shows',
    consult: 'consult',
    whoami:  'about',
  };

  document.addEventListener('term:command', e => {
    const section = CMD_SECTION[e.detail?.cmd];
    if (section) {
      const el = document.getElementById(section);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 600); // let terminal output start first
      }
    }
  });

})();
