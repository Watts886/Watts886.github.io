/****************************************************************
 SILVERCAL SCREENERS OSCAR LEAGUE — SCRIPT.JS
 ---------------------------------------------------------------
 Developer-only controls live in the first two objects below.
****************************************************************/

const DEV_FEATURES = {
  showAwardsSection: true,
  showRulesSection: true,
  showOscarNightSection: true,
  showBonusPointsColumn: true,
  showOscarNightColumn: true
};

const CONFIG = {
  sheetId: 'NEEDED',
  standingsGid: '0',
  refreshMs: 60000,
  oscarNightDate: '2027-03-14T20:00:00-04:00'
};

const FALLBACK_PLAYERS = [
  { player: 'Bobby', season: 135, bonus: 0, oscarNight: 0 },
  { player: 'Haley', season: 128, bonus: 0, oscarNight: 0 },
  { player: 'Liz', season: 112, bonus: 0, oscarNight: 0 },
  { player: 'Tim', season: 98, bonus: 0, oscarNight: 0 },
  { player: 'Sarah', season:95, bonus: 0, oscarNight: 0 },
  { player: 'Katie', season: 90, bonus: 0, oscarNight: 0},
  { player: 'Bessie', season: 85, bonus: 0, oscarNight: 0}
];

const RULES = [
  { title: 'Draft budget', text: 'Each player builds a roster from the eligible film pool while remaining under the league budget of $100.' },
  { title: 'Season points', text: 'Box Office: <br> Movies released Sept. 26 or later earn 1 point per $1M domestic box office, milestone bonuses up to +25 points (through $200M), and +20 points for every week at No. 1. <br><br> Critical Reception: <br> Movies earn -5 to 100 points based on their Metacritic score. Scores are locked in on January 6 and only apply to films released by that date. <br><br>Awards Season: <br>Movies earn points for nominations and wins across the entire awards season (Gotham, Critics Choice, Golden Globes, SAG, DGA, PGA, BAFTA, WGA, Spirit Awards, Oscars, and more). Bigger awards and major categories are worth more. <br><br> Oscar Bonus:<br> The Academy Awards are the highest-value event, with 100 points for Best Picture, 75 points for major categories, and 50 points for technical categories.' },
  { title: 'Bonus points', text: 'Commissioner-defined prizes may reward box-office leaders, overlooked value picks and midseason performances.' },
  { title: 'Oscar Night', text: 'Oscar Night selections for all categories added to season totals, more prestige "above the line" awards give more points. ' }
];

const state = { players: [], sortDirection: 'desc' };

function getCsvUrl() {
  return `https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/export?format=csv&gid=${CONFIG.standingsGid}`;
}

function numberFrom(value) {
  const cleaned = String(value ?? '').replace(/[^0-9.-]/g, '');
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function firstValue(row, names) {
  for (const name of names) {
    if (row[name] !== undefined && row[name] !== '') return row[name];
  }
  return '';
}

function normalizeRow(row) {
  return {
    player: String(firstValue(row, ['Player', 'Team', 'Name', 'Player Name']) || 'Unnamed Player').trim(),
    season: numberFrom(firstValue(row, ['Season Points', 'SeasonPoints', 'Season Total', 'Points'])),
    bonus: numberFrom(firstValue(row, ['Bonus Points', 'BonusPoints', 'Bonus'])),
    oscarNight: numberFrom(firstValue(row, ['Oscar Night', 'Oscar Night Points', 'OscarNight']))
  };
}

function totalFor(player) {
  return player.season +
    (DEV_FEATURES.showBonusPointsColumn ? player.bonus : 0) +
    (DEV_FEATURES.showOscarNightColumn ? player.oscarNight : 0);
}

function sortedPlayers() {
  const direction = state.sortDirection === 'desc' ? -1 : 1;
  return [...state.players].sort((a, b) => (totalFor(a) - totalFor(b)) * direction);
}

function applyFeatureToggles() {
  document.querySelectorAll('[data-feature="awards"], [data-feature-link="awards"]').forEach(el => el.hidden = !DEV_FEATURES.showAwardsSection);
  document.querySelectorAll('[data-feature="rules"], [data-feature-link="rules"]').forEach(el => el.hidden = !DEV_FEATURES.showRulesSection);
  document.querySelectorAll('[data-feature="oscarNight"], [data-feature-link="oscarNight"]').forEach(el => el.hidden = !DEV_FEATURES.showOscarNightSection);
  document.querySelectorAll('.bonus-column').forEach(el => el.hidden = !DEV_FEATURES.showBonusPointsColumn);
  document.querySelectorAll('.oscar-night-column').forEach(el => el.hidden = !DEV_FEATURES.showOscarNightColumn);
}

function renderRules() {
  document.getElementById('rulesList').innerHTML = RULES.map(rule => `
    <details>
      <summary>${rule.title}</summary>
      <p>${rule.text}</p>
    </details>`).join('');
}

function renderStandings() {
  const players = sortedPlayers();
  const leader = players[0];

  document.getElementById('leaderShowcase').innerHTML = leader ? `
    <div>
      <span class="leader-eyebrow">Current leader</span>
      <h3>${leader.player}</h3>
      <p>${totalFor(leader)} total points</p>
    </div>` : '<div><h3>No standings yet</h3></div>';

  document.getElementById('mobileScoreCards').innerHTML = players.map((player, index) => `
    <article class="score-row">
      <span class="rank-badge">${index + 1}</span>
      <div class="score-player">
        <strong>${player.player}</strong>
        <span>${player.season} season${DEV_FEATURES.showBonusPointsColumn ? ` • ${player.bonus} bonus` : ''}${DEV_FEATURES.showOscarNightColumn ? ` • ${player.oscarNight} Oscar Night` : ''}</span>
      </div>
      <span class="score-total">${totalFor(player)}</span>
    </article>`).join('');

  const visibleColumnCount = 4 + Number(DEV_FEATURES.showBonusPointsColumn) + Number(DEV_FEATURES.showOscarNightColumn);
  document.getElementById('leaderboardBody').innerHTML = players.length ? players.map((player, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${player.player}</td>
      <td>${player.season}</td>
      <td class="bonus-column" ${DEV_FEATURES.showBonusPointsColumn ? '' : 'hidden'}>${player.bonus}</td>
      <td class="oscar-night-column" ${DEV_FEATURES.showOscarNightColumn ? '' : 'hidden'}>${player.oscarNight}</td>
      <td>${totalFor(player)}</td>
    </tr>`).join('') : `<tr><td colspan="${visibleColumnCount}">No leaderboard rows found.</td></tr>`;

  document.getElementById('memberCount').textContent = players.length;
  document.getElementById('statusText').textContent = `${players.length} players • sorted ${state.sortDirection === 'desc' ? 'highest to lowest' : 'lowest to highest'}`;
}

function updateCountdown() {
  const target = new Date(CONFIG.oscarNightDate);
  const diff = target.getTime() - Date.now();
  document.getElementById('daysToOscar').textContent = Number.isFinite(diff) ? Math.max(0, Math.ceil(diff / 86400000)) : '—';
}

async function loadLeaderboard() {
  try {
    const response = await fetch(getCsvUrl(), { cache: 'no-store' });
    if (!response.ok) throw new Error(`Sheet request failed: ${response.status}`);
    const csv = await response.text();
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
    const rows = parsed.data.map(normalizeRow).filter(row => row.player && row.player !== 'Unnamed Player');
    state.players = rows.length ? rows : FALLBACK_PLAYERS;
    renderStandings();
    document.getElementById('statusText').textContent += ` • updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
  } catch (error) {
    console.warn('Using fallback standings:', error);
    state.players = FALLBACK_PLAYERS;
    renderStandings();
    document.getElementById('statusText').textContent += ' • sample data shown';
  }
}

function setupNavigation() {
  const button = document.getElementById('menuButton');
  const nav = document.getElementById('mobileNav');
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    button.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }));
}

function setupSorting() {
  const header = document.getElementById('sortSeason');
  const toggleSort = () => {
    state.sortDirection = state.sortDirection === 'desc' ? 'asc' : 'desc';
    renderStandings();
  };
  header.addEventListener('click', toggleSort);
  header.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') toggleSort();
  });
}

applyFeatureToggles();
renderRules();
setupNavigation();
setupSorting();
updateCountdown();
loadLeaderboard();
setInterval(loadLeaderboard, CONFIG.refreshMs);
