import { ocarinaOfTimeData, ootProgressCategories } from "./ocarina-of-time";
import { majorasMaskData, mmProgressCategories } from "./majoras-mask";

export const gameData = {
  "ocarina-of-time": ocarinaOfTimeData,
  "majoras-mask": majorasMaskData,
};

export const progressCategories = {
  "ocarina-of-time": ootProgressCategories,
  "majoras-mask": mmProgressCategories,
};

export function searchAllLocal(query) {
  const results = [];
  const q = query.toLowerCase().trim();
  if (!q) return results;

  const allItems = [];

  for (const [gameKey, data] of Object.entries(gameData)) {
    const label = data.label;
    const addItem = (item, type) => {
      allItems.push({ ...item, gameLabel: label, type, game: gameKey });
    };

    (data.items || []).forEach((i) => addItem(i, "item"));
    (data.characters || []).forEach((c) => addItem(c, "character"));
    (data.dungeons || []).forEach((d) => addItem(d, "dungeon"));
    (data.locations || []).forEach((l) => addItem(l, "location"));
    (data.quests || []).forEach((q) => addItem(q, "quest"));
    (data.songs || []).forEach((s) => addItem(s, "song"));
    if (data.masks) (data.masks || []).forEach((m) => addItem(m, "mask"));
  }

  for (const item of allItems) {
    const name = (item.name || "").toLowerCase();
    const namePt = (item.namePt || "").toLowerCase();
    const desc = (item.descriptionPt || item.description || "").toLowerCase();
    const location = (item.location || "").toLowerCase();

    if (name.includes(q) || namePt.includes(q) || desc.includes(q) || location.includes(q)) {
      results.push(item);
    }
  }

  return results.slice(0, 20);
}

export { ocarinaOfTimeData, majorasMaskData, ootProgressCategories, mmProgressCategories };
