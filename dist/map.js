/* zachjonesnoel.com — talks map (Leaflet + CartoDB Dark, no dynamic script injection) */
(function () {
  'use strict';

  function initMap() {
    const mapEl = document.getElementById('talks-map');
    if (!mapEl) return;

    // Leaflet must already be on the page (loaded via <head> script tag in Base.astro)
    if (typeof L === 'undefined') {
      console.warn('[map.js] Leaflet not available yet — retrying in 200ms');
      setTimeout(initMap, 200);
      return;
    }

    // Read data injected by Astro
    const raw = document.getElementById('terminal-data');
    const DATA = raw ? JSON.parse(raw.textContent || '{}') : {};
    const talks = DATA.talks || [];

    // ── build map ────────────────────────────────────────────────────────
    const map = L.map('talks-map', {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    });

    // Force correct size in case the container was hidden or zero-height at init
    map.invalidateSize();

    // Stadia Maps — swap between dark/light tile style based on current theme
    const stadiaKey = (typeof STADIA_API_KEY !== 'undefined' && STADIA_API_KEY) ? STADIA_API_KEY : '';
    const isLight   = document.documentElement.classList.contains('light');
    const tileStyle = isLight ? 'alidade_smooth' : 'alidade_smooth_dark';
    const tileUrl   = stadiaKey
      ? `https://tiles.stadiamaps.com/tiles/${tileStyle}/{z}/{x}/{y}{r}.png?api_key=${stadiaKey}`
      : `https://tiles.stadiamaps.com/tiles/${tileStyle}/{z}/{x}/{y}{r}.png`;

    const tileLayer = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://stadiamaps.com/" style="color:#888">Stadia Maps</a> ' +
        '&copy; <a href="https://openmaptiles.org/" style="color:#888">OpenMapTiles</a> ' +
        '&copy; <a href="https://www.openstreetmap.org/copyright" style="color:#888">OpenStreetMap</a>',
      minZoom: 0,
      maxZoom: 20,
    });
    tileLayer.addTo(map);

    // Re-init map when theme toggles (swap tile style)
    document.addEventListener('click', function onThemeClick(e) {
      if (e.target.closest('#theme-toggle')) {
        // Give CSS class time to flip, then swap tiles
        setTimeout(() => {
          const nowLight   = document.documentElement.classList.contains('light');
          const newStyle   = nowLight ? 'alidade_smooth' : 'alidade_smooth_dark';
          const newUrl     = stadiaKey
            ? `https://tiles.stadiamaps.com/tiles/${newStyle}/{z}/{x}/{y}{r}.png?api_key=${stadiaKey}`
            : `https://tiles.stadiamaps.com/tiles/${newStyle}/{z}/{x}/{y}{r}.png`;
          tileLayer.setUrl(newUrl);
        }, 50);
      }
    });

    // ── inject popup dark styling once ──────────────────────────────────
    if (!document.getElementById('leaflet-dark-style')) {
      const style = document.createElement('style');
      style.id = 'leaflet-dark-style';
      style.textContent = `
        .zach-popup .leaflet-popup-content-wrapper {
          background: #111111;
          border: 1px solid #2a2a2a;
          border-radius: 6px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.7);
          color: #e8e8e8;
        }
        .zach-popup .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .zach-popup .leaflet-popup-tip {
          background: #111111;
          box-shadow: none;
        }
        .zach-popup .leaflet-popup-content {
          margin: 12px 16px;
        }
        .zach-popup .leaflet-popup-close-button {
          color: #555 !important;
          font-size: 18px !important;
          top: 6px !important;
          right: 8px !important;
        }
        .zach-popup .leaflet-popup-close-button:hover { color: #e8e8e8 !important; }
        .leaflet-control-attribution {
          background: rgba(10,10,10,0.85) !important;
          color: #444 !important;
          font-size: 10px !important;
        }
        .leaflet-control-attribution a { color: #555 !important; }
        .leaflet-control-zoom a {
          background: #111 !important;
          color: #666 !important;
          border-color: #2a2a2a !important;
        }
        .leaflet-control-zoom a:hover {
          background: #1a1a1a !important;
          color: #e8e8e8 !important;
        }
      `;
      document.head.appendChild(style);
    }

    // ── deduplicate locations (same lat/lng = same pin) ──────────────────
    const cityMap = new Map();
    for (const talk of talks) {
      if (!talk.location || talk.location.lat == null || talk.location.lng == null) continue;
      const { lat, lng, city, country } = talk.location;
      const key = `${lat},${lng}`;
      if (!cityMap.has(key)) {
        cityMap.set(key, { lat, lng, city, country, talks: [] });
      }
      cityMap.get(key).talks.push(talk);
    }

    const locations = Array.from(cityMap.values());

    // ── update stat counters ─────────────────────────────────────────────
    const upcomingTalks = talks.filter(t => t.upcoming);
    const cityCountEl     = document.getElementById('map-city-count');
    const talkCountEl     = document.getElementById('map-talk-count');
    const upcomingCountEl = document.getElementById('map-upcoming-count');
    if (cityCountEl)     cityCountEl.textContent = locations.length;
    if (talkCountEl)     talkCountEl.textContent = talks.length;
    if (upcomingCountEl) upcomingCountEl.textContent = upcomingTalks.length;

    // ── SVG pin icon factory ─────────────────────────────────────────────
    function makeIcon(upcoming) {
      const fill   = upcoming ? '#22c55e' : '#888888';
      const ring   = upcoming ? 'rgba(34,197,94,0.25)' : 'rgba(255,255,255,0.08)';
      const stroke = upcoming ? '#22c55e' : '#555555';
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
        <circle cx="11" cy="11" r="10" fill="${ring}" />
        <circle cx="11" cy="11" r="6"  fill="${fill}" />
        <circle cx="11" cy="11" r="6"  fill="none" stroke="${stroke}" stroke-width="1.5" opacity="0.5"/>
      </svg>`;
      return L.divIcon({
        html: svg,
        className: '',      // no leaflet default background/border
        iconSize:   [22, 22],
        iconAnchor: [11, 11],
        popupAnchor:[0, -14],
      });
    }

    // ── place pins & popups ──────────────────────────────────────────────
    const bounds = [];

    for (const loc of locations) {
      const hasUpcoming = loc.talks.some(t => t.upcoming);
      const marker = L.marker([loc.lat, loc.lng], {
        icon: makeIcon(hasUpcoming),
        title: `${loc.city}, ${loc.country}`,
      });

      const talkRows = loc.talks
        .sort((a, b) => (b.upcoming ? 1 : 0) - (a.upcoming ? 1 : 0))
        .map(t => {
          const dot = t.upcoming
            ? '<span style="color:#22c55e;margin-right:5px">●</span>'
            : '<span style="color:#444;margin-right:5px">●</span>';
          const links = [
            t.slides ? `<a href="${t.slides}" target="_blank" style="color:#22c55e;font-size:10px;text-decoration:none">slides ↗</a>` : '',
            t.video  ? `<a href="${t.video}"  target="_blank" style="color:#22c55e;font-size:10px;text-decoration:none">video ↗</a>`  : '',
          ].filter(Boolean).join('&ensp;');

          return `<div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #1e1e1e">
            <div style="display:flex;align-items:flex-start">
              <span style="margin-top:3px;flex-shrink:0">${dot}</span>
              <div>
                <div style="color:#e8e8e8;font-size:12px;line-height:1.4;margin-bottom:2px">${t.title}</div>
                <div style="color:#555;font-size:10px">${t.conference} · ${t.date}</div>
                ${links ? `<div style="margin-top:4px">${links}</div>` : ''}
              </div>
            </div>
          </div>`;
        }).join('');

      const popupContent = `
        <div style="font-family:'JetBrains Mono',monospace">
          <div style="color:#22c55e;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:10px">
            ${loc.city}, ${loc.country}
          </div>
          ${talkRows}
        </div>`;

      marker.bindPopup(
        L.popup({ maxWidth: 280, className: 'zach-popup' }).setContent(popupContent)
      );

      // open popup on hover too, not just click
      marker.on('mouseover', function () { this.openPopup(); });
      marker.on('mouseout',  function () { this.closePopup(); });

      marker.addTo(map);
      bounds.push([loc.lat, loc.lng]);
    }

    // ── fit viewport ─────────────────────────────────────────────────────
    if (bounds.length === 0) {
      map.setView([20, 0], 2);
    } else if (bounds.length === 1) {
      map.setView(bounds[0], 5);
    } else {
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 8 });
    }

    // ── upcoming talks list below map ─────────────────────────────────────
    if (upcomingTalks.length > 0) {
      const listSection = document.getElementById('upcoming-talks-list');
      const listItems   = document.getElementById('upcoming-talks-items');
      if (listSection && listItems) {
        listSection.classList.remove('hidden');
        for (const t of upcomingTalks) {
          const item = document.createElement('div');
          item.className = 'grid gap-4 items-start py-3 border-t border-border first:border-t-0 first:pt-0';
          item.style.gridTemplateColumns = '1fr auto';
          item.innerHTML = `
            <div>
              <p style="font-family:monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);margin-bottom:3px">
                ${t.conference} · ${t.location.city}
              </p>
              <p style="font-size:14px;color:var(--txt)">${t.title}</p>
            </div>
            <span style="font-family:monospace;font-size:11px;color:var(--accent);white-space:nowrap">${t.date}</span>
          `;
          listItems.appendChild(item);
        }
      }
    }
  }

  // Wait for DOM to be ready before initialising
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
