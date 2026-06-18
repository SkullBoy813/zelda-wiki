import { create } from "zustand";
import { api } from "../lib/api-client";

const useStore = create((set, get) => ({
  // Auth state is managed by AuthContext, but we keep a synced flag
  isSynced: false,
  setSynced: (val) => set({ isSynced: val }),

  // Theme variants (persisted to localStorage)
  variants: (() => {
    try { return JSON.parse(localStorage.getItem("zelda-variants") || "{}"); }
    catch { return {}; }
  })(),
  setVariant: (game, variant) => {
    set((state) => {
      const newVariants = { ...state.variants, [game]: variant };
      try { localStorage.setItem("zelda-variants", JSON.stringify(newVariants)); } catch {}
      return { variants: newVariants };
    });
  },

  // View mode (persisted to localStorage)
  viewMode: (() => {
    try { return localStorage.getItem("zelda-view-mode") || "grid"; }
    catch { return "grid"; }
  })(),
  setViewMode: (mode) => {
    try { localStorage.setItem("zelda-view-mode", mode); } catch {}
    set({ viewMode: mode });
  },

  // Recently viewed (persisted to localStorage)
  recentlyViewed: (() => {
    try { return JSON.parse(localStorage.getItem("zelda-recent") || "[]"); }
    catch { return []; }
  })(),
  addRecent: (item) => {
    set((state) => {
      const filtered = state.recentlyViewed.filter((r) => r.id !== item.id);
      const updated = [item, ...filtered].slice(0, 8);
      try { localStorage.setItem("zelda-recent", JSON.stringify(updated)); } catch {}
      return { recentlyViewed: updated };
    });
  },

  // Progress tracking
  checked: {},

  toggleChecked: (category, id) => {
    const key = `${category}:${id}`;
    const newVal = !get().checked[key];

    set((state) => ({
      checked: { ...state.checked, [key]: newVal },
    }));

    // Sync to backend if user is logged in
    const token = localStorage.getItem("zelda-wiki-token");
    if (token) {
      const game = window.location.pathname.startsWith("/mm")
        ? "majoras-mask"
        : "ocarina-of-time";
      api.toggleProgress(game, category, id, newVal).catch(() => {});
    }
  },

  isChecked: (category, id) => {
    return !!get().checked[`${category}:${id}`];
  },

  getProgress: (category, items) => {
    const state = get();
    const total = items.length;
    const done = items.filter((item) => state.checked[`${category}:${item.id}`]).length;
    return { total, done, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
  },

  getOverallProgress: (categories) => {
    let total = 0;
    let done = 0;
    const state = get();

    for (const cat of categories) {
      if (cat.items) {
        total += cat.items.length;
        done += cat.items.filter((item) => state.checked[`${cat.id}:${item.id}`]).length;
      }
    }

    return { total, done, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
  },

  resetProgress: (game) => {
    set({ checked: {} });
    const token = localStorage.getItem("zelda-wiki-token");
    if (token) {
      api.resetProgress(game).catch(() => {});
    }
  },

  loadProgressFromServer: async (game) => {
    const token = localStorage.getItem("zelda-wiki-token");
    if (!token) return;

    try {
      const data = await api.getProgress(game);
      set({ checked: data.progress || {}, isSynced: true });
    } catch {
      // Keep local state
    }
  },

  // Favorites
  favorites: [],

  loadFavoritesFromServer: async () => {
    const token = localStorage.getItem("zelda-wiki-token");
    if (!token) return;

    try {
      const data = await api.getFavorites();
      set({ favorites: data.favorites || [] });
    } catch {}
  },

  addFavorite: async (id, name, type) => {
    const game = window.location.pathname.startsWith("/mm")
      ? "majoras-mask"
      : "ocarina-of-time";

    set((state) => ({
      favorites: state.favorites.includes(id)
        ? state.favorites
        : [...state.favorites, { entity_id: id, entity_name: name, entity_type: type }],
    }));

    const token = localStorage.getItem("zelda-wiki-token");
    if (token) {
      try {
        await api.addFavorite(game, type, id, name);
      } catch {}
    }
  },

  removeFavorite: async (id) => {
    set((state) => ({
      favorites: state.favorites.filter((f) => (f.entity_id || f) !== id),
    }));

    const token = localStorage.getItem("zelda-wiki-token");
    if (token) {
      const stored = get().favorites.find((f) => f.entity_id === id);
      if (stored) {
        await api.removeFavorite(stored.entity_type, id).catch(() => {});
      }
    }
  },

  // Search history (local only for now)
  searchHistory: [],
  addSearch: (query) =>
    set((state) => ({
      searchHistory: [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 10),
    })),
  clearSearchHistory: () => set({ searchHistory: [] }),
}));

export default useStore;
