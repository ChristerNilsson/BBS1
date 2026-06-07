(function () {
const DEFAULT_N = 8;
const EXPECTED_GROUPS = 14;
const VIEWER_URL = 'https://christernilsson.github.io/BBS2/#';

function normalizeText(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatRanking(ranking) {
  return String(ranking).padStart(4, '0');
}

function parsePlayers(value) {
  if (!value) return [];

  return value.split('_').map(token => {
    const parts = normalizeText(token).split(' ');
    const ranking = Number(parts.shift());
    return { ranking, name: parts.join(' ') };
  }).filter(player => Number.isFinite(player.ranking) && player.name);
}

function formatGroupSizes(groups) {
  const sizes = groups.map(group => group.players.length);
  return sizes.length === 0 ? '0 = 0' : `${sizes.join(' + ')} = ${sizes.reduce((sum, size) => sum + size, 0)}`;
}

function createViewerUrl(players, n, title, id) {
  const params = new URLSearchParams();
  if (id) params.set('id', id);
  params.set('turnering', normalizeText(title));
  params.set('n', n);
  params.set(
    'players',
    players.map(player => `${formatRanking(player.ranking)} ${player.name}`).join('_')
  );

  return `${VIEWER_URL}${params}`;
}

function getTournamentId() {
  return new URLSearchParams(window.location.search).get('id') || '';
}

function renderGroups(players, n) {
  const output = document.getElementById('output');
  const status = document.getElementById('status');
  const groups = [];

  for (let index = 0; index < players.length; index += n) {
    groups.push({ players: players.slice(index, index + n) });
  }

  status.textContent = `n = ${n}. Gruppstorlekar: ${formatGroupSizes(groups)}.`;

  if (players.length === 0) {
    output.innerHTML = '<p>Inga deltagare hittades.</p>';
    return;
  }

  output.innerHTML = groups.map((group, index) => {
    const rows = group.players.map(player => `
      <tr>
        <td>${escapeHtml(player.name)}</td>
        <td class="ranking">${formatRanking(player.ranking)}</td>
      </tr>
    `).join('');

    return `
      <section>
        <h2>Grupp ${index + 1}</h2>
        <table>
          <thead><tr><th>Namn</th><th class="ranking">Ranking</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>
    `;
  }).join('');
}

function initViewer() {
  const params = new URLSearchParams(window.location.search || window.location.hash.slice(1));
  const players = parsePlayers(params.get('players'));
  const title = normalizeText(params.get('turnering')) || 'Gruppindelning';
  const n = Number(params.get('n')) || DEFAULT_N;

  document.getElementById('title').textContent = title;
  document.getElementById('n').textContent = n;
  document.getElementById('decrease').hidden = true;
  document.getElementById('increase').hidden = true;
  renderGroups(players, n);
}

function parsePlayerTable(table) {
  const rows = Array.from(table.querySelectorAll('tr'));
  if (rows.length === 0) return [];

  const headerRowIndex = rows.findIndex(row => {
    const headers = Array.from(row.querySelectorAll('th, td'))
      .map(cell => normalizeText(cell.textContent).toUpperCase());
    return headers.some(header => header.includes('NAMN')) &&
      headers.some(header => header.includes('RANKING'));
  });

  if (headerRowIndex === -1) return [];

  const headers = Array.from(rows[headerRowIndex].querySelectorAll('th, td'))
    .map(cell => normalizeText(cell.textContent).toUpperCase());
  const nameIndex = headers.findIndex(header => header.includes('NAMN'));
  const rankingIndex = headers.findIndex(header => header.includes('RANKING'));

  if (nameIndex === -1 || rankingIndex === -1) return [];

  return rows.slice(headerRowIndex + 1).map(row => {
    const cells = Array.from(row.querySelectorAll('td'));
    return {
      name: normalizeText(cells[nameIndex]?.textContent),
      ranking: Number(normalizeText(cells[rankingIndex]?.textContent).replace(/[^\d-]/g, ''))
    };
  }).filter(player => player.name && Number.isFinite(player.ranking));
}

function parsePlayersInStartOrder(doc) {
  const tables = Array.from(doc.querySelectorAll('table'))
    .map(parsePlayerTable)
    .filter(players => players.length > 0);

  if (tables.length === 0) return [];
  return tables.sort((a, b) => b.length - a.length)[0];
}

function getTournamentTitle(doc) {
  const heading = doc.querySelector('h1, h2, h3');
  return (normalizeText(heading?.textContent) || normalizeText(doc.title) || 'Turnering')
    .replace(/\s+grupp\s+\d+$/i, '');
}

function getTournamentIdFromUrl(url) {
  try {
    return new URL(url, window.location.href).searchParams.get('id') || '';
  } catch {
    return '';
  }
}

function uniqueBy(items, getKey) {
  const seen = new Set();
  return items.filter(item => {
    const key = getKey(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getGroupLinks(doc) {
  const current = new URL(window.location.href);
  const groupLinks = [];

  doc.querySelectorAll('[onclick]').forEach(element => {
    const label = normalizeText(element.textContent);
    const match = /^Gr(\d+)$/i.exec(label);
    if (!match) return;

    const hrefMatch = /ShowTournamentServlet\?id=\d+[^'"]*/.exec(element.getAttribute('onclick') || '');
    if (!hrefMatch) return;

    const url = new URL(hrefMatch[0], window.location.href);
    groupLinks.push({
      groupNumber: Number(match[1]),
      id: url.searchParams.get('id') || '',
      url: url.href
    });
  });

  if (groupLinks.length > 0) {
    return uniqueBy(
      groupLinks.sort((a, b) => a.groupNumber - b.groupNumber),
      link => link.id
    );
  }

  const links = [{ id: getTournamentIdFromUrl(current.href), url: current.href }];

  doc.querySelectorAll('a[href]').forEach(anchor => {
    const url = new URL(anchor.getAttribute('href'), window.location.href);
    if (!url.pathname.endsWith('/ShowTournamentServlet')) return;
    links.push({ id: url.searchParams.get('id') || '', url: url.href });
  });

  doc.querySelectorAll('[onclick]').forEach(element => {
    const hrefMatch = /ShowTournamentServlet\?id=\d+[^'"]*/.exec(element.getAttribute('onclick') || '');
    if (!hrefMatch) return;

    const url = new URL(hrefMatch[0], window.location.href);
    links.push({ id: url.searchParams.get('id') || '', url: url.href });
  });

  return uniqueBy(links, link => link.id);
}

function createListingUrl(url) {
  const listingUrl = new URL(url, window.location.href);
  listingUrl.searchParams.set('listingtype', '3');
  return listingUrl.href;
}

function parseDocument(html) {
  return new DOMParser().parseFromString(html, 'text/html');
}

async function fetchDocument(url) {
  const response = await fetch(url, { credentials: 'same-origin' });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  return parseDocument(await response.text());
}

async function collectGroupsInStartOrder() {
  const groups = [];
  const primaryId = getTournamentId();

  for (const link of getGroupLinks(document)) {
    if (groups.length === EXPECTED_GROUPS) break;
    const listingDoc = await fetchDocument(createListingUrl(link.url));
    const players = parsePlayersInStartOrder(listingDoc);
    if (players.length > 0) groups.push({ id: link.id, players });
  }

  const firstSize = groups[0]?.players.length || 0;
  if (groups.length > 1 && groups.at(-1).players.length > firstSize) {
    groups.pop();
  }

  return {
    id: primaryId,
    title: getTournamentTitle(document),
    n: firstSize,
    players: groups.flatMap(group => group.players),
    groups
  };
}

async function runBookmarklet() {
  const existing = document.getElementById('bbs-bookmarklet-panel');
  if (typeof window.__bbsBookmarkletCleanup === 'function') {
    window.__bbsBookmarkletCleanup();
  }
  if (existing) existing.remove();

  const panel = document.createElement('div');
  panel.id = 'bbs-bookmarklet-panel';
  panel.style.cssText = 'position:fixed;inset:1rem;z-index:2147483647;overflow:auto;padding:1.5rem;background:white;border:2px solid #222;box-shadow:0 4px 20px #0004;font:16px system-ui,sans-serif;color:#111';
  panel.innerHTML = `
    <h1 style="margin-top:0">Bergergrupper</h1>
    <p id="bbs-bookmarklet-status">H&auml;mtar startordning...</p>
    <p><a id="bbs-bookmarklet-link"></a></p>
    <p>Man m&aring;ste klicka p&aring; urlen f&ouml;r att g&aring; vidare.</p>
    <button id="bbs-bookmarklet-close" type="button">St&auml;ng</button>
  `;
  document.body.appendChild(panel);

  const status = document.getElementById('bbs-bookmarklet-status');
  const link = document.getElementById('bbs-bookmarklet-link');

  window.__bbsBookmarkletCleanup = () => {
    panel.remove();
    window.__bbsBookmarkletCleanup = null;
  };
  document.getElementById('bbs-bookmarklet-close').addEventListener('click', window.__bbsBookmarkletCleanup);

  try {
    const state = await collectGroupsInStartOrder();
    if (state.players.length === 0 || state.n === 0) {
      throw new Error('Hittade inga deltagare i startordning.');
    }

    const url = createViewerUrl(state.players, state.n, state.title, state.id);
    status.innerHTML = `n = <strong>${state.n}</strong>.<br>Grupper: ${formatGroupSizes(state.groups)}.<br>Deltagare: ${state.players.length}.`;
    link.href = url;
    link.textContent = url;
  } catch (error) {
    status.textContent = `Kunde inte hämta startordningen: ${error.message}`;
  }
}

if (window.location.hostname === 'member.schack.se') {
  runBookmarklet();
} else {
  window.addEventListener('DOMContentLoaded', initViewer);
}
})();
