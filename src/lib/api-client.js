const API_BASE = "/api";

function getToken() {
  try {
    return localStorage.getItem("zelda-wiki-token");
  } catch {
    return null;
  }
}

async function request(method, path, body = null) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const opts = { method, headers };
  if (body) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, opts);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Erro na requisição");
  }

  return json;
}

export const api = {
  // Auth
  register: (email, username, password) =>
    request("POST", "/auth/register", { email, username, password }),

  login: (email, password) =>
    request("POST", "/auth/login", { email, password }),

  getMe: () => request("GET", "/auth/me"),

  // Progress
  getProgress: (game) => request("GET", `/progress?game=${game || ""}`),

  toggleProgress: (game, category, itemId, checked) =>
    request("POST", "/progress/toggle", { game, category, itemId, checked }),

  batchProgress: (items) =>
    request("POST", "/progress/batch", { items }),

  resetProgress: (game) => request("DELETE", `/progress${game ? `?game=${game}` : ""}`),

  // Favorites
  getFavorites: () => request("GET", "/favorites"),

  addFavorite: (game, entityType, entityId, entityName) =>
    request("POST", "/favorites/add", { game, entityType, entityId, entityName }),

  removeFavorite: (entityType, entityId) =>
    request("DELETE", `/favorites/${entityType}/${entityId}`),

  // Search history
  getSearchHistory: () => request("GET", "/search-history"),

  addSearchHistory: (query) =>
    request("POST", "/search-history", { query }),

  clearSearchHistory: () => request("DELETE", "/search-history"),
};
