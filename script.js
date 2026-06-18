const players = [
  { name: 'Bobby', seasonPoints: 640, nightPoints: 120, bonusPoints: 55, bestPick: 'Best Picture winner' },
  { name: 'Megan', seasonPoints: 602, nightPoints: 135, bonusPoints: 35, bestPick: 'Best Actress sweep' },
  { name: 'Chris', seasonPoints: 575, nightPoints: 95, bonusPoints: 70, bestPick: 'Box office monster' },
  { name: 'Alex', seasonPoints: 548, nightPoints: 110, bonusPoints: 40, bestPick: 'Animated Feature' },
  { name: 'Jordan', seasonPoints: 521, nightPoints: 88, bonusPoints: 65, bestPick: 'BAFTA heater' },
  { name: 'Taylor', seasonPoints: 496, nightPoints: 76, bonusPoints: 30, bestPick: 'Supporting Actor' },
  { name: 'Sam', seasonPoints: 472, nightPoints: 140, bonusPoints: 25, bestPick: 'Oscar night surge' },
  { name: 'Casey', seasonPoints: 438, nightPoints: 66, bonusPoints: 45, bestPick: 'Biggest flop bonus' }
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
      <td class="rank">#${index + 1}</td>
      <td class="player">${player.name}</td>
      <td>${player.seasonPoints}</td>
      <td>${player.nightPoints}</td>
      <td>${player.bonusPoints}</td>
      <td>${player.bestPick}</td>
    </tr>
  `).join('');
}

function renderCategories() {
  document.getElementById('awardGrid').innerHTML = categories.map(category => `
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

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentSort = tab.dataset.sort;
    renderLeaderboard();
  });
});

renderLeaderboard();
renderCategories();
