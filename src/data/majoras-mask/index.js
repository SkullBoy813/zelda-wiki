import { items, itemCategories } from "./items";
import { masks, maskTypes } from "./masks";
import { characters } from "./characters";
import { dungeons, dungeonOrderMM } from "./dungeons";
import { locations } from "./locations";
import { heartPieces } from "./heart-pieces";
import { strayFairiesByTemple, getAllStrayFairies } from "./stray-fairies";
import { quests, questTypes } from "./quests";
import { songs, songCategories } from "./songs";
import { bomberEntries } from "./bombers-notebook";
import { mmBosses } from "./bosses";

export const majorasMaskData = {
  game: "majoras-mask",
  label: "Majora's Mask",
  items,
  itemCategories,
  masks,
  maskTypes,
  characters,
  dungeons,
  dungeonOrder: dungeonOrderMM,
  locations,
  heartPieces,
  strayFairies: strayFairiesByTemple,
  allStrayFairies: getAllStrayFairies(),
  quests,
  questTypes,
  songs,
  songCategories,
  bomberEntries,
  bosses: mmBosses,
};

export {
  items,
  itemCategories,
  masks,
  maskTypes,
  characters,
  dungeons,
  dungeonOrderMM,
  locations,
  heartPieces,
  strayFairiesByTemple,
  getAllStrayFairies,
  quests,
  questTypes,
  songs,
  songCategories,
  bomberEntries,
  mmBosses,
};

export const mmProgressCategories = [
  {
    id: "story",
    label: "História Principal",
    items: [
      { id: "deku-mask", name: "Deku Mask" },
      { id: "goron-mask", name: "Goron Mask" },
      { id: "zora-mask", name: "Zora Mask" },
      { id: "fierce-deity", name: "Fierce Deity's Mask" },
      { id: "odolwa-remains", name: "Odolwa's Remains" },
      { id: "goht-remains", name: "Goht's Remains" },
      { id: "gyorg-remains", name: "Gyorg's Remains" },
      { id: "twinmold-remains", name: "Twinmold's Remains" },
    ],
  },
  {
    id: "dungeons",
    label: "Templos",
    items: dungeons.map((d) => ({
      id: d.id,
      name: d.name,
    })),
  },
  {
    id: "masks",
    label: "Máscaras (24)",
    items: masks.map((m) => ({
      id: m.id,
      name: m.name,
    })),
    total: masks.length,
  },
  {
    id: "songs",
    label: "Canções",
    items: songs.map((s) => ({
      id: s.id,
      name: s.name,
    })),
  },
  {
    id: "heart-pieces",
    label: "Heart Pieces (52)",
    items: heartPieces.map((h) => ({
      id: h.id,
      name: h.name,
    })),
    total: heartPieces.length,
  },
  {
    id: "stray-fairies",
    label: "Stray Fairies (60)",
    items: getAllStrayFairies().map((f) => ({
      id: f.id,
      name: f.name,
    })),
    total: getAllStrayFairies().length,
  },
];
