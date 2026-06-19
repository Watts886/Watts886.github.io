/*
  =========================================================
  DEVELOPER-ONLY FEATURE TOGGLES
  =========================================================
  These settings are intentionally NOT user-facing.
  Change true/false values here when you are ready to reveal
  parts of the Oscar League site later in the season.

  Recommended early-season setup:
  - showAwardsSection: false
  - showOscarNightFilter: false
  - showBonusPointsFilter: false
  - showOscarNightColumn: false
  - showBonusPointsColumn: false

  Later in the season, flip any of these to true.
*/
const FEATURE_TOGGLES = {
  showAwardsSection: false,
  showOscarNightFilter: false,
  showBonusPointsFilter: false,
  showOscarNightColumn: false,
  showBonusPointsColumn: false,
};

const players = [
  { name: 'Bobby', seasonPoints: 640, nightPoints: 120, bonusPoints: 55, bestPick: 'Smashing Machine' },
  { name: 'Megan', seasonPoints: 602, nightPoints: 135, bonusPoints: 35, bestPick: 'OBAA' },
  { name: 'Chris', seasonPoints: 575, nightPoints: 95, bonusPoints: 70, bestPick: 'OBAA' },
  { name: 'Alex', seasonPoints: 548, nightPoints: 110, bonusPoints: 40, bestPick: 'Wicked' },
  { name: 'Jordan', seasonPoints: 521, nightPoints: 88, bonusPoints: 65, bestPick: 'OBAA' },
  { name: 'Taylor', seasonPoints: 496, nightPoints: 76, bonusPoints: 30, bestPick: 'Sinners' },
  { name: 'Sam', seasonPoints: 472, nightPoints: 140, bonusPoints: 25, bestPick: 'Sentimental Value' },
  { name: 'Casey', seasonPoints: 438, nightPoints: 66, bonusPoints: 45, bestPick: 'Sinners' }
];

const categories = [
  { name: 'Best Picture', first: 80, second: 40 },
  { name: 'Best Director', first: 60, second: 30 },
  { name: 'Best Actor', first: 60, second: 30 },
  { name: 'Best Actress', first: 60, second: 30 },
  { name: 'Supporting Actor', first: 40, second: 20 },
  { name: 'Supporting Actress', first: 40, second: 20 },
  { name: 'Cinematography', first: 30, second: 15 },
  { name: 'Animated Feature', first: 30, second: 15 },
  { name: 'Adapted Screenplay', first: 30, second: 15 },
  { name: 'Original Screenplay', first: 30, second: 15 },
  { name: 'Production Design', first: 20, second: 10 },
  { name: 'Visual Effects', first: 20, second: 10 },
  { name: 'International Feature', first: 10, second: 5 },
  { name: 'Documentary Feature', first: 10, second: 5 },
  { name: 'Animated Short', first: 10, second: 5 },
  { name: 'Live Action Short', first: 10, second: 5 }
];

let currentSort = 'seasonPoints';

const columns = [
  { key: 'rank', label: 'Rank', visible: true },
  { key: 'name', label: 'Player', visible: true },
  { key: 'seasonPoints', label: 'Season', visible: true },
  { key: 'nightPoints', label: 'Oscar Night', visible: FEATURE_TOGGLES.showOscarNightColumn },
  { key: 'bonusPoints', label: 'Bonus', visible: FEATURE_TOGGLES.showBonusPointsColumn },
  { key: 'bestPick', label: 'Current Best Pick', visible: true }
];

function isSortVisible(sortKey) {
  if (sortKey === 'seasonPoints') return true;
  if (sortKey === 'nightPoints') return FEATURE_TOGGLES.showOscarNightFilter;
  if (sortKey === 'bonusPoints') return FEATURE_TOGGLES.showBonusPointsFilter;
  return false;
}

function applyFeatureToggles() {
  const awardsSection = document.getElementById('awards');
  const awardsNavLink = document.querySelector('a[href="#awards"]');
  const nightTab = document.querySelector('[data-sort="nightPoints"]');
  const bonusTab = document.querySelector('[data-sort="bonusPoints"]');

  if (awardsSection) awardsSection.hidden = !FEATURE_TOGGLES.showAwardsSection;
  if (awardsNavLink) awardsNavLink.hidden = !FEATURE_TOGGLES.showAwardsSection;
  if (nightTab) nightTab.hidden = !FEATURE_TOGGLES.showOscarNightFilter;
  if (bonusTab) bonusTab.hidden = !FEATURE_TOGGLES.showBonusPointsFilter;

  if (!isSortVisible(currentSort)) currentSort = 'seasonPoints';
}

function renderTableHeader() {
  const headerRow = document.getElementById('leaderboardHeaderRow');
  headerRow.innerHTML = columns
    .filter(column => column.visible)
    .map(column => `<th>${column.label}</th>`)
    .join('');
}

function getColumnValue(player, column, index) {
  const values = {
    rank: `<span class="rank">#${index + 1}</span>`,
    name: `<span class="player">${player.name}</span>`,
    seasonPoints: player.seasonPoints,
    nightPoints: player.nightPoints,
    bonusPoints: player.bonusPoints,
    bestPick: player.bestPick
  };

  return values[column.key];
}

function renderLeaderboard() {
  const sorted = [...players].sort((a, b) => b[currentSort] - a[currentSort]);
  const leader = sorted[0];

  document.getElementById('leaderName').textContent = leader.name;
  document.getElementById('totalPlayers').textContent = players.length;
  document.getElementById('totalFilms').textContent = players.length * 3;

  document.getElementById('leaderCard').innerHTML = `
    <div>
      <p class="eyebrow">Current Leader</p>
      <h3>${leader.name}</h3>
      <p>${leader.bestPick}</p>
    </div>
    <div class="leader-score">${leader[currentSort]}</div>
  `;

  document.getElementById('leaderboardRows').innerHTML = sorted.map((player, index) => `
    <tr>
      ${columns
        .filter(column => column.visible)
        .map(column => `<td>${getColumnValue(player, column, index)}</td>`)
        .join('')}
    </tr>
  `).join('');
}

function renderCategories() {
  const awardGrid = document.getElementById('awardGrid');
  if (!awardGrid || !FEATURE_TOGGLES.showAwardsSection) return;

  awardGrid.innerHTML = categories.map(category => `
    <article class="award-card">
      <h3>${category.name}</h3>
      <p>Choice 1 and Choice 2 scoring values.</p>
      <div class="award-points">
        <span>1st: ${category.first}</span>
        <span>2nd: ${category.second}</span>
      </div>
    </article>
  `).join('');
}

function activateSortButton(sortKey) {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.sort === sortKey);
  });
}

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    currentSort = tab.dataset.sort;
    activateSortButton(currentSort);
    renderLeaderboard();
  });
});

applyFeatureToggles();
activateSortButton(currentSort);
renderTableHeader();
renderLeaderboard();
renderCategories();
