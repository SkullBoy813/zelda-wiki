import { fetchAllGameData } from "./api";
import { gameData } from "../data";
import { GAME_NAMES } from "./api";

let searchCache = null;
let cachePromise = null;

async function buildSearchIndex() {
  if (searchCache) return searchCache;

  if (cachePromise) return cachePromise;

  cachePromise = (async () => {
    const results = [];

    const addItems = (items, type, gameLabel, game) => {
      for (const item of items) {
        results.push({ ...item, _type: type, _gameLabel: gameLabel, _game: game });
      }
    };

    // Local data
    for (const [game, data] of Object.entries(gameData)) {
      const label = data.label;
      addItems(data.items || [], "item", label, game);
      addItems(data.characters || [], "character", label, game);
      addItems(data.dungeons || [], "dungeon", label, game);
      addItems(data.locations || [], "location", label, game);
      addItems(data.quests || [], "quest", label, game);
      addItems(data.songs || [], "song", label, game);
      if (data.masks) addItems(data.masks, "mask", label, game);
      if (data.bosses) addItems(data.bosses, "boss", label, game);
    }

    // API data - try to fetch in background
    try {
      const [oot, mm] = await Promise.allSettled([
        fetchAllGameData(GAME_NAMES.OOT),
        fetchAllGameData(GAME_NAMES.MM),
      ]);

      if (oot.status === "fulfilled") {
        addItems(oot.value.items, "item-api", "Ocarina of Time", "ocarina-of-time");
        addItems(oot.value.characters, "character-api", "Ocarina of Time", "ocarina-of-time");
        addItems(oot.value.dungeons, "dungeon-api", "Ocarina of Time", "ocarina-of-time");
        addItems(oot.value.monsters, "monster", "Ocarina of Time", "ocarina-of-time");
        addItems(oot.value.places, "place", "Ocarina of Time", "ocarina-of-time");
      }
      if (mm.status === "fulfilled") {
        addItems(mm.value.items, "item-api", "Majora's Mask", "majoras-mask");
        addItems(mm.value.characters, "character-api", "Majora's Mask", "majoras-mask");
        addItems(mm.value.dungeons, "dungeon-api", "Majora's Mask", "majoras-mask");
        addItems(mm.value.monsters, "monster", "Majora's Mask", "majoras-mask");
        addItems(mm.value.places, "place", "Majora's Mask", "majoras-mask");
      }
    } catch {
      // Silent - API data is optional
    }

    searchCache = results;
    return results;
  })();

  return cachePromise;
}

export async function searchAll(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const index = await buildSearchIndex();

  const results = [];
  for (const item of index) {
    const name = (item.name || "").toLowerCase();
    const desc = (item.description || "").toLowerCase();
    const location = (item.location || "").toLowerCase();

    if (name.includes(q) || desc.includes(q) || location.includes(q)) {
      results.push(item);
      if (results.length >= 20) break;
    }
  }

  return results;
}
