import { items, itemCategories } from "./items";
import { characters } from "./characters";
import { dungeons, dungeonOrderOoT } from "./dungeons";
import { locations } from "./locations";
import { heartPieces } from "./heart-pieces";
import { skulltulaRegions, getAllSkulltulas } from "./skulltulas";
import { greatFairies } from "./great-fairies";
import { quests, questTypes } from "./quests";
import { songs, songCategories } from "./songs";
import { ootBosses } from "./bosses";
import { upgrades } from "./upgrades";

export const ocarinaOfTimeData = {
  game: "ocarina-of-time",
  label: "Ocarina of Time",
  items,
  upgrades,
  itemCategories,
  characters,
  dungeons,
  dungeonOrder: dungeonOrderOoT,
  locations,
  heartPieces,
  skulltulaRegions,
  skulltulas: getAllSkulltulas(),
  greatFairies,
  quests,
  questTypes,
  songs,
  songCategories,
  bosses: ootBosses,
};

export {
  items,
  itemCategories,
  characters,
  dungeons,
  dungeonOrderOoT,
  locations,
  heartPieces,
  skulltulaRegions,
  getAllSkulltulas,
  greatFairies,
  quests,
  questTypes,
  songs,
  songCategories,
  ootBosses,
};

export const ootProgressCategories = [
  {
    id: "story",
    label: "História Principal",
    items: [
      { id: "kokiri-emerald", name: "Kokiri Emerald" },
      { id: "goron-ruby", name: "Goron Ruby" },
      { id: "zora-sapphire", name: "Zora Sapphire" },
      { id: "forest-medallion", name: "Forest Medallion" },
      { id: "fire-medallion", name: "Fire Medallion" },
      { id: "water-medallion", name: "Water Medallion" },
      { id: "shadow-medallion", name: "Shadow Medallion" },
      { id: "spirit-medallion", name: "Spirit Medallion" },
      { id: "light-medallion", name: "Light Medallion" },
    ],
  },
  {
    id: "dungeons",
    label: "Dungeons",
    items: dungeons.map((d) => ({
      id: d.id,
      name: d.name,
    })),
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
    label: "Heart Pieces",
    items: heartPieces.map((h) => ({
      id: h.id,
      name: h.name,
    })),
    total: heartPieces.length,
  },
  {
    id: "skulltulas",
    label: "Gold Skulltulas",
    items: getAllSkulltulas().map((s) => ({
      id: s.id,
      name: `Gold Skulltula #${s.number}`,
    })),
    total: getAllSkulltulas().length,
  },
  {
    id: "great-fairies",
    label: "Great Fairies",
    items: greatFairies.map((f) => ({
      id: f.id,
      name: f.name,
    })),
    total: greatFairies.length,
  },
  {
    id: "bottles",
    label: "Garrafas",
    items: [
      { id: "bottle-1", name: "Bottle #1" },
      { id: "bottle-2", name: "Bottle #2" },
      { id: "bottle-3", name: "Bottle #3" },
      { id: "bottle-4", name: "Bottle #4" },
    ],
    total: 4,
  },
  {
    id: "quests",
    label: "Missões",
    items: quests.map((q) => ({
      id: q.id,
      name: q.name,
    })),
  },
];
