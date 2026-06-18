import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gameData } from "../data";
import { fetchMonsters, GAME_NAMES } from "../lib/api";
import { fetchZeldaWikiImage } from "../lib/zelda-wiki-images";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BackButton } from "../components/ui/back-button";
import { GAME_LABELS } from "../lib/games";
import { usePageTitle } from "../hooks/usePageTitle";
import useStore from "../store/useStore";

const typeConfig = {
  items: { label: "Itens", icon: "⚔️", local: true, showImages: true },
  characters: { label: "Personagens", icon: "👤", local: true },
  dungeons: { label: "Dungeons", icon: "🏛️", local: true, checklistCategory: "dungeons" },
  locations: { label: "Regiões", icon: "🗺️", local: true },
  quests: { label: "Missões", icon: "📜", local: true, checklistCategory: "quests" },
  songs: { label: "Canções", icon: "🎵", local: true, checklistCategory: "songs" },
  masks: { label: "Máscaras", icon: "🎭", local: true, checklistCategory: "masks" },
  bosses: { label: "Chefes", icon: "👹", local: true },
  monsters: { label: "Monstros", icon: "🐉", local: false, api: "monsters", fetcher: fetchMonsters },
  "heart-pieces": { label: "Pedacos de Coracao", icon: "❤️", local: true, dataKey: "heartPieces", checklistCategory: "heart-pieces" },
  "skulltulas": { label: "Golden Skulltulas", icon: "🕷️", local: true, dataKey: "skulltulas", checklistCategory: "skulltulas" },
  "great-fairies": { label: "Grandes Fadas", icon: "🧚", local: true, dataKey: "greatFairies", checklistCategory: "great-fairies" },
  "stray-fairies": { label: "Stray Fairies", icon: "✨", local: true, dataKey: "allStrayFairies", checklistCategory: "stray-fairies" },
};

const categoryIcons = {
  "Sword": "🗡️",
  "Shield": "🛡️",
  "Bow": "🏹",
  "Ammo": "➹",
  "Utility": "🔧",
  "Spell": "🔮",
  "Tunic": "👕",
  "Boots": "👢",
  "Gauntlets": "🧤",
  "Scale": "⚖️",
  "Wallet": "👛",
  "Quest": "📜",
  "Bottle": "🧴",
};

function ItemImage({ name, category }) {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      fetchZeldaWikiImage(name).then((u) => {
        setUrl(u);
        setLoading(false);
      });
    }, 50);
    return () => clearTimeout(timerRef.current);
  }, [name]);

  if (url) {
    return (
      <div className="w-10 sm:w-12 h-10 sm:h-12 shrink-0 bg-[var(--color-bg-card)]/30 rounded-lg flex items-center justify-center overflow-hidden">
        <img src={url} alt={name} className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <div className="w-10 sm:w-12 h-10 sm:h-12 shrink-0 bg-[var(--color-bg-card)]/20 rounded-lg flex items-center justify-center">
      <span className="text-base sm:text-xl">{categoryIcons[category] || "📦"}</span>
    </div>
  );
}

export function ListPage() {
  const loc = useLocation();
  const segments = loc.pathname.split("/").filter(Boolean);
  const game = segments[0] || "oot";
  const type = segments[1] || "";
  const gameFull = game === "oot" ? "ocarina-of-time" : game === "la" ? "links-awakening" : "majoras-mask";
  const data = gameData[gameFull];
  const config = typeConfig[type];
  usePageTitle(config?.label ? `${config.label} — ${GAME_LABELS[gameFull]}` : "");
  const [apiItems, setApiItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eraFilter, setEraFilter] = useState("all");
  const checked = useStore((s) => s.checked);
  const toggleChecked = useStore((s) => s.toggleChecked);

  useEffect(() => {
    if (!config?.local && config?.fetcher) {
      setLoading(true);
      const apiName = GAME_NAMES[gameFull === "ocarina-of-time" ? "OOT" : gameFull === "majoras-mask" ? "MM" : "LA"];
      config.fetcher(apiName)
        .then((items) => {
          setApiItems(items);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [type, gameFull]);

  if (!config) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl text-white">Pagina nao encontrada</h1>
        <Link to={`/${game}`} className="text-[var(--color-gold)] hover:underline mt-4 inline-block">Voltar</Link>
      </div>
    );
  }

  const dataKey = config.dataKey || type;
  let items = config.local ? (data?.[dataKey] || []) : apiItems;
  if (eraFilter !== "all") {
    items = items.filter((i) => i.era === eraFilter);
  }
  const cat = config.checklistCategory;

  const getDetailRoute = (item) => {
    const base = `/${game}/${type}`;
    const id = item.id || item._id;
    return `${base}/${id}`;
  };

  const handleCheck = (e, catId, itemId) => {
    e.preventDefault();
    e.stopPropagation();
    toggleChecked(catId, itemId);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="mb-6">
        <BackButton fallbackTo={`/${game}`}>
          ← {GAME_LABELS[gameFull]}
        </BackButton>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <span className="text-xl sm:text-2xl">{config.icon}</span>
        <h1 className="text-xl sm:text-3xl font-cinzel font-bold text-white">{config.label}</h1>
        {!config.local && <Badge variant="gold">API</Badge>}
        {!loading && <span className="text-xs sm:text-sm text-gray-500 shrink-0">({items.length})</span>}
      </div>

      {items.some((i) => i.era) && (
        <div className="mb-4 flex items-center gap-2">
          <select
            value={eraFilter}
            onChange={(e) => setEraFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] outline-none focus:border-[var(--color-gold)]"
          >
            <option value="all">Todas as Eras</option>
            <option value="Child">Criança</option>
            <option value="Adult">Adulto</option>
            <option value="Ambos">Ambos</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Carregando dados da API Zelda...</p>
        </div>
      ) : (
        <div className={`grid sm:grid-cols-2 ${config.showImages ? "lg:grid-cols-2" : "lg:grid-cols-3"} gap-3 sm:gap-4`}>
          {items.map((item, i) => {
            const itemId = item.id || item._id;
            const key = cat ? `${cat}:${itemId}` : null;
            const isChecked = key ? !!checked[key] : false;

            return (
              <Link key={itemId} to={getDetailRoute(item)}>
                <Card className={`border-[var(--color-border)] hover:border-[var(--color-gold)]/30 transition-all duration-300 h-full animate-fade-in-up stagger-${Math.min(i % 6 + 1, 6)}`}>
                  <div className="flex items-start gap-2 sm:gap-3">
                    {cat && (
                      <div onClick={(e) => e.stopPropagation()} className="pt-1">
                        <button
                          onClick={(e) => handleCheck(e, cat, itemId)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                            isChecked
                              ? "bg-[var(--color-gold)] border-[var(--color-gold)]"
                              : "border-gray-500 hover:border-[var(--color-gold)]"
                          }`}
                        >
                          {isChecked && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                              <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                    {config.showImages && <ItemImage name={item.name} category={item.category} />}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-cinzel font-bold text-white mb-0.5 truncate text-sm sm:text-base">
                        {item.namePt || item.name}
                      </h3>
                      {item.namePt && <p className="text-gray-500 text-[9px] sm:text-[10px] italic truncate">{item.name}</p>}
                      {item.description && (
                        <p className="text-gray-400 text-[11px] sm:text-xs line-clamp-2">{item.descriptionPt || item.description}</p>
                      )}
                      {item.role && (
                        <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5 sm:mt-1">{item.role}</p>
                      )}
                      {item.type && (
                        <div className="mt-1 sm:mt-2">
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                      )}
                      {item.location && (
                        <p className="text-gray-500 text-[11px] sm:text-xs mt-0.5 sm:mt-1 truncate">{item.location}</p>
                      )}
                      {item.reward && (
                        <p className="text-[var(--color-gold-light)] text-[11px] sm:text-xs mt-0.5 sm:mt-1">Recompensa: {item.reward}</p>
                      )}
                      {item.era && (
                        <p className="text-gray-500 text-[9px] sm:text-[10px] mt-0.5 sm:mt-1">Era: {item.era}</p>
                      )}
                      {!config.local && item.appearances && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {item.appearances.slice(0, 2).map((url, j) => (
                            <span key={j} className="text-[10px] text-gray-600">
                              {decodeURIComponent(url.split("/").pop()?.slice(0, 15) || "")}
                            </span>
                          ))}
                          {item.appearances.length > 2 && (
                            <span className="text-[10px] text-gray-600">+{item.appearances.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
