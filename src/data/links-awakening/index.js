import { items, itemCategories } from "./items";
import { characters } from "./characters";
import { dungeons, dungeonOrderLA } from "./dungeons";
import { locations } from "./locations";
import { songs, songCategories } from "./songs";
import { laBosses } from "./bosses";
import { heartPieces } from "./heart-pieces";
import { quests, questTypes } from "./quests";

export const linksAwakeningData = {
  game: "links-awakening",
  label: "Link's Awakening",
  items,
  itemCategories,
  characters,
  dungeons,
  dungeonOrder: dungeonOrderLA,
  locations,
  songs,
  songCategories,
  bosses: laBosses,
  heartPieces,
  quests,
  questTypes,
};

export const laProgressCategories = [
  {
    id: "story",
    label: "História Principal",
    items: [
      { id: "tail-cave", name: "Tail Cave" },
      { id: "bottle-grotto", name: "Bottle Grotto" },
      { id: "kanalet-castle", name: "Kanalet Castle" },
      { id: "catfish-maw", name: "Catfish's Maw" },
      { id: "key-cavern", name: "Key Cavern" },
      { id: "anglers-tunnel", name: "Angler's Tunnel" },
      { id: "face-shrine", name: "Face Shrine" },
      { id: "eagles-tower", name: "Eagle's Tower" },
      { id: "turtle-rock", name: "Turtle Rock" },
      { id: "wind-fish", name: "Wind Fish" },
    ],
  },
  {
    id: "dungeons",
    label: "Dungeons",
    items: dungeons.map((d) => ({ id: d.id, name: d.name })),
  },
  {
    id: "instruments",
    label: "Instrumentos",
    items: songs.filter((s) => s.order).map((s) => ({ id: s.id, name: s.name })),
  },
  {
    id: "heart-pieces",
    label: "Heart Pieces",
    items: heartPieces.map((h) => ({ id: h.id, name: h.name })),
    total: heartPieces.length,
  },
  {
    id: "quests",
    label: "Missões",
    items: quests.map((q) => ({ id: q.id, name: q.name })),
  },
];
