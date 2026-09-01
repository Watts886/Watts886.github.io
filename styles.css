/****************************************************************
 SILVERCAL SCREENERS OSCAR LEAGUE — SCRIPT.JS
 ---------------------------------------------------------------
 Developer-only controls live in the first two objects below.

 IMPORTANT DATA BEHAVIOR:
 - Leaderboard loads from Google Sheets once when the page opens.
 - Oscar Odds load from Google Sheets once when the page opens.
 - Neither section automatically refreshes.
 - After updating Google Sheets, refresh the webpage.
****************************************************************/


/****************************************************************
 SECTION 1 — DEVELOPER FEATURE TOGGLES
 ---------------------------------------------------------------
 Change a value from true to false to hide that feature.
****************************************************************/

const DEV_FEATURES = {

  // Show or hide the Awards section.
  showAwardsSection: true,

  // Show or hide the Rules section.
  showRulesSection: true,

  // Show or hide the Oscar Night section.
  showOscarNightSection: true,

  // Show or hide Bonus Points in the leaderboard.
  showBonusPointsColumn: true,

  // Show or hide Oscar Night points in the leaderboard.
  showOscarNightColumn: true,

  // Show or hide the Awards Odds section and navigation link.
  showAwardsOddsSection: true

};


/****************************************************************
 SECTION 2 — GOOGLE SHEETS CONFIGURATION
 ---------------------------------------------------------------

 sheetId:
 Identifies the entire Google Sheets workbook.

 standingsGid:
 Identifies the Leaderboard tab.

 oddsGid:
 Identifies the Oscar Odds tab.

 Both tabs can live inside the SAME Google Sheets workbook.
****************************************************************/

const CONFIG = {

  // Your current Google Sheets workbook ID.
  sheetId: '1ARgMPO4XZMIfCbASiBOjZGSsjzBylDnWeJTJIP7Uh0o',

  // Leaderboard tab GID.
  standingsGid: '0',

  // Oscar Odds tab GID.
  oddsGid: '669695369',

  // Automatic refreshing is currently disabled.
  // This value is retained only in case you want to restore
  // timed refreshing later.
  refreshMs: 60000,

  // Oscar Night date used by the countdown.
  oscarNightDate: '2027-03-14T20:00:00-04:00'

};


/****************************************************************
 SECTION 3 — AWARDS ODDS CATEGORY ORDER
 ---------------------------------------------------------------
 This controls the preferred order of the Oscar Odds cards.

 Any category that exists in Google Sheets but is NOT included
 here will still display after these categories.
****************************************************************/

const ODDS_CATEGORY_ORDER = [

  'Actor',

  'Picture',

  'Actress',

  'Supp. Actor',

  'Supp. Actress',

  'Director',

  'Adapted Screenplay',

  'Original Screenplay',

  'Original Song'

];


/****************************************************************
 SECTION 4 — OPTIONAL FALLBACK AWARDS ODDS
 ---------------------------------------------------------------
 Normally Awards Odds come directly from Google Sheets.

 This data is retained ONLY as a fallback if the Google Sheet
 cannot be reached.

 Keeping this also prevents the Awards Odds area from appearing
 completely empty if Google temporarily fails.
****************************************************************/

const FALLBACK_AWARDS_ODDS = [

  {
    category: 'Actor',
    nominees: [
      { name: 'Tom Cruise', odds: 87.9 },
      { name: 'John Malkovich', odds: 82.0 },
      { name: 'Ryan Gosling', odds: 70.3 }
    ]
  },

  {
    category: 'Picture',
    nominees: [
      { name: 'Project Hail Mary', odds: 92.3 },
      { name: 'The Odyssey', odds: 88.0 },
      { name: 'Wild Horse Nine', odds: 86.5 }
    ]
  },

  {
    category: 'Actress',
    nominees: [
      { name: 'Julianne Moore', odds: 89.6 },
      { name: 'Renate Reinsve', odds: 75.2 },
      { name: 'Michelle Williams', odds: 69.4 }
    ]
  },

  {
    category: 'Supp. Actor',
    nominees: [
      { name: 'Paul Giamatti', odds: 89.9 },
      { name: 'John Goodman', odds: 85.6 },
      { name: 'Sam Rockwell', odds: 80.6 }
    ]
  },

  {
    category: 'Supp. Actress',
    nominees: [
      { name: 'Penelope Cruz', odds: 79.3 },
      { name: 'Anne Hathaway', odds: 78.7 },
      { name: 'Mariana Di Girolamo', odds: 75.4 }
    ]
  },

  {
    category: 'Director',
    nominees: [
      { name: 'Christopher Nolan', odds: 85.8 },
      { name: 'Alejandro G. Iñárritu', odds: 79.2 },
      { name: 'Javier Ambrossi, Javier Calvo', odds: 70.4 }
    ]
  },

  {
    category: 'Adapted Screenplay',
    nominees: [
      { name: 'Project Hail Mary', odds: 91.8 },
      { name: 'La Bola Negra', odds: 87.1 },
      { name: 'The Odyssey', odds: 83.8 }
    ]
  },

  {
    category: 'Original Screenplay',
    nominees: [
      { name: 'Wild Horse Nine', odds: 91.4 },
      { name: 'The Debut', odds: 84.6 },
      { name: 'Digger', odds: 84.3 }
    ]
  },

  {
    category: 'Original Song',
    nominees: [
      {
        name: 'I Knew It, I Knew You - Toy Story 5',
        odds: 98.4
      },
      {
        name: 'La Nieve - La Bola Negra',
        odds: 84.6
      },
      {
        name: 'By Any Means - By Any Means',
        odds: 82.3
      }
    ]
  }

];


/****************************************************************
 SECTION 5 — FALLBACK LEADERBOARD PLAYERS
 ---------------------------------------------------------------
 Used only if the Leaderboard Google Sheet cannot be loaded.
****************************************************************/

const FALLBACK_PLAYERS = [

  {
    player: 'Liz',
    season: 2135,
    bonus: 0,
    oscarNight: 0
  },

  {
    player: 'Tim',
    season: 2128,
    bonus: 0,
    oscarNight: 0
  },

  {
    player: 'Sarah',
    season: 2112,
    bonus: 0,
    oscarNight: 0
  },

  {
    player: 'Katie',
    season: 1198,
    bonus: 0,
    oscarNight: 0
  },

  {
    player: 'Bessie',
    season: 1178,
    bonus: 0,
    oscarNight: 0
  },

  {
    player: 'Haley',
    season: 1108,
    bonus: 0,
    oscarNight: 0
  },

  {
    player: 'Bobby',
    season: 198,
    bonus: 0,
    oscarNight: 0
  }

];


/****************************************************************
 SECTION 6 — LEAGUE RULES
 ---------------------------------------------------------------
 These remain exactly compatible with the existing accordion
 markup and HTML/CSS.
****************************************************************/

const RULES = [

  {
    title: 'Draft budget',
    text:
      'Each player builds a roster from the eligible film pool while remaining under the league budget of $100.'
  },

  {
    title: 'Season points',
    text:
      'Box Office: <br> Movies released Sept. 26 or later earn 1 point per $1M domestic box office, milestone bonuses up to +25 points (through $200M), and +20 points for every week at No. 1.<br><br> Critical Reception: <br> Movies earn -5 to 100 points based on their Metacritic score. Scores are locked in on January 6 and only apply to films released by that date. <br><br> Awards Season:<br> Movies earn points for nominations and wins across the entire awards season (Gotham, Critics Choice, Golden Globes, SAG, DGA, PGA, BAFTA, WGA, Spirit Awards, Oscars, and more). Bigger awards and major categories are worth more. <br><br> Oscar Bonus: <br>The Academy Awards are the highest-value event, with 100 points for Best Picture, 75 points for major categories, and 50 points for technical categories.'
  },

  {
    title: 'Bonus points',
    text:
      'Points given out for Best Team Name, Biggest Box Office, Biggest Points Per Dollar'
  },

  {
    title: 'Oscar Night',
    text:
      'Oscar Night selections for all categories added to season totals, more prestige "above the line" awards give more points.'
  }

];


/****************************************************************
 SECTION 7 — APPLICATION STATE
****************************************************************/

const state = {

  // Leaderboard players.
  players: [],

  // Leaderboard sort direction.
  sortDirection: 'desc',

  // Raw normalized Oscar Odds rows.
  oddsRows: []

};


/****************************************************************
 SECTION 8 — HTML SAFETY HELPER
 ---------------------------------------------------------------
 Google Sheet text is inserted into the webpage.

 This prevents text entered into the Sheet from accidentally
 being interpreted as HTML.
****************************************************************/

function escapeHTML(value) {

  return String(value ?? '')

    .replace(/&/g, '&amp;')

    .replace(/</g, '&lt;')

    .replace(/>/g, '&gt;')

    .replace(/"/g, '&quot;')

    .replace(/'/g, '&#039;');

}


/****************************************************************
 SECTION 9 — NAME INITIALS
 ---------------------------------------------------------------
 Preserves your existing avatar styling.

 Example:
 "Christopher Nolan" becomes "CN".
****************************************************************/

function initialsFor(name) {

  return String(name ?? '')

    .split(/[\s,]+/)

    .filter(Boolean)

    .slice(0, 2)

    .map(part => part[0])

    .join('')

    .toUpperCase();

}


/****************************************************************
 SECTION 10 — NUMBER CONVERSION
 ---------------------------------------------------------------
 Removes symbols from Google Sheet values.

 Examples:
 "$1,200" becomes 1200
 "87.9%" becomes 87.9
****************************************************************/

function numberFrom(value) {

  const cleaned =
    String(value ?? '')
      .replace(/[^0-9.-]/g, '');

  const parsed =
    Number(cleaned);

  return Number.isFinite(parsed)
    ? parsed
    : 0;

}


/****************************************************************
 SECTION 11 — FIND FIRST MATCHING GOOGLE SHEET COLUMN
 ---------------------------------------------------------------
 Allows multiple acceptable column names.
****************************************************************/

function firstValue(row, names) {

  for (const name of names) {

    if (
      row[name] !== undefined &&
      row[name] !== null &&
      String(row[name]).trim() !== ''
    ) {

      return row[name];

    }

  }

  return '';

}


/****************************************************************
 SECTION 12 — BUILD GOOGLE SHEETS CSV URL
****************************************************************/

function getCsvUrl(gid) {

  return (
    `https://docs.google.com/spreadsheets/d/` +
    `${CONFIG.sheetId}/export?format=csv&gid=${gid}`
  );

}


/****************************************************************
 SECTION 13 — NORMALIZE LEADERBOARD ROW
 ---------------------------------------------------------------
 Recommended columns:

 Player
 Season Points
 Bonus Points
 Oscar Night

 Multiple alternate headers are also supported.
****************************************************************/

function normalizeRow(row) {

  return {

    player: String(
      firstValue(
        row,
        [
          'Player',
          'Team',
          'Name',
          'Player Name',
          'Team Name'
        ]
      ) || 'Unnamed Player'
    ).trim(),


    season: numberFrom(
      firstValue(
        row,
        [
          'Season Points',
          'SeasonPoints',
          'Season Total',
          'Season',
          'Season Score',
          'Points',
          'Total Points',
          'Total'
        ]
      )
    ),


    bonus: numberFrom(
      firstValue(
        row,
        [
          'Bonus Points',
          'BonusPoints',
          'Bonus',
          'Bonuses'
        ]
      )
    ),


    oscarNight: numberFrom(
      firstValue(
        row,
        [
          'Oscar Night',
          'Oscar Night Points',
          'OscarNight',
          'Night',
          'Night Points'
        ]
      )
    )

  };

}


/****************************************************************
 SECTION 14 — PLAYER TOTAL
****************************************************************/

function totalFor(player) {

  return (
    player.season +

    (
      DEV_FEATURES.showBonusPointsColumn
        ? player.bonus
        : 0
    ) +

    (
      DEV_FEATURES.showOscarNightColumn
        ? player.oscarNight
        : 0
    )
  );

}


/****************************************************************
 SECTION 15 — SORT LEADERBOARD
****************************************************************/

function sortedPlayers() {

  const direction =
    state.sortDirection === 'desc'
      ? -1
      : 1;

  return [...state.players]
    .sort(
      (a, b) =>
        (totalFor(a) - totalFor(b)) * direction
    );

}


/****************************************************************
 SECTION 16 — FEATURE TOGGLES
 ---------------------------------------------------------------
 Keeps the original selectors and adds Awards Odds support.
****************************************************************/

function applyFeatureToggles() {

  // Awards section.
  document
    .querySelectorAll(
      '[data-feature="awards"], [data-feature-link="awards"]'
    )
    .forEach(
      el =>
        el.hidden =
          !DEV_FEATURES.showAwardsSection
    );


  // Rules section.
  document
    .querySelectorAll(
      '[data-feature="rules"], [data-feature-link="rules"]'
    )
    .forEach(
      el =>
        el.hidden =
          !DEV_FEATURES.showRulesSection
    );


  // Oscar Night.
  document
    .querySelectorAll(
      '[data-feature="oscarNight"], [data-feature-link="oscarNight"]'
    )
    .forEach(
      el =>
        el.hidden =
          !DEV_FEATURES.showOscarNightSection
    );


  // Awards Odds.
  document
    .querySelectorAll(
      '#awards-odds, [data-feature="awardsOdds"], [data-feature-link="awardsOdds"]'
    )
    .forEach(
      el =>
        el.hidden =
          !DEV_FEATURES.showAwardsOddsSection
    );


  // Bonus Points leaderboard columns.
  document
    .querySelectorAll('.bonus-column')
    .forEach(
      el =>
        el.hidden =
          !DEV_FEATURES.showBonusPointsColumn
    );


  // Oscar Night leaderboard columns.
  document
    .querySelectorAll('.oscar-night-column')
    .forEach(
      el =>
        el.hidden =
          !DEV_FEATURES.showOscarNightColumn
    );

}


/****************************************************************
 SECTION 17 — RULES ACCORDION
 ---------------------------------------------------------------
 Preserves the exact <details> and <summary> structure expected
 by the current CSS.
****************************************************************/

function renderRules() {

  const rulesList =
    document.getElementById('rulesList');

  if (!rulesList) {
    return;
  }

  rulesList.innerHTML =
    RULES
      .map(
        rule => `
          <details>

            <summary>
              ${rule.title}
            </summary>

            <p>
              ${rule.text}
            </p>

          </details>
        `
      )
      .join('');

}


/****************************************************************
 SECTION 18 — RENDER LEADERBOARD
 ---------------------------------------------------------------
 Preserves the existing HTML IDs and CSS class names:

 leaderShowcase
 mobileScoreCards
 leaderboardBody
 memberCount
 statusText

 score-row
 rank-badge
 score-player
 score-total
****************************************************************/

function renderStandings() {

  const players =
    sortedPlayers();

  const leader =
    players[0];


  /**************************************************************
   CURRENT LEADER SHOWCASE
  **************************************************************/

  const leaderShowcase =
    document.getElementById('leaderShowcase');

  if (leaderShowcase) {

    leaderShowcase.innerHTML =
      leader

        ? `
            <div>

              <span class="leader-eyebrow">
                Current leader
              </span>

              <h3>
                ${escapeHTML(leader.player)}
              </h3>

              <p>
                ${totalFor(leader)} total points
              </p>

            </div>
          `

        : `
            <div>
              <h3>No standings yet</h3>
            </div>
          `;

  }


  /**************************************************************
   MOBILE LEADERBOARD CARDS

   IMPORTANT:
   Existing class names are intentionally preserved so existing
   CSS styling continues to work.
  **************************************************************/

  const mobileScoreCards =
    document.getElementById('mobileScoreCards');

  if (mobileScoreCards) {

    mobileScoreCards.innerHTML =
      players
        .map(
          (player, index) => `
            <article class="score-row">

              <span class="rank-badge">
                ${index + 1}
              </span>

              <div class="score-player">

                <strong>
                  ${escapeHTML(player.player)}
                </strong>

                <span>

                  ${player.season} season

                  ${
                    DEV_FEATURES.showBonusPointsColumn
                      ? ` • ${player.bonus} bonus`
                      : ''
                  }

                  ${
                    DEV_FEATURES.showOscarNightColumn
                      ? ` • ${player.oscarNight} Oscar Night`
                      : ''
                  }

                </span>

              </div>

              <span class="score-total">
                ${totalFor(player)}
              </span>

            </article>
          `
        )
        .join('');

  }


  /**************************************************************
   DESKTOP LEADERBOARD TABLE
  **************************************************************/

  const visibleColumnCount =
    4 +
    Number(
      DEV_FEATURES.showBonusPointsColumn
    ) +
    Number(
      DEV_FEATURES.showOscarNightColumn
    );


  const leaderboardBody =
    document.getElementById('leaderboardBody');

  if (leaderboardBody) {

    leaderboardBody.innerHTML =
      players.length

        ? players
            .map(
              (player, index) => `
                <tr>

                  <td>
                    ${index + 1}
                  </td>

                  <td>
                    ${escapeHTML(player.player)}
                  </td>

                  <td>
                    ${player.season}
                  </td>

                  <td
                    class="bonus-column"
                    ${
                      DEV_FEATURES.showBonusPointsColumn
                        ? ''
                        : 'hidden'
                    }
                  >
                    ${player.bonus}
                  </td>

                  <td
                    class="oscar-night-column"
                    ${
                      DEV_FEATURES.showOscarNightColumn
                        ? ''
                        : 'hidden'
                    }
                  >
                    ${player.oscarNight}
                  </td>

                  <td>
                    ${totalFor(player)}
                  </td>

                </tr>
              `
            )
            .join('')

        : `
            <tr>

              <td colspan="${visibleColumnCount}">
                No leaderboard rows found.
              </td>

            </tr>
          `;

  }


  /**************************************************************
   PLAYER COUNT
  **************************************************************/

  const memberCount =
    document.getElementById('memberCount');

  if (memberCount) {
    memberCount.textContent =
      players.length;
  }


  /**************************************************************
   STATUS MESSAGE
  **************************************************************/

  const statusText =
    document.getElementById('statusText');

  if (statusText) {

    statusText.textContent =
      `${players.length} players • sorted ${
        state.sortDirection === 'desc'
          ? 'highest to lowest'
          : 'lowest to highest'
      }`;

  }

}


/****************************************************************
 SECTION 19 — OSCAR NIGHT COUNTDOWN
 ---------------------------------------------------------------
 Keeps the existing daysToOscar element.
****************************************************************/

function updateCountdown() {

  const element =
    document.getElementById('daysToOscar');

  if (!element) {
    return;
  }


  const target =
    new Date(CONFIG.oscarNightDate);


  const diff =
    target.getTime() -
    Date.now();


  element.textContent =
    Number.isFinite(diff)

      ? Math.max(
          0,
          Math.ceil(
            diff / 86400000
          )
        )

      : '—';

}


/****************************************************************
 SECTION 20 — LOAD LEADERBOARD
 ---------------------------------------------------------------
 Downloads the Leaderboard tab ONCE.

 The page does NOT automatically reload standings afterward.
****************************************************************/

async function loadLeaderboard() {

  try {

    // Download Leaderboard CSV.
    const response =
      await fetch(
        getCsvUrl(CONFIG.standingsGid),
        {
          cache: 'no-store'
        }
      );


    // Treat unsuccessful HTTP requests as errors.
    if (!response.ok) {

      throw new Error(
        `Sheet request failed: ${response.status}`
      );

    }


    // Read response as text.
    const csv =
      await response.text();


    // Parse CSV into rows.
    const parsed =
      Papa.parse(
        csv,
        {
          header: true,
          skipEmptyLines: true
        }
      );


    // Normalize rows.
    const rows =
      parsed.data

        .map(normalizeRow)

        .filter(
          row =>
            row.player &&
            row.player !== 'Unnamed Player'
        );


    // Use Sheet rows when available.
    // Otherwise use sample data.
    state.players =
      rows.length
        ? rows
        : FALLBACK_PLAYERS;


    // Draw standings.
    renderStandings();


    // Add load time to status.
    const statusText =
      document.getElementById('statusText');


    if (statusText) {

      statusText.textContent +=
        ` • updated ${
          new Date().toLocaleTimeString(
            [],
            {
              hour: 'numeric',
              minute: '2-digit'
            }
          )
        }`;

    }

  }

  catch (error) {

    console.warn(
      'Using fallback standings:',
      error
    );


    // Fall back to sample standings.
    state.players =
      FALLBACK_PLAYERS;


    // Draw fallback standings.
    renderStandings();


    // Notify the visitor.
    const statusText =
      document.getElementById('statusText');


    if (statusText) {

      statusText.textContent +=
        ' • sample data shown';

    }

  }

}


/****************************************************************
 SECTION 21 — NORMALIZE OSCAR ODDS ROW
 ---------------------------------------------------------------
 Recommended Google Sheet columns:

 Category
 Rank
 Nominee
 Odds
 Image URL
 Updated

 Required:
 Category
 Nominee
 Odds

 Rank is recommended.

 Image URL and Updated are optional.
****************************************************************/

function normalizeOddsRow(row) {

  return {

    category:
      String(
        firstValue(
          row,
          [
            'Category',
            'Award',
            'Category Name'
          ]
        )
      ).trim(),


    rank:
      numberFrom(
        firstValue(
          row,
          [
            'Rank',
            'Position'
          ]
        )
      ),


    name:
      String(
        firstValue(
          row,
          [
            'Nominee',
            'Name',
            'Contender',
            'Film',
            'Person'
          ]
        )
      ).trim(),


    odds:
      numberFrom(
        firstValue(
          row,
          [
            'Odds',
            'Probability',
            'Percentage',
            'Percent'
          ]
        )
      ),


    imageUrl:
      String(
        firstValue(
          row,
          [
            'Image URL',
            'ImageURL',
            'Image',
            'Photo URL',
            'Photo'
          ]
        )
      ).trim(),


    updated:
      String(
        firstValue(
          row,
          [
            'Updated',
            'Last Updated',
            'Update Date',
            'Updated At'
          ]
        )
      ).trim()

  };

}


/****************************************************************
 SECTION 22 — GROUP OSCAR ODDS
 ---------------------------------------------------------------
 Rules:

 1. Group rows by Category.
 2. Rank numbers are used when provided.
 3. Otherwise highest odds come first.
 4. Only the top three contenders are displayed.
****************************************************************/

function groupAwardsOdds(rows) {

  const groups = {};


  /**************************************************************
   GROUP EVERY ROW BY CATEGORY
  **************************************************************/

  rows.forEach(row => {

    // Ignore incomplete rows.
    if (
      !row.category ||
      !row.name
    ) {

      return;

    }


    // Create category array when needed.
    if (!groups[row.category]) {

      groups[row.category] = [];

    }


    // Add contender to category.
    groups[row.category].push(row);

  });


  /**************************************************************
   CONVERT GROUPS INTO AN ARRAY
  **************************************************************/

  const categories =
    Object.entries(groups)

      .map(
        ([category, nominees]) => {

          /********************************************************
           SORT NOMINEES
          ********************************************************/

          nominees.sort(
            (a, b) => {

              // Both rows have a rank.
              if (
                a.rank > 0 &&
                b.rank > 0
              ) {

                return (
                  a.rank -
                  b.rank
                );

              }


              // Ranked contender comes first.
              if (a.rank > 0) {
                return -1;
              }


              if (b.rank > 0) {
                return 1;
              }


              // Otherwise sort odds highest to lowest.
              return (
                b.odds -
                a.odds
              );

            }
          );


          // Keep only top three.
          return {

            category,

            nominees:
              nominees.slice(0, 3)

          };

        }
      );


  /**************************************************************
   SORT CATEGORY CARDS
  **************************************************************/

  categories.sort(
    (a, b) => {

      const aIndex =
        ODDS_CATEGORY_ORDER
          .indexOf(a.category);


      const bIndex =
        ODDS_CATEGORY_ORDER
          .indexOf(b.category);


      const aOrder =
        aIndex === -1
          ? Number.MAX_SAFE_INTEGER
          : aIndex;


      const bOrder =
        bIndex === -1
          ? Number.MAX_SAFE_INTEGER
          : bIndex;


      if (aOrder !== bOrder) {

        return (
          aOrder -
          bOrder
        );

      }


      // Alphabetize categories not in the preferred list.
      return (
        a.category
          .localeCompare(b.category)
      );

    }
  );


  return categories;

}


/****************************************************************
 SECTION 23 — CONVERT FALLBACK ODDS INTO SHEET-LIKE FORMAT
****************************************************************/

function fallbackOddsRows() {

  const rows = [];


  FALLBACK_AWARDS_ODDS
    .forEach(group => {

      group.nominees
        .forEach(
          (nominee, index) => {

            rows.push({

              category:
                group.category,

              rank:
                index + 1,

              name:
                nominee.name,

              odds:
                nominee.odds,

              imageUrl:
                '',

              updated:
                ''

            });

          }
        );

    });


  return rows;

}


/****************************************************************
 SECTION 24 — BUILD OSCAR ODDS AVATAR
 ---------------------------------------------------------------
 If an Image URL exists in Google Sheets, display that image.

 Otherwise retain the existing initials-based avatar.

 This preserves the current styling while allowing optional images.
****************************************************************/

function buildOddsAvatar(nominee) {

  if (nominee.imageUrl) {

    return `
      <span
        class="odds-avatar"
        aria-hidden="true"
      >
        <img
          src="${escapeHTML(nominee.imageUrl)}"
          alt=""
          loading="lazy"
          style="
            width:100%;
            height:100%;
            object-fit:cover;
            border-radius:inherit;
          "
        >
      </span>
    `;

  }


  return `
    <span
      class="odds-avatar"
      aria-hidden="true"
    >
      ${initialsFor(nominee.name)}
    </span>
  `;

}


/****************************************************************
 SECTION 25 — RENDER OSCAR ODDS
 ---------------------------------------------------------------
 IMPORTANT:

 Existing CSS class names are intentionally preserved:

 odds-card
 odds-list
 odds-entry
 odds-avatar
 odds-name-wrap
 odds-rank
 odds-name
 odds-percent
 odds-track
 odds-fill

 That means the current styling should continue working.
****************************************************************/

function renderAwardsOdds() {

  const grid =
    document.getElementById('oddsGrid');


  if (!grid) {
    return;
  }


  // Group Google Sheet data.
  const categories =
    groupAwardsOdds(
      state.oddsRows
    );


  // Handle empty data.
  if (!categories.length) {

    grid.innerHTML = `
      <div class="odds-loading">
        No Oscar Odds are currently available.
      </div>
    `;

    return;

  }


  /**************************************************************
   BUILD CATEGORY CARDS
  **************************************************************/

  grid.innerHTML =
    categories

      .map(
        group => `

          <article class="odds-card">

            <h3>
              ${escapeHTML(group.category)}
            </h3>

            <div class="odds-list">

              ${
                group.nominees

                  .map(
                    (nominee, index) => {

                      // Prefer Sheet rank when available.
                      const rank =
                        nominee.rank > 0
                          ? nominee.rank
                          : index + 1;


                      // Keep bar width between 0 and 100.
                      const oddsWidth =
                        Math.max(
                          0,
                          Math.min(
                            100,
                            nominee.odds
                          )
                        );


                      return `

                        <div class="odds-entry">

                          ${
                            buildOddsAvatar(
                              nominee
                            )
                          }

                          <div class="odds-name-wrap">

                            <span class="odds-rank">
                              ${rank}
                            </span>

                            <span
                              class="odds-name"
                              title="${escapeHTML(nominee.name)}"
                            >
                              ${escapeHTML(nominee.name)}
                            </span>

                          </div>

                          <span class="odds-percent">
                            ${nominee.odds.toFixed(1)}%
                          </span>

                          <div
                            class="odds-track"
                            role="progressbar"
                            aria-label="${escapeHTML(nominee.name)}: ${nominee.odds.toFixed(1)} percent odds"
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-valuenow="${oddsWidth}"
                          >

                            <div
                              class="odds-fill"
                              style="--odds-width:${oddsWidth}%"
                            ></div>

                          </div>

                        </div>
                      `;

                    }
                  )

                  .join('')
              }

            </div>

          </article>
        `
      )

      .join('');


  /**************************************************************
   UPDATE DATE/TIME
  **************************************************************/

  updateOddsTimestamp();

}


/****************************************************************
 SECTION 26 — OSCAR ODDS TIMESTAMP
 ---------------------------------------------------------------
 If an Updated value exists in Google Sheets, use it.

 Otherwise display the time the page loaded the odds.
****************************************************************/

function updateOddsTimestamp() {

  const updated =
    document.getElementById('oddsUpdated');


  if (!updated) {
    return;
  }


  // Look for first Sheet row containing an update value.
  const rowWithUpdate =
    state.oddsRows.find(
      row =>
        row.updated
    );


  // Prefer Google Sheet update date.
  if (rowWithUpdate) {

    updated.textContent =
      `Updated: ${rowWithUpdate.updated}`;

    return;

  }


  // Fall back to browser date/time.
  const now =
    new Date();


  updated.textContent =
    `Updated: ${
      now.toLocaleDateString(
        [],
        {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }
      )
    } ${
      now.toLocaleTimeString(
        [],
        {
          hour: 'numeric',
          minute: '2-digit'
        }
      )
    }`;

}


/****************************************************************
 SECTION 27 — LOAD OSCAR ODDS
 ---------------------------------------------------------------
 Downloads Oscar Odds ONCE when the webpage opens.

 It does NOT automatically refresh afterward.
****************************************************************/

async function loadAwardsOdds() {

  const grid =
    document.getElementById('oddsGrid');


  // Stop quietly if the section is not present.
  if (!grid) {
    return;
  }


  // Make sure the GID is configured.
  if (
    !CONFIG.oddsGid ||
    CONFIG.oddsGid === 'PASTE_ODDS_GID_HERE'
  ) {

    grid.innerHTML = `
      <div class="odds-loading">

        <strong>
          Oscar Odds Google Sheet needs to be connected.
        </strong>

        <br><br>

        Add the Oscar Odds tab GID to
        <code>CONFIG.oddsGid</code>
        in <code>script.js</code>.

      </div>
    `;

    return;

  }


  try {

    /************************************************************
     DOWNLOAD OSCAR ODDS TAB
    ************************************************************/

    const response =
      await fetch(
        getCsvUrl(CONFIG.oddsGid),
        {
          cache: 'no-store'
        }
      );


    if (!response.ok) {

      throw new Error(
        `Oscar Odds Sheet request failed: ${response.status}`
      );

    }


    // Convert response to text.
    const csv =
      await response.text();


    /************************************************************
     PARSE CSV
    ************************************************************/

    const parsed =
      Papa.parse(
        csv,
        {
          header: true,
          skipEmptyLines: true
        }
      );


    /************************************************************
     NORMALIZE SHEET ROWS
    ************************************************************/

    const rows =
      parsed.data

        .map(normalizeOddsRow)

        .filter(
          row =>
            row.category &&
            row.name
        );


    /************************************************************
     SAVE DATA
    ************************************************************/

    state.oddsRows =
      rows.length

        ? rows

        : fallbackOddsRows();


    /************************************************************
     RENDER ODDS
    ************************************************************/

    renderAwardsOdds();

  }

  catch (error) {

    console.warn(
      'Using fallback Oscar Odds:',
      error
    );


    /************************************************************
     USE FALLBACK DATA
    ************************************************************/

    state.oddsRows =
      fallbackOddsRows();


    /************************************************************
     DRAW FALLBACK DATA
    ************************************************************/

    renderAwardsOdds();


    /************************************************************
     OPTIONAL FALLBACK STATUS
    ************************************************************/

    const updated =
      document.getElementById('oddsUpdated');


    if (updated) {

      updated.textContent +=
        ' • sample data shown';

    }

  }

}


/****************************************************************
 SECTION 28 — MOBILE NAVIGATION
 ---------------------------------------------------------------
 Preserves the existing IDs and "open" CSS class.
****************************************************************/

function setupNavigation() {

  const button =
    document.getElementById('menuButton');


  const nav =
    document.getElementById('mobileNav');


  // Avoid JavaScript errors if navigation does not exist.
  if (
    !button ||
    !nav
  ) {

    return;

  }


  button.addEventListener(
    'click',
    () => {

      const open =
        button
          .getAttribute(
            'aria-expanded'
          ) === 'true';


      button.setAttribute(
        'aria-expanded',
        String(!open)
      );


      nav.classList.toggle(
        'open',
        !open
      );

    }
  );


  nav
    .querySelectorAll('a')
    .forEach(
      link =>
        link.addEventListener(
          'click',
          () => {

            button.setAttribute(
              'aria-expanded',
              'false'
            );


            nav.classList.remove(
              'open'
            );

          }
        )
    );

}


/****************************************************************
 SECTION 29 — LEADERBOARD SORTING
 ---------------------------------------------------------------
 Preserves your existing clickable/keyboard-sortable Season
 header behavior.
****************************************************************/

function setupSorting() {

  const header =
    document.getElementById('sortSeason');


  // Prevent errors if the sortable header is missing.
  if (!header) {
    return;
  }


  const toggleSort =
    () => {

      // Reverse sort direction.
      state.sortDirection =
        state.sortDirection === 'desc'
          ? 'asc'
          : 'desc';


      // Redraw standings immediately.
      renderStandings();

    };


  // Mouse/touch activation.
  header.addEventListener(
    'click',
    toggleSort
  );


  // Keyboard accessibility.
  header.addEventListener(
    'keydown',
    event => {

      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {

        // Prevent Space from scrolling the page.
        event.preventDefault();

        toggleSort();

      }

    }
  );

}


/****************************************************************
 SECTION 30 — PAGE STARTUP
 ---------------------------------------------------------------

 The order below is intentional.

 1. Apply developer feature toggles.
 2. Render league rules.
 3. Set up navigation.
 4. Set up leaderboard sorting.
 5. Update Oscar countdown.
 6. Load Leaderboard once.
 7. Load Oscar Odds once.

 IMPORTANT:
 There is NO automatic Google Sheet refresh timer.
****************************************************************/


// Apply section visibility.
applyFeatureToggles();


// Build rules accordion.
renderRules();


// Set up mobile menu.
setupNavigation();


// Activate leaderboard sorting.
setupSorting();


// Calculate days remaining until Oscar Night.
updateCountdown();


// Load leaderboard Google Sheet ONCE.
loadLeaderboard();


// Load Oscar Odds Google Sheet ONCE.
loadAwardsOdds();


/****************************************************************
 OPTIONAL LOCAL COUNTDOWN REFRESH
 ---------------------------------------------------------------
 This updates the DAYS TO OSCAR number once an hour.

 It DOES NOT contact Google Sheets.

 Therefore it does not interfere with the page-load-only
 Leaderboard or Oscar Odds behavior.
****************************************************************/

setInterval(
  updateCountdown,
  60 * 60 * 1000
);


/****************************************************************
 IMPORTANT — GOOGLE SHEET REFRESH BEHAVIOR
 ---------------------------------------------------------------

 There is intentionally NO:

 setInterval(loadLeaderboard, ...)

 and NO:

 setInterval(loadAwardsOdds, ...)

 Both Google Sheets are downloaded only when the page opens.

 After updating either Google Sheet:

 REFRESH / RELOAD THE WEBSITE.

****************************************************************/
