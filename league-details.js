/* League detail views. No points, past results, or event dates are invented. */
const leagueDetails = { movies: state.movieRows || [], events: [], rosters: [], snapshots: [] };

function leagueKey(value) {
  const key = String(value || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]/g, '');
  return ({ dunepart3: 'dunepartthree', raygun: 'raygunn', wills: 'will', tims: 'tim' })[key] || key;
}

function leagueNode(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function leagueDate(value) {
  const raw = String(value || '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const date = new Date(raw + 'T12:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === raw ? raw : null;
}

function leagueNumber(value) {
  const text = String(value ?? '').trim().replace(/,/g, '');
  return text && /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text) ? Number(text) : null;
}

function leagueMovie(title) {
  return leagueDetails.movies.find(row => leagueKey(row.movie) === leagueKey(title));
}

function leagueOwners(title) {
  return leagueDetails.rosters.filter(team => team.films.some(film => leagueKey(film) === leagueKey(title)));
}

function leagueFilmPanel(title) {
  const details = leagueNode('details', undefined, 'film-details');
  const movie = leagueMovie(title);
  const summary = leagueNode('summary');
  summary.append(leagueNode('span', title), leagueNode('strong', movie ? movie.points.toLocaleString() + ' pts' : 'Score unavailable'));
  details.append(summary);
  const content = leagueNode('div', undefined, 'detail-content');
  const owners = leagueOwners(title).map(team => team.owner);
  content.append(leagueNode('p', 'Drafted by: ' + (owners.join(', ') || 'No roster match')));
  const events = leagueDetails.events.filter(event => leagueKey(event.movie) === leagueKey(title));
  if (events.length) {
    const list = leagueNode('ul');
    events.forEach(event => list.append(leagueNode('li', `${event.date} · ${event.event}${event.category ? ' · ' + event.category : ''}${event.result ? ' · ' + event.result : ''} · ${event.points > 0 ? '+' : ''}${event.points} pts`)));
    content.append(leagueNode('p', 'Recorded scoring activity (may not include every component of the movie total):'), list);
  } else content.append(leagueNode('p', 'No award-by-award scoring activity recorded yet.'));
  const links = Array.from(document.querySelectorAll('#newsGrid h3 a')).filter(link => leagueKey(link.textContent).includes(leagueKey(title)));
  if (links.length) {
    content.append(leagueNode('p', 'Related league news'));
    links.forEach(link => {
      const news = leagueNode('a', link.textContent);
      news.href = link.href; news.target = '_blank'; news.rel = 'noopener noreferrer';
      content.append(news);
    });
  }
  details.append(content);
  return details;
}

function renderLeagueTeams() {
  leagueDetails.rosters.forEach(team => {
    const wasOpen = team.details.open;
    const openFilms = new Set(Array.from(team.content.querySelectorAll('details[open] summary span')).map(node => node.textContent));
    team.content.replaceChildren();
    const player = state.playersAreLive && state.players.find(row =>
      leagueKey(row.player) === leagueKey(team.owner) || leagueKey(row.player) === leagueKey(team.name));
    if (player) {
      const rank = 1 + state.players.filter(row => totalFor(row) > totalFor(player)).length;
      team.content.append(leagueNode('p', `League rank ${rank} · ${totalFor(player).toLocaleString()} total points`, 'team-score'));
    }
    const films = team.films.slice().sort((a, b) => (leagueMovie(b)?.points ?? -Infinity) - (leagueMovie(a)?.points ?? -Infinity));
    const known = films.filter(title => leagueMovie(title));
    team.content.append(leagueNode('p', `${films.length} drafted films · Scores available for ${known.length}`, 'status-line'));
    films.forEach(title => {
      const panel = leagueFilmPanel(title);
      panel.open = openFilms.has(title);
      team.content.append(panel);
    });
    team.details.open = wasOpen;
  });
}

function setupLeagueTeams() {
  document.querySelectorAll('#draft .feature-card').forEach(card => {
    const label = card.querySelector('span').textContent;
    const name = card.querySelector('h3').textContent;
    const films = card.querySelector('p').textContent.split(' - ').map(title => title.trim()).filter(Boolean);
    const owner = label.replace(/(?:'s|') Team$/, '');
    const details = leagueNode('details', undefined, 'team-details');
    const summary = leagueNode('summary');
    summary.append(leagueNode('span', label), leagueNode('h3', name), leagueNode('span', 'View team & film scores', 'team-hint'));
    const content = leagueNode('div', undefined, 'team-content');
    details.append(summary, content); card.replaceChildren(details);
    leagueDetails.rosters.push({ owner, name, films, details, content });
  });
  renderLeagueTeams();
}

async function leagueSheet(tab, required) {
  const response = await fetch(`https://docs.google.com/spreadsheets/d/${CONFIG.sheetId}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`, {cache:'no-store', signal:AbortSignal.timeout(15000)});
  if (!response.ok) throw new Error('Sheet unavailable');
  const text = await response.text();
  if (/^\s*</.test(text)) throw new Error('Sheet is not publicly readable');
  const parsed = Papa.parse(text, {header:true, skipEmptyLines:'greedy', transformHeader:header => header.trim().toLowerCase()});
  if (!required.every(header => (parsed.meta.fields || []).includes(header))) throw new Error('Sheet headers do not match');
  if (parsed.errors.some(error => error.type !== 'FieldMismatch')) throw new Error('Sheet could not be read');
  return parsed.data;
}

async function loadLeagueActivity() {
  const status = document.getElementById('scoringActivityStatus');
  try {
    const rows = await leagueSheet(CONFIG.scoringActivityTab, ['date','movie','event','points']);
    leagueDetails.events = rows.map(row => ({date:leagueDate(row.date), movie:String(row.movie || '').trim(), event:String(row.event || '').trim(), points:leagueNumber(row.points), category:String(row.category || '').trim(), result:String(row.result || '').trim()}))
      .filter(row => row.date && row.movie && row.event && row.points !== null).sort((a,b) => b.date.localeCompare(a.date));
    const list = document.getElementById('scoringActivityList');
    list.replaceChildren();
    leagueDetails.events.slice(0,12).forEach(event => {
      const card = leagueNode('article', undefined, 'activity-card');
      const time = leagueNode('time', event.date); time.dateTime = event.date;
      card.append(time, leagueNode('h3', event.movie), leagueNode('p', [event.event,event.category,event.result].filter(Boolean).join(' · ')), leagueNode('strong', `${event.points > 0 ? '+' : ''}${event.points} pts`));
      card.append(leagueNode('p', 'Teams: ' + (leagueOwners(event.movie).map(team=>team.owner).join(', ') || 'No roster match')));
      list.append(card);
    });
    status.textContent = leagueDetails.events.length ? 'Latest recorded scoring events · Refresh for updates.' : 'No scoring activity has been recorded yet.';
    renderLeagueTeams(); renderLeagueFilmBrowser();
  } catch(error) {
    status.textContent = 'Scoring activity is not available yet.';
    console.info('Scoring activity:', error.message);
  }
}

let leagueFilmPage = 1;

function renderLeagueFilmBrowser() {
  const container = document.getElementById('filmDetailsList');
  const open = new Set(Array.from(container.querySelectorAll('details[open] summary span')).map(node=>node.textContent));
  const query = leagueKey(document.getElementById('filmSearch').value);
  const films = new Map();
  leagueDetails.rosters.forEach(team=>team.films.forEach(title=>films.set(leagueKey(title),title)));
  leagueDetails.movies.forEach(movie=>films.set(leagueKey(movie.movie), movie.movie));
  container.replaceChildren();
  const titles = Array.from(films.values()).filter(title=>leagueKey(title).includes(query)).sort((a,b)=>a.localeCompare(b));
  const pageSize = 10;
  const pageCount = Math.ceil(titles.length / pageSize);
  leagueFilmPage = Math.max(1, Math.min(leagueFilmPage, pageCount || 1));
  const start = (leagueFilmPage - 1) * pageSize;
  titles.slice(start, start + pageSize).forEach(title=>{ const panel=leagueFilmPanel(title); panel.open=open.has(title); container.append(panel); });
  const pagination = document.getElementById('filmDetailsPagination');
  pagination.replaceChildren();
  pagination.hidden = pageCount <= 1;
  for (let number = 1; number <= pageCount; number++) {
    const button = leagueNode('button', String(number));
    button.type = 'button';
    button.setAttribute('aria-label', `Page ${number}, films ${(number - 1) * pageSize + 1}–${Math.min(number * pageSize, titles.length)}`);
    button.setAttribute('aria-controls', 'filmDetailsList');
    if (number === leagueFilmPage) button.setAttribute('aria-current', 'page');
    button.addEventListener('click', () => {
      leagueFilmPage = number;
      renderLeagueFilmBrowser();
      pagination.querySelector('[aria-current="page"]').focus();
    });
    pagination.append(button);
  }
  document.getElementById('filmSearchStatus').textContent = titles.length
    ? `Showing films ${start + 1}–${Math.min(start + pageSize, titles.length)} of ${titles.length} · Select a film for details.`
    : 'No films match your search.';
}

function rankLeagueSnapshot(rows) {
  const ranked=rows.slice().sort((a,b)=>b.total-a.total);
  let rank=0;
  return ranked.map((row,index)=> { if (!index || row.total!==ranked[index-1].total) rank=index+1; return {...row,rank}; });
}

function renderLeagueMovement() {
  const container=document.getElementById('standingsMovementList'); container.replaceChildren();
  const status=document.getElementById('standingsMovementStatus');
  if (!state.playersAreLive || !leagueDetails.snapshots.length) {
    status.textContent='Standings movement will appear when live standings and a previous checkpoint are available.'; return;
  }
  const today=new Date().toLocaleDateString('en-CA',{timeZone:'America/New_York'});
  const dates=[...new Set(leagueDetails.snapshots.map(row=>row.date).filter(date=>date<today))].sort().reverse();
  if (!dates.length) { status.textContent='Add a checkpoint dated before today to compare standings.'; return; }
  const prior=rankLeagueSnapshot(leagueDetails.snapshots.filter(row=>row.date===dates[0]));
  const current=rankLeagueSnapshot(state.players.map(row=>({player:row.player,total:totalFor(row)})));
  current.forEach(row=>{
    const before=prior.find(previous=>leagueKey(previous.player)===leagueKey(row.player));
    const delta=before ? before.rank-row.rank : null;
    const text=delta===null?'No previous record':delta>0?`↑ Up ${delta}`:delta<0?`↓ Down ${-delta}`:'— No change';
    const item=leagueNode('p',undefined,'movement-row');
    item.append(leagueNode('span',`${row.rank}. ${row.player}`),leagueNode('strong',text)); container.append(item);
  });
  status.textContent=`Compared with checkpoint ${dates[0]}.`;
}

async function loadLeagueExtras() {
  try {
    const rows = await leagueSheet('Standings History', ['date', 'player', 'total']);
    leagueDetails.snapshots = rows.map(row => ({
      date: leagueDate(row.date),
      player: String(row.player || '').trim(),
      total: leagueNumber(row.total)
    })).filter(row => row.date && row.player && row.total !== null);
    renderLeagueMovement();
  } catch {
    document.getElementById('standingsMovementStatus').textContent =
      'Standings movement will appear once previous checkpoints are available.';
  }
}

setupLeagueTeams();
renderLeagueFilmBrowser();
document.getElementById('filmSearch').addEventListener('input', () => {
  leagueFilmPage = 1;
  renderLeagueFilmBrowser();
});
document.addEventListener('league-movies-updated',event=>{leagueDetails.movies=event.detail;renderLeagueTeams();renderLeagueFilmBrowser();});
document.addEventListener('league-standings-updated',()=>{renderLeagueTeams();renderLeagueMovement();});
document.addEventListener('league-news-updated',()=>{renderLeagueTeams();renderLeagueFilmBrowser();});
loadLeagueActivity();
loadLeagueExtras();

// Movie leaderboard links open the matching film detail panel.
document.getElementById('movieLeaderboardBody').addEventListener('click', event => {
  const link = event.target.closest('[data-film-title]');
  if (!link) return;
  document.getElementById('filmSearch').value = link.dataset.filmTitle;
  leagueFilmPage = 1;
  renderLeagueFilmBrowser();
  const panel = document.querySelector('#filmDetailsList details');
  if (panel) panel.open = true;
});
