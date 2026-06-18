const BASE_URL = "https://zelda.fanapis.com/api";

const GAME_NAMES = {
  OOT: "The Legend of Zelda: Ocarina of Time",
  MM: "The Legend of Zelda: Majora's Mask",
};

let gameIdCache = null;

async function getGameIds() {
  if (gameIdCache) return gameIdCache;

  try {
    const res = await fetch(`${BASE_URL}/games?limit=100`);
    const json = await res.json();
    if (json.success && json.data) {
      const map = {};
      for (const game of json.data) {
        map[game.name] = game.id;
        const simplified = game.name.replace(/[^a-z0-9]/gi, "").toLowerCase();
        map[simplified] = game.id;
      }
      gameIdCache = map;
      return map;
    }
  } catch {
    // fallback
  }
  return {};
}

function appearancesContainGameId(appearances, gameId) {
  if (!appearances || !Array.isArray(appearances)) return false;
  return appearances.some((url) => url.includes(String(gameId)));
}

async function fetchAllPages(endpoint, filters = {}) {
  const cacheKey = `${endpoint}:${JSON.stringify(filters)}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return JSON.parse(cached);

  const limit = filters.limit || 100;
  let page = 0;
  let allData = [];
  let hasMore = true;

  while (hasMore) {
    const params = new URLSearchParams({ limit: String(limit), page: String(page) });
    if (filters.name) params.set("name", filters.name);

    try {
      const res = await fetch(`${BASE_URL}/${endpoint}?${params}`);
      const json = await res.json();
      if (json.success && json.data) {
        allData = allData.concat(json.data);
        hasMore = json.data.length === limit;
      } else {
        hasMore = false;
      }
    } catch {
      hasMore = false;
    }
    page++;
  }

  sessionStorage.setItem(cacheKey, JSON.stringify(allData));
  return allData;
}

export async function fetchItems(gameName) {
  const [all, gameMap] = await Promise.all([fetchAllPages("items"), getGameIds()]);
  const gameId = gameMap[gameName] || gameMap[gameName.replace(/[^a-z0-9]/gi, "").toLowerCase()];
  if (!gameId) return all.filter((item) => (item.games || []).length > 0);
  return all.filter((item) => appearancesContainGameId(item.games, gameId));
}

export async function fetchCharacters(gameName) {
  const [all, gameMap] = await Promise.all([fetchAllPages("characters"), getGameIds()]);
  const gameId = gameMap[gameName] || gameMap[gameName.replace(/[^a-z0-9]/gi, "").toLowerCase()];
  if (!gameId) return all;
  return all.filter((char) => appearancesContainGameId(char.appearances, gameId));
}

export async function fetchDungeons(gameName) {
  const [all, gameMap] = await Promise.all([fetchAllPages("dungeons"), getGameIds()]);
  const gameId = gameMap[gameName] || gameMap[gameName.replace(/[^a-z0-9]/gi, "").toLowerCase()];
  if (!gameId) return all;
  return all.filter((d) => appearancesContainGameId(d.appearances, gameId));
}

export async function fetchBosses(gameName) {
  const [all, gameMap] = await Promise.all([fetchAllPages("bosses"), getGameIds()]);
  const gameId = gameMap[gameName] || gameMap[gameName.replace(/[^a-z0-9]/gi, "").toLowerCase()];
  if (!gameId) return all;
  return all.filter((b) => appearancesContainGameId(b.appearances, gameId));
}

export async function fetchMonsters(gameName) {
  const [all, gameMap] = await Promise.all([fetchAllPages("monsters"), getGameIds()]);
  const gameId = gameMap[gameName] || gameMap[gameName.replace(/[^a-z0-9]/gi, "").toLowerCase()];
  if (!gameId) return all;
  return all.filter((m) => appearancesContainGameId(m.appearances, gameId));
}

export async function fetchPlaces(gameName) {
  const [all, gameMap] = await Promise.all([fetchAllPages("places"), getGameIds()]);
  const gameId = gameMap[gameName] || gameMap[gameName.replace(/[^a-z0-9]/gi, "").toLowerCase()];
  if (!gameId) return all;
  return all.filter((p) => appearancesContainGameId(p.appearances, gameId));
}

export async function fetchAllGameData(gameName) {
  const [items, characters, dungeons, bosses, monsters, places] = await Promise.all([
    fetchItems(gameName),
    fetchCharacters(gameName),
    fetchDungeons(gameName),
    fetchBosses(gameName),
    fetchMonsters(gameName),
    fetchPlaces(gameName),
  ]);

  return { items, characters, dungeons, bosses, monsters, places };
}

export { GAME_NAMES };
