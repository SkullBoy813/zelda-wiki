import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { searchAllLocal } from "../../data";
import { searchAll } from "../../lib/search";
import { Badge } from "../ui/badge";
import { useAuth } from "../../context/AuthContext";
import useStore from "../../store/useStore";

const typeLabels = {
  item: "Item",
  character: "Personagem",
  dungeon: "Dungeon",
  location: "Local",
  quest: "Missão",
  song: "Canção",
  mask: "Máscara",
  "item-api": "Item",
  "character-api": "Personagem",
  "dungeon-api": "Dungeon",
  boss: "Chefe",
  monster: "Monstro",
  place: "Local",
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const addSearch = useStore((s) => s.addSearch);
  const searchHistory = useStore((s) => s.searchHistory);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    if (query.length > 0) {
      setSearching(true);

      const timeout = setTimeout(async () => {
        try {
          const apiResults = await searchAll(query);
          if (apiResults.length > 0) {
            setResults(apiResults);
          } else {
            const localResults = searchAllLocal(query);
            setResults(localResults);
          }
        } catch {
          const localResults = searchAllLocal(query);
          setResults(localResults);
        }
        setSearching(false);
        setIsOpen(true);
        setSelectedIndex(-1);
      }, 150);

      return () => clearTimeout(timeout);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target) && !inputRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getRoute = (result) => {
    const t = result._type || result.type;
    const game = result._game || result.game;
    const gameRoute = game === "ocarina-of-time" ? "oot" : "mm";
    const id = result._id || result.id;

    if (t === "item" || t === "item-api") return `/${gameRoute}/items/${id}`;
    if (t === "mask") return `/${gameRoute}/masks/${id}`;
    if (t === "character" || t === "character-api") return `/${gameRoute}/characters/${id}`;
    if (t === "dungeon" || t === "dungeon-api") return `/${gameRoute}/dungeons/${id}`;
    if (t === "boss") return `/${gameRoute}/bosses/${id}`;
    if (t === "monster") return `/${gameRoute}/monsters/${id}`;
    if (t === "location" || t === "place") return `/${gameRoute}/locations/${id}`;
    if (t === "quest") return `/${gameRoute}/quests/${id}`;
    if (t === "song") return `/${gameRoute}/songs/${id}`;
    return "/";
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        if (user) addSearch(results[selectedIndex].name || query);
        navigate(getRoute(results[selectedIndex]));
        setIsOpen(false);
        setQuery("");
      } else if (results.length > 0) {
        if (user) addSearch(results[0].name || query);
        navigate(getRoute(results[0]));
        setIsOpen(false);
        setQuery("");
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (query || searchHistory.length > 0) setIsOpen(true); }}
          placeholder="Buscar itens, personagens, dungeons, monstros..."
          className="w-full pl-10 pr-10 py-3 glass border border-[var(--color-border)] rounded-xl text-[var(--color-text-main)] placeholder-[var(--color-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)]/60 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {searching ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            )}
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full mt-2 w-full glass-dark border border-[var(--color-border)] rounded-xl overflow-hidden shadow-2xl shadow-[var(--color-gold)]/5 z-50 max-h-96 overflow-y-auto"
        >
          {results.map((result, index) => {
            const t = result._type || result.type;
            const gameLabel = result._gameLabel || result.gameLabel;
            const isApi = t?.endsWith("-api");
            return (
              <button
                key={`${t}-${result._id || result.id}`}
                onClick={() => {
                  navigate(getRoute(result));
                  setIsOpen(false);
                  setQuery("");
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                 className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  index === selectedIndex ? "bg-white/5" : "hover:bg-white/5"
                }`}
              >
                <Badge variant={isApi ? "gold" : "outline"}>
                  {isApi ? "API" : gameLabel === "Ocarina of Time" ? "OoT" : "MM"}
                </Badge>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--color-text-main)] truncate">{result.name}</div>
                  <div className="text-xs text-[var(--color-text-muted)] truncate">{result.description?.slice(0, 80)}</div>
                </div>
                <span className="text-xs text-[var(--color-text-dim)] uppercase whitespace-nowrap">
                  {typeLabels[t] || t}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {isOpen && query && results.length === 0 && !searching && (
        <div className="absolute top-full mt-2 w-full glass-dark border border-[var(--color-border)] rounded-xl p-4 text-center text-[var(--color-text-dim)]">
          Nenhum resultado encontrado para "{query}"
        </div>
      )}

      {isOpen && !query && searchHistory.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-dark border border-[var(--color-border)] rounded-xl overflow-hidden shadow-2xl shadow-[var(--color-gold)]/5 z-50">
          <div className="px-4 py-2 text-xs text-[var(--color-text-dim)] uppercase tracking-wider">Buscas Recentes</div>
          {searchHistory.slice(0, 5).map((q, i) => (
            <button
              key={i}
              onClick={() => setQuery(q)}
              className="w-full text-left px-4 py-2 text-sm text-[var(--color-text-muted)] hover:bg-white/5 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
