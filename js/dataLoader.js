// Simple loader: local JSON by default. Optionally accepts a Google Sheets JSON URL.
async function loadJSON(path) {
  const resp = await fetch(path);
  if (!resp.ok) throw new Error(`Failed to load ${path}: ${resp.status}`);
  return await resp.json();
}

async function loadAllData(options = {}) {
  // options: { useGoogleSheet: bool, sheetUrl: string }
  if (options.useGoogleSheet && options.sheetUrl) {
    // If user wants to use Google Sheets, expect the sheet to provide JSON in compatible format.
    // The sheet must be set up by the user and published as JSON/CSV.
    // The app will try to fetch the sheetUrl directly.
    const data = await loadJSON(options.sheetUrl);
    // Assume the sheet provides 'heroes','cards_global','cards_heroes','effects' keys
    return {
      heroes: data.heroes || {},
      globalCards: data.cards_global || [],
      heroCards: data.cards_heroes || {},
      effects: data.effects || {}
    };
  } else {
    const [heroes, globalCards, heroCards, effects] = await Promise.all([
      loadJSON('data/heroes.json'),
      loadJSON('data/cards_global.json'),
      loadJSON('data/cards_heroes.json'),
      loadJSON('data/effects.json')
    ]);
    return { heroes, globalCards, heroCards, effects };
  }
}
