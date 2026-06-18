import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { gameData } from "../data";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BackButton } from "../components/ui/back-button";
import { GAME_LABELS } from "../lib/games";
import { usePageTitle } from "../hooks/usePageTitle";
import useStore from "../store/useStore";

const tabs = {
  "ocarina-of-time": [
    { key: "heart-pieces", label: "Coração", icon: "❤️", dataKey: "heartPieces", cat: "heart-pieces" },
    { key: "skulltulas", label: "Skulltulas", icon: "🕷️", dataKey: "skulltulas", cat: "skulltulas" },
    { key: "great-fairies", label: "Fadas", icon: "🧚", dataKey: "greatFairies", cat: "great-fairies" },
  ],
  "majoras-mask": [
    { key: "heart-pieces", label: "Coração", icon: "❤️", dataKey: "heartPieces", cat: "heart-pieces" },
    { key: "stray-fairies", label: "Fadas", icon: "✨", dataKey: "allStrayFairies", cat: "stray-fairies" },
  ],
};

export function CollectiblesPage() {
  const loc = useLocation();
  const segments = loc.pathname.split("/").filter(Boolean);
  const game = segments[0] || "oot";
  const gameFull = game === "oot" ? "ocarina-of-time" : "majoras-mask";
  const data = gameData[gameFull];
  const gameTabs = tabs[gameFull] || [];
  const defaultTab = gameTabs[0]?.key || "";
  const [activeTab, setActiveTab] = useState(defaultTab);

  const currentTab = gameTabs.find((t) => t.key === activeTab) || gameTabs[0];
  const items = currentTab ? (data?.[currentTab.dataKey] || []) : [];
  const isOot = gameFull === "ocarina-of-time";

  usePageTitle(`Colecionáveis — ${GAME_LABELS[gameFull]}`);

  const checked = useStore((s) => s.checked);
  const toggleChecked = useStore((s) => s.toggleChecked);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);
  const addRecent = useStore((s) => s.addRecent);

  const [sortBy, setSortBy] = useState("number");
  const [filterChecked, setFilterChecked] = useState("all");

  const totalItems = useMemo(() => {
    const counts = {};
    gameTabs.forEach((t) => {
      const arr = data?.[t.dataKey] || [];
      counts[t.key] = arr.length;
    });
    return counts;
  }, [data, gameTabs]);

  const sortedItems = useMemo(() => {
    let result = [...items];
    if (sortBy === "number") {
      result.sort((a, b) => (a.number || 0) - (b.number || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.namePt || a.name || "").localeCompare(b.namePt || b.name || ""));
    } else if (sortBy === "location") {
      result.sort((a, b) => (a.location || "").localeCompare(b.location || ""));
    }
    if (filterChecked === "checked") {
      result = result.filter((item) => checked[`${currentTab.cat}:${item.id}`]);
    } else if (filterChecked === "unchecked") {
      result = result.filter((item) => !checked[`${currentTab.cat}:${item.id}`]);
    }
    return result;
  }, [items, sortBy, filterChecked, checked, currentTab.cat]);

  const handleClickItem = (item) => {
    addRecent({
      id: item.id,
      name: item.namePt || item.name || `#${item.number}`,
      game,
      tab: currentTab.key,
    });
  };

  if (!data || !gameTabs.length) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="mb-6">
        <BackButton fallbackTo={`/${game}`}>
          ← {GAME_LABELS[gameFull]}
        </BackButton>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-cinzel font-bold text-white">Colecionáveis</h1>
        <button
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[var(--color-border)] rounded-lg hover:border-[var(--color-gold)]/40 transition-all text-[var(--color-text-muted)] hover:text-[var(--color-gold)]"
          title={viewMode === "grid" ? "Mudar para lista" : "Mudar para grade"}
        >
          {viewMode === "grid" ? (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" /></svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="14" height="3" rx="1" /><rect x="1" y="6.5" width="14" height="3" rx="1" /><rect x="1" y="12" width="14" height="3" rx="1" /></svg>
          )}
          <span className="hidden sm:inline">{viewMode === "grid" ? "Grade" : "Lista"}</span>
        </button>
      </div>

      {/* Abas */}
      <div className="flex gap-1 border-b border-[var(--color-border)] pb-0.5 mb-4 overflow-x-auto scrollbar-none">
        {gameTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium rounded-t-lg transition-all duration-200 border-b-2 whitespace-nowrap ${
              activeTab === tab.key
                ? "text-[var(--color-gold)] border-[var(--color-gold)] bg-[var(--color-gold)]/5"
                : "text-[var(--color-text-dim)] border-transparent hover:text-[var(--color-text-muted)] hover:bg-white/[0.02]"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            <span className="text-[10px] opacity-60">({totalItems[tab.key] || 0})</span>
          </button>
        ))}
      </div>

      {/* Filtros e ordenação */}
      {sortedItems.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] outline-none focus:border-[var(--color-gold)]"
          >
            <option value="number">Número</option>
            <option value="name">Nome</option>
            <option value="location">Local</option>
          </select>
          <select
            value={filterChecked}
            onChange={(e) => setFilterChecked(e.target.value)}
            className="px-3 py-1.5 text-xs bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-muted)] outline-none focus:border-[var(--color-gold)]"
          >
            <option value="all">Todos</option>
            <option value="checked">Coletados</option>
            <option value="unchecked">Pendentes</option>
          </select>
          <span className="text-[10px] text-[var(--color-text-dim)] ml-auto">
            {sortedItems.length} de {items.length}
          </span>
        </div>
      )}

      {/* Itens */}
      {viewMode === "grid" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedItems.map((item, i) => (
            <CollectibleCard
              key={item.id}
              item={item}
              currentTab={currentTab}
              game={game}
              isOot={isOot}
              toggleChecked={toggleChecked}
              checked={checked}
              onClick={() => handleClickItem(item)}
              index={i}
            />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-xl overflow-hidden">
          {sortedItems.map((item, i) => (
            <CollectibleRow
              key={item.id}
              item={item}
              currentTab={currentTab}
              game={game}
              isOot={isOot}
              toggleChecked={toggleChecked}
              checked={checked}
              onClick={() => handleClickItem(item)}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CollectibleCard({ item, currentTab, game, isOot, toggleChecked, checked, onClick, index }) {
  const itemId = item.id;
  const key = currentTab.cat ? `${currentTab.cat}:${itemId}` : null;
  const isChecked = key ? !!checked[key] : false;
  const detailRoute = `/${game}/${currentTab.key}/${itemId}`;

  return (
    <Link to={detailRoute} onClick={onClick}>
      <Card className={`border-[var(--color-border)] hover:border-[var(--color-gold)]/30 transition-all duration-300 h-full animate-fade-in-up ${isChecked ? "opacity-60" : ""} stagger-${Math.min(index % 6 + 1, 6)}`}>
        <div className="flex items-start gap-3">
          {currentTab.cat && (
            <div onClick={(e) => e.stopPropagation()} className="pt-1">
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleChecked(currentTab.cat, itemId); }}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${isChecked ? "bg-[var(--color-gold)] border-[var(--color-gold)]" : "border-gray-500 hover:border-[var(--color-gold)]"}`}
              >
                {isChecked && <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-cinzel font-bold text-white mb-0.5 truncate text-sm">
              {item.namePt || item.name || `${currentTab.label} #${item.number}`}
            </h3>
            {item.location && <p className="text-[var(--color-text-dim)] text-xs truncate">{item.location}</p>}
            {item.region && <p className="text-[var(--color-text-dim)] text-[10px] mt-0.5 truncate">{isOot ? `Região: ${item.region}` : item.region}</p>}
            {item.reward && <p className="text-[var(--color-gold-light)] text-xs mt-1">Recompensa: {item.reward}</p>}
            {item.era && <Badge variant="outline" className="mt-2 text-[10px]">{item.era}</Badge>}
          </div>
        </div>
      </Card>
    </Link>
  );
}

function CollectibleRow({ item, currentTab, game, isOot, toggleChecked, checked, onClick, index }) {
  const itemId = item.id;
  const key = currentTab.cat ? `${currentTab.cat}:${itemId}` : null;
  const isChecked = key ? !!checked[key] : false;
  const detailRoute = `/${game}/${currentTab.key}/${itemId}`;

  return (
    <Link to={detailRoute} onClick={onClick} className={`block px-4 py-2.5 hover:bg-white/[0.02] transition-colors animate-fade-in ${isChecked ? "opacity-50" : ""}`}>
      <div className="flex items-center gap-3">
        {currentTab.cat && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleChecked(currentTab.cat, itemId); }}
            className={`w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-all ${isChecked ? "bg-[var(--color-gold)] border-[var(--color-gold)]" : "border-gray-500 hover:border-[var(--color-gold)]"}`}
          >
            {isChecked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </button>
        )}
        <span className="text-[10px] text-gray-600 w-6 shrink-0">#{item.number}</span>
        <span className="text-sm text-white truncate min-w-0 flex-1">{item.namePt || item.name || `${currentTab.label} #${item.number}`}</span>
        {item.location && <span className="text-xs text-gray-500 truncate hidden sm:block max-w-[200px]">{item.location}</span>}
        {item.reward && <span className="text-[10px] text-[var(--color-gold-light)] hidden md:block">{item.reward}</span>}
      </div>
    </Link>
  );
}
