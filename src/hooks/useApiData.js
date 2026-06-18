import { useState, useEffect, useCallback } from "react";
import { fetchAllGameData } from "../lib/api";
import { ocarinaOfTimeData, majorasMaskData } from "../data";
import { GAME_NAMES } from "../lib/api";

const GAME_MAP = {
  "ocarina-of-time": { local: ocarinaOfTimeData, apiName: GAME_NAMES.OOT },
  "majoras-mask": { local: majorasMaskData, apiName: GAME_NAMES.MM },
};

export function useGameData(gameKey) {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const config = GAME_MAP[gameKey];
  const localData = config?.local || null;

  useEffect(() => {
    if (!gameKey) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchAllGameData(config.apiName)
      .then((data) => {
        if (!cancelled) {
          setApiData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [gameKey]);

  const combined = useCallback(() => {
    if (!localData) return null;

    return {
      ...localData,
      apiItems: apiData?.items || [],
      apiCharacters: apiData?.characters || [],
      apiDungeons: apiData?.dungeons || [],
      apiBosses: apiData?.bosses || [],
      apiMonsters: apiData?.monsters || [],
      apiPlaces: apiData?.places || [],
    };
  }, [localData, apiData]);

  return { data: combined(), loading, error, apiData, localData };
}

export function useEntitySearch(gameKey, query) {
  const { data } = useGameData(gameKey);

  if (!data || !query) return [];

  const q = query.toLowerCase().trim();
  const results = [];

  const collections = [
    { items: data.items, type: "item", gameLabel: data.label },
    { items: data.apiItems, type: "item-api", gameLabel: data.label },
    { items: data.characters, type: "character", gameLabel: data.label },
    { items: data.apiCharacters, type: "character-api", gameLabel: data.label },
    { items: data.dungeons, type: "dungeon", gameLabel: data.label },
    { items: data.apiDungeons, type: "dungeon-api", gameLabel: data.label },
    { items: data.apiBosses, type: "boss", gameLabel: data.label },
    { items: data.apiMonsters, type: "monster", gameLabel: data.label },
    { items: data.locations, type: "location", gameLabel: data.label },
    { items: data.apiPlaces, type: "place", gameLabel: data.label },
    { items: data.quests, type: "quest", gameLabel: data.label },
    { items: data.songs, type: "song", gameLabel: data.label },
    { items: data.masks, type: "mask", gameLabel: data.label },
  ];

  for (const col of collections) {
    for (const item of col.items) {
      const name = (item.name || "").toLowerCase();
      const desc = (item.description || "").toLowerCase();
      if (name.includes(q) || desc.includes(q)) {
        results.push({ ...item, type: col.type, gameLabel: col.gameLabel, game: gameKey });
        if (results.length >= 30) return results;
      }
    }
  }

  return results;
}
