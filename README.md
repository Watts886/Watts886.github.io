<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Oscars Broadcast Leaderboard</title>

  <style>
    :root {
      --bg-1: #ffffff;
      --bg-2: #f0ece0;
      --gold: #7a5c00;
      --gold-bright: #a07800;
      --cream: #0d0d0d;
      --muted: #3a3020;
      --border: rgba(90, 65, 0, 0.5);
      --card-bg: #fffef8;
      --leader-bg: #fdf5cc;
      --shadow: 0 4px 20px rgba(0,0,0,0.15);
      --radius: 26px;
    }

    * {
      box-sizing: border-box
    }

    body {
      margin: 0;
      padding: 24px;
      font-family: "Avenir Next", "Helvetica Neue", Arial, sans-serif;
      background: #ede8d5;
      color: var(--cream);
    }

    .wrap {
      max-width: 1280px;
      margin: auto;
    }

    /* ===== LEADER ===== */
    .leader-showcase {
      margin-bottom: 24px
    }

    .leader-card {
      border-radius: 30px;
      border: 3px solid var(--gold);
      background: #fdf5cc;
      box-shadow: 0 6px 28px rgba(0,0,0,0.15);
      padding: 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 28px;
    }

    /* Left half: leader info */
    .leader-left {
      display: flex;
      align-items: center;
      gap: 28px;
      flex: 1;
      min-width: 0;
    }

    .leader-info {
      flex: 1;
      min-width: 0;
    }

    .leader-name-row {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .leader-image {
      width: 64px;
      height: 64px;
      object-fit: contain;
      display: none;
    }

    .leader-image.show {
      display: block
    }

    .leader-name {
      font-size: clamp(2rem, 4vw, 3rem);
      font-weight: 900;
    }

    .leader-points {
      margin-top: 10px;
      font-size: clamp(1.6rem, 3vw, 2.6rem);
      font-weight: 900;
    }

    .leader-movement {
      margin-top: 8px;
      font-size: 22px;
      color: #5a4400;
      font-weight: 400;
    }

    .leader-rank {
      min-width: 130px;
      min-height: 130px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid var(--gold);
      background: white;
      font-size: 2.8rem;
      font-weight: 900;
      flex-shrink: 0;
    }

    .leader-rank img {
      height: 80px;
      width: 80px;
    }

    /* Right half: vertical ticker */
    .ticker-panel {
      width: 460px;
      flex-shrink: 0;
      border-left: 2px solid var(--gold);
      padding-left: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow: hidden;
      height: 140px;
      position: relative;
    }

    .ticker-panel-label {
      font-size: 24px;
      letter-spacing: .2em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--gold);
      flex-shrink: 0;
      margin-bottom: 4px;
    }

    .ticker-vert-wrap {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    /* Fade edges top and bottom */
    .ticker-vert-wrap::before,
    .ticker-vert-wrap::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 22px;
      z-index: 2;
      pointer-events: none;
    }

    .ticker-vert-wrap::before {
      top: 0;
      background: linear-gradient(to bottom, #fdf5cc, transparent);
    }

    .ticker-vert-wrap::after {
      bottom: 0;
      background: linear-gradient(to top, #fdf5cc, transparent);
    }

    .ticker-vert-track {
      display: flex;
      flex-direction: column;
      gap: 0;
      animation: ticker-vert-scroll 18s linear infinite;
    }

    .ticker-vert-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 0;
      font-size: 26px;
      font-weight: 200;
      color: #1a1200;
      white-space: nowrap;
      line-height: 1.9;
    }

    .ticker-vert-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--gold);
      flex-shrink: 0;
      opacity: 1;
    }

    @keyframes ticker-vert-scroll {
      0%   { transform: translateY(0); }
      100% { transform: translateY(-50%); }
    }

    /* ===== TABLE ===== */
    .board-card {
      border-radius: var(--radius);
      border: 2px solid var(--border);
      background: #fffef8;
      box-shadow: var(--shadow);
      overflow: hidden;
    }

    .board-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 20px;
      border-bottom: 2px solid var(--border);
      background: #fff8e1;
    }

    .board-title h2 {
      margin: 0;
      font-size: 1.3rem;
      color: #1a1200;
    }

    .board-title span {
      font-size: .85rem;
      color: #5a4400;
    }

    .status {
      color: #5a4400;
      font-size: .85rem
    }

    table {
      width: 100%;
      border-collapse: collapse
    }

    thead th {
      padding: 12px 20px;
      font-size: 20px;
      letter-spacing: .15em;
      text-transform: uppercase;
      color: #5a4400;
      border-bottom: 2px solid var(--border);
      text-align: center;
      background: #fdf5e0;
    }

    .sortable {
      cursor: pointer
    }

    .sortable.active {
      color: var(--gold);
    }

    .sortable.active.asc::after {
      content: ' ▲'
    }

    .sortable.active.desc::after {
      content: ' ▼'
    }

    tbody td {
      padding: 14px 20px;
      border-bottom: 1px solid rgba(100, 75, 0, 0.18);
      text-align: center;
      color: #111111;
    }

    tbody tr:nth-child(even) td {
      background: #faf7ec;
    }

    .rank-badge {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--gold);
      background: #fff8dc;
      font-weight: 800;
      color: #1a1200;
      margin: auto;
    }

    .player-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 40px;
      color: #111111;
    }

    .player-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--gold);
      display: none;
    }

    .points,
    .movement {
      font-weight: 700;
      font-size: 40px;
      color: #111111;
    }

    .last-updated {
      padding: 14px 20px;
      color: #5a4400;
      font-size: .8rem;
      background: #fdf5e0;
    }

    body {
      zoom: .78
    }
  </style>
</head>

<body>
  <div class="wrap">

    <section class="leader-showcase" id="leaderShowcase"></section>

    <section class="board-card">
      <div class="board-head">
        <div class="board-title">
          <h2>Full Standings</h2>
          <span>Click a column header to change the leaderboard</span>
        </div>
        <div class="status" id="statusText">Loading leaderboard…</div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th id="sortNight" class="sortable">Points for the Night</th>
            <th id="sortSeason" class="sortable">Season Points</th>
          </tr>
        </thead>
        <tbody id="leaderboardBody">
          <tr>
            <td colspan="4">Waiting for data…</td>
          </tr>
        </tbody>
      </table>

      <div class="last-updated" id="lastUpdated">Last updated: --</div>
    </section>

  </div>

  <script src="https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js"></script>
  <script>
    const CONFIG = {
      sheetId: '1Vm3mf2CBTucA6ejKzhd2irPa8nU08HPgAQqg6E7KPdw',
      gid: '0',
      refreshMs: 60000,
      leaderImageUrl: 'PASTE_OPTIONAL_IMAGE_URL_HERE',
        tickerItems: [
        'Sup Actrs: Amy Madigan', 
        'An. Feat: KPop',
        'An. Shrt: Girl Who Cried Pearls',
        'Costume Design: Frankenstein',
         'Makeup & Hairstyling: Frankenstein',
          'Casting: One Battle After Another',
          'Suporting Actor: Sean Penn',
          'Live Act. Shrt: Tie',
          'Adapted Screenplay: OBAA',
          'Original Screenplay: Sinners',
          'Production Design: Frankenstein'
        
      ]
    };

    const state = {
      sortBy: 'night',
      sortDirection: 'desc',
      rawData: []
    };

    function buildVerticalTicker() {
      // Duplicate items so the scroll loops seamlessly
      const items = [...CONFIG.tickerItems, ...CONFIG.tickerItems];
      return items.map(item => `
        <div class="ticker-vert-item">
          <span class="ticker-vert-dot"></span>
          <span>${item}</span>
        </div>`).join('');
    }

    function getCsvUrl() {
      return `https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/export?format=csv&gid=${CONFIG.gid}`;
    }

    function parsePointsValue(value) {
      if (value === null || value === undefined) return 0;
      const cleaned = String(value).trim().replace(/,/g, '');
      if (cleaned === '') return 0;
      const parsed = Number(cleaned);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    function normalizeRow(row) {
      return {
        player: String(row.Player || row.player || '').trim(),
        nightPoints: parsePointsValue(row.NightPoints ?? row['Points for the Night'] ?? row.Points ?? row.points ?? 0),
        seasonPoints: parsePointsValue(row.SeasonPoints ?? row['Season Points'] ?? row['Season Total'] ?? row.TotalPoints ?? row['Total Points'] ?? row.total ?? 0)
      };
    }

    function getSortedData(data) {
      const key = state.sortBy === 'season' ? 'seasonPoints' : 'nightPoints';
      const dir = state.sortDirection === 'asc' ? 1 : -1;
      return [...data].sort((a, b) => {
        const diff = (a[key] - b[key]) * dir;
        if (diff !== 0) return diff;
        const fallback = (b.seasonPoints - a.seasonPoints) * dir;
        if (fallback !== 0 && key !== 'seasonPoints') return fallback;
        return a.player.localeCompare(b.player);
      });
    }

    function updateSortHeaders() {
      const n = document.getElementById('sortNight');
      const s = document.getElementById('sortSeason');
      [n, s].forEach(el => el.classList.remove('active', 'asc', 'desc'));
      const active = state.sortBy === 'season' ? s : n;
      active.classList.add('active', state.sortDirection);
    }

    function renderLeaderShowcase(data) {
      const leader = data[0];
      const container = document.getElementById('leaderShowcase');
      if (!leader) {
        container.innerHTML = '';
        return;
      }
      const primaryLabel = state.sortBy === 'season' ? 'Season Points' : 'Points for the Night';
      const secondaryLabel = state.sortBy === 'season' ? 'Points for the Night' : 'Season Points';
      const primary = state.sortBy === 'season' ? leader.seasonPoints : leader.nightPoints;
      const secondary = state.sortBy === 'season' ? leader.nightPoints : leader.seasonPoints;
      const img = (CONFIG.leaderImageUrl && CONFIG.leaderImageUrl !== 'PASTE_OPTIONAL_IMAGE_URL_HERE')
        ? `<img class="leader-image show" src="${CONFIG.leaderImageUrl}" alt="Leader icon">`
        : '';

      container.innerHTML = `
        <div class="leader-card">

          <!-- LEFT: statuette + info -->
          <div class="leader-left">
            <div class="leader-rank">
              <img src="data:image/jpeg;base64,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">
            </div>
            <div class="leader-info">
              <div class="leader-movement">Current Leader • Sorted by ${primaryLabel}</div>
              <div class="leader-name-row">${img}<div class="leader-name">${leader.player}</div></div>
              <div class="leader-points">${primary} ${primaryLabel}</div>
              <div class="leader-movement">${secondaryLabel}: ${secondary}</div>
            </div>
          </div>

          <!-- RIGHT: vertical scrolling ticker -->
          <div class="ticker-panel">
            <div class="ticker-panel-label">Oscar Winners</div>
            <div class="ticker-vert-wrap">
              <div class="ticker-vert-track" id="tickerVertTrack"></div>
            </div>
          </div>

        </div>`;

      // Populate the vertical ticker
      document.getElementById('tickerVertTrack').innerHTML = buildVerticalTicker();
    }

    function renderTable(data) {
      const tbody = document.getElementById('leaderboardBody');
      if (!data.length) {
        tbody.innerHTML = '<tr><td colspan="4">No leaderboard rows found.</td></tr>';
        return;
      }
      tbody.innerHTML = data.map((p, i) => `
        <tr>
          <td><span class="rank-badge">${i + 1}</span></td>
          <td><div class="player-cell"><span class="player-dot"></span>${p.player}</div></td>
          <td class="points">${p.nightPoints}</td>
          <td class="movement">${p.seasonPoints}</td>
        </tr>`).join('');
    }

    function renderAll() {
      const sorted = getSortedData(state.rawData);
      updateSortHeaders();
      renderLeaderShowcase(sorted);
      renderTable(sorted);
      document.getElementById('statusText').textContent =
        `Showing ${state.rawData.length} players • sorted by ${state.sortBy === 'season' ? 'season points' : 'points for the night'}`;
    }

    function setSort(key) {
      if (state.sortBy === key) {
        state.sortDirection = state.sortDirection === 'desc' ? 'asc' : 'desc';
      } else {
        state.sortBy = key;
        state.sortDirection = 'desc';
      }
      renderAll();
    }

    function setupSorting() {
      document.getElementById('sortNight').onclick = () => setSort('night');
      document.getElementById('sortSeason').onclick = () => setSort('season');
    }

    async function loadLeaderboard() {
      if (!CONFIG.sheetId || CONFIG.sheetId === 'PASTE_YOUR_SHEET_ID_HERE') return;
      try {
        const res = await fetch(getCsvUrl(), { cache: 'no-store' });
        const csv = await res.text();
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
        state.rawData = parsed.data.map(normalizeRow).filter(r => r.player);
        renderAll();
        document.getElementById('lastUpdated').textContent = `Last updated: ${new Date().toLocaleString()}`;
      } catch (error) {
        console.error(error);
        document.getElementById('statusText').textContent = 'Could not load Google Sheet data.';
      }
    }

    setupSorting();
    loadLeaderboard();
    setInterval(loadLeaderboard, CONFIG.refreshMs);
  </script>
</body>

</html>
