/* zachjonesnoel.com — talk detail modal */
(function () {
  'use strict';

  const overlay   = document.getElementById('talk-modal-overlay');
  const backdrop  = document.getElementById('talk-modal-backdrop');
  const closeBtn  = document.getElementById('talk-modal-close');
  const panel     = document.getElementById('talk-modal-panel');

  if (!overlay) return;

  // Read talks from injected JSON
  const raw   = document.getElementById('terminal-data');
  const DATA  = raw ? JSON.parse(raw.textContent || '{}') : {};
  const talks = DATA.talks || [];

  // ── tag colour map ─────────────────────────────────────────────────────────
  const TAG_COLORS = {
    serverless:            'border-green-500/40 text-green-400',
    aws:                   'border-orange-400/40 text-orange-400',
    observability:         'border-blue-400/40 text-blue-400',
    devrel:                'border-purple-400/40 text-purple-400',
    'developer-experience':'border-cyan-400/40 text-cyan-400',
    'event-driven':        'border-yellow-400/40 text-yellow-400',
    newrelic:              'border-teal-400/40 text-teal-400',
    community:             'border-pink-400/40 text-pink-400',
    architecture:          'border-indigo-400/40 text-indigo-400',
    performance:           'border-red-400/40 text-red-400',
    career:                'border-amber-400/40 text-amber-400',
    _default:              'border-border text-muted',
  };

  function tagClass(tag) {
    return TAG_COLORS[tag] || TAG_COLORS._default;
  }

  // ── open modal ─────────────────────────────────────────────────────────────
  function openModal(talk) {
    // Title + conference
    document.getElementById('modal-talk-title').textContent = talk.title;
    document.getElementById('modal-conference').textContent =
      `${talk.conference} · ${talk.location.city}, ${talk.location.country}`;
    document.getElementById('modal-location').textContent =
      `${talk.location.city}, ${talk.location.country}`;
    document.getElementById('modal-date').textContent = talk.date;

    // Abstract
    document.getElementById('modal-abstract').textContent =
      talk.abstract || 'No abstract available.';

    // Tags
    const tagsEl = document.getElementById('modal-tags');
    tagsEl.innerHTML = '';
    (talk.tags || []).forEach(tag => {
      const span = document.createElement('span');
      span.className = `font-mono text-[10px] tracking-wider border px-2 py-0.5 rounded-sm ${tagClass(tag)}`;
      span.textContent = tag;
      tagsEl.appendChild(span);
    });
    if (talk.upcoming) {
      const badge = document.createElement('span');
      badge.className = 'font-mono text-[9px] tracking-widest uppercase bg-accent text-black px-1.5 py-0.5 rounded-sm';
      badge.textContent = 'upcoming';
      tagsEl.appendChild(badge);
    }

    // Co-speakers
    const cospeakersWrap = document.getElementById('modal-cospeakers-wrap');
    const cospeakersEl   = document.getElementById('modal-cospeakers');
    cospeakersEl.innerHTML = '';
    const cospeakers = (talk.cospeakers || []).filter(c => c.name && !c.name.toLowerCase().includes('template'));
    if (cospeakers.length > 0) {
      cospeakersWrap.classList.remove('hidden');
      cospeakers.forEach(speaker => {
        const el = document.createElement('a');
        el.href = speaker.linkedin || '#';
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
        el.className = [
          'inline-flex items-center gap-1.5',
          'font-mono text-xs border border-border rounded px-2.5 py-1.5',
          'text-txt hover:text-accent hover:border-accent/40 transition-all',
        ].join(' ');
        el.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" class="opacity-60">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          ${speaker.name}
        `;
        cospeakersEl.appendChild(el);
      });
    } else {
      cospeakersWrap.classList.add('hidden');
    }

    // CTAs
    const ctasEl = document.getElementById('modal-ctas');
    ctasEl.innerHTML = '';

    if (talk.video) {
      const btn = document.createElement('a');
      btn.href = talk.video;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.className = 'inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-semibold px-4 py-2 rounded transition-colors';
      btn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.65 12.65 0 00-8.41 1.37 4.85 4.85 0 01-1.41 5.69 12.65 12.65 0 00-.38 8.59 4.84 4.84 0 013.81 2.72 12.65 12.65 0 008.41-1.37 4.84 4.84 0 011.38-5.67 12.65 12.65 0 00.37-8.58zM12 15.5a3.5 3.5 0 113.5-3.5A3.5 3.5 0 0112 15.5z"/>
        </svg>
        Watch on YouTube
      `;
      ctasEl.appendChild(btn);
    }

    if (talk.slides) {
      const btn = document.createElement('a');
      btn.href = talk.slides;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.className = 'inline-flex items-center gap-2 border border-accent text-accent hover:bg-accent hover:text-black font-mono text-xs font-semibold px-4 py-2 rounded transition-all';
      btn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
        </svg>
        View Deck
      `;
      ctasEl.appendChild(btn);
    }

    if (!talk.video && !talk.slides) {
      const note = document.createElement('p');
      note.className = 'font-mono text-[11px] text-muted italic';
      note.textContent = 'Recording and slides coming soon.';
      ctasEl.appendChild(note);
    }

    // Show modal
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  // ── close modal ────────────────────────────────────────────────────────────
  function closeModal() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
  });

  // ── wire up talk cards ─────────────────────────────────────────────────────
  document.querySelectorAll('.talk-card').forEach(card => {
    card.addEventListener('click', () => {
      const id   = card.getAttribute('data-talk-id');
      const talk = talks.find(t => t.id === id);
      if (talk) openModal(talk);
    });
  });

})();
