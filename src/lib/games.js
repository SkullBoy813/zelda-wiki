export const GAMES = {
  OOT: "ocarina-of-time",
  MM: "majoras-mask",
  LA: "links-awakening",
};

export const GAME_LABELS = {
  [GAMES.OOT]: "Ocarina of Time",
  [GAMES.MM]: "Majora's Mask",
  [GAMES.LA]: "Link's Awakening",
};

export const GAME_COLORS = {
  [GAMES.OOT]: {
    primary: "#2d5a27",
    secondary: "#50c878",
    accent: "#d4a843",
  },
  [GAMES.MM]: {
    primary: "#7c3aed",
    secondary: "#fbbf24",
    accent: "#dc2626",
  },
  [GAMES.LA]: {
    primary: "#1a3a5c",
    secondary: "#60a5fa",
    accent: "#34d399",
  },
};

export const GAME_ROUTES = {
  [GAMES.OOT]: "/oot",
  [GAMES.MM]: "/mm",
  [GAMES.LA]: "/la",
};
