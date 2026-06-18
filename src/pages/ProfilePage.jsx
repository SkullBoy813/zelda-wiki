import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useStore from "../store/useStore";
import { Card, CardTitle, CardContent } from "../components/ui/card";
import { ProgressBar } from "../components/ui/progress-bar";
import { gameData, progressCategories } from "../data";
import { GAME_LABELS } from "../lib/games";
import { usePageTitle } from "../hooks/usePageTitle";
import { VARIANTS } from "../lib/themes";

const rankThresholds = [
  { min: 0, title: "Viajante", icon: "🚶" },
  { min: 10, title: "Aprendiz", icon: "📖" },
  { min: 25, title: "Aventureiro", icon: "⚔️" },
  { min: 50, title: "Herói", icon: "🛡️" },
  { min: 75, title: "Lenda", icon: "👑" },
  { min: 90, title: "Sábio", icon: "🔮" },
  { min: 100, title: "Mestre", icon: "⭐" },
];

function getRank(percentage) {
  return rankThresholds.reduce((prev, curr) => (percentage >= curr.min ? curr : prev), rankThresholds[0]);
}

function CategoryProgressCard({ cat, accentColor }) {
  const getProgress = useStore((s) => s.getProgress);
  const p = getProgress(cat.id, cat.items || []);
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{cat.icon || "📦"}</span>
          <span className="text-xs text-gray-300 font-medium">{cat.label}</span>
        </div>
        <span className="text-[11px] text-gray-500">
          <span className="text-white font-medium">{p.done}</span>/{p.total || cat.items?.length || 0}
        </span>
      </div>
      <div className="relative h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${p.percentage || 0}%`, background: accentColor || "var(--color-gold)" }}
        />
      </div>
      <p className="text-[10px] text-gray-600 mt-0.5 text-right">{p.percentage || 0}%</p>
    </div>
  );
}

function GameStatsCard({ gameKey, accentColor }) {
  const cats = progressCategories[gameKey] || [];
  const getOverallProgress = useStore((s) => s.getOverallProgress);
  const progress = getOverallProgress(cats);
  const rank = getRank(progress.percentage);
  const data = gameData[gameKey];
  const isOot = gameKey === "ocarina-of-time";
  const totalCollectibles = isOot
    ? (data.heartPieces?.length || 0) + (data.skulltulas?.length || 0) + (data.greatFairies?.length || 0)
    : (data.heartPieces?.length || 0) + (data.allStrayFairies?.length || 0);

  // Calculate collectible-specific progress
  const getProgress = useStore.getState().getProgress;
  const hp = getProgress("heart-pieces", data.heartPieces || []);
  const collectibleItems = [];

  if (isOot) {
    const sk = getProgress("skulltulas", data.skulltulas || []);
    const gf = getProgress("great-fairies", data.greatFairies || []);
    collectibleItems.push({ label: "Coração", done: hp.done, total: hp.total });
    collectibleItems.push({ label: "Skulltulas", done: sk.done, total: sk.total });
    collectibleItems.push({ label: "Fadas", done: gf.done, total: gf.total });
  } else {
    const sf = getProgress("stray-fairies", data.allStrayFairies || []);
    collectibleItems.push({ label: "Coração", done: hp.done, total: hp.total });
    collectibleItems.push({ label: "Stray Fairies", done: sf.done, total: sf.total });
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{rank.icon}</span>
              <div>
                <h3 className="text-lg font-cinzel font-bold text-white">{GAME_LABELS[gameKey]}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{rank.title}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-white">{progress.percentage}%</span>
          </div>
        </div>

        <ProgressBar value={progress.percentage} size="lg" showLabel={false} className="mb-5" />

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{ label: "Geral", done: progress.done, total: progress.total },
            { label: "Colecionáveis", done: collectibleItems.reduce((a, c) => a + c.done, 0), total: collectibleItems.reduce((a, c) => a + c.total, 0) },
            { label: "Favoritos", done: 0, total: 0 },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-2 rounded-lg bg-white/[0.03]">
              <p className="text-lg font-bold text-white">{stat.total > 0 ? Math.round((stat.done / stat.total) * 100) : 0}%</p>
              <p className="text-[10px] text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Colecionáveis</p>
        <div className="space-y-2">
          {collectibleItems.map((ci) => (
            <div key={ci.label}>
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-gray-400">{ci.label}</span>
                <span className="text-gray-500">{ci.done}/{ci.total}</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${ci.total > 0 ? Math.round((ci.done / ci.total) * 100) : 0}%`, background: accentColor || "var(--color-gold)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfilePage() {
  usePageTitle("Perfil");
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const favorites = useStore((s) => s.favorites);
  const loadFavoritesFromServer = useStore((s) => s.loadFavoritesFromServer);
  const searchHistory = useStore((s) => s.searchHistory);
  const clearSearchHistory = useStore((s) => s.clearSearchHistory);
  const resetProgress = useStore((s) => s.resetProgress);
  const variants = useStore((s) => s.variants);
  const setVariant = useStore((s) => s.setVariant);
  const viewMode = useStore((s) => s.viewMode);
  const setViewMode = useStore((s) => s.setViewMode);

  const ootVariant = variants["ocarina-of-time"] || "default";
  const mmVariant = variants["majoras-mask"] || "default";
  const ootVariants = VARIANTS["ocarina-of-time"];
  const mmVariants = VARIANTS["majoras-mask"];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      loadFavoritesFromServer();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="mb-6">
        <Link to="/" className="text-sm text-gray-400 hover:text-[var(--color-gold)] transition-colors">
          ← Início
        </Link>
      </div>

      {/* Perfil Header */}
      <div className="flex items-center gap-5 mb-10 p-5 glass rounded-xl border border-[var(--color-border)]">
        <div className="w-16 h-16 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center text-2xl font-bold text-[var(--color-gold)] border-2 border-[var(--color-gold)]/30 glow-shadow-md shrink-0">
          {user.username[0].toUpperCase()}
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-cinzel font-bold text-white">{user.username}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="ml-auto px-4 py-2 text-sm border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors shrink-0"
        >
          Sair
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 items-start">
        {/* COLUNA ESQUERDA: Progresso (3/5) */}
        <div className="lg:col-span-3 space-y-6">
          <GameStatsCard gameKey="ocarina-of-time" accentColor="#fbbf24" />
          <GameStatsCard gameKey="majoras-mask" accentColor="#a78bfa" />
        </div>

        {/* COLUNA DIREITA: Opções (2/5) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preferências */}
          <Card>
            <CardTitle>Preferências</CardTitle>
            <CardContent>
              <div className="space-y-5 mt-3">
                <div>
                  <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Variante Ocarina of Time</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(ootVariants).map(([key, v]) => (
                      <button
                        key={key}
                        onClick={() => setVariant("ocarina-of-time", key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                          ootVariant === key
                            ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-white"
                            : "border-[var(--color-border)] text-gray-400 hover:border-gray-500"
                        }`}
                      >
                        <span>{v.icon}</span>
                        <span>{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Variante Majora's Mask</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(mmVariants).map(([key, v]) => (
                      <button
                        key={key}
                        onClick={() => setVariant("majoras-mask", key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                          mmVariant === key
                            ? "border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-white"
                            : "border-[var(--color-border)] text-gray-400 hover:border-gray-500"
                        }`}
                      >
                        <span>{v.icon}</span>
                        <span>{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <hr className="border-[var(--color-border)]" />
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-white">Visualização em Grade</p>
                    <p className="text-xs text-gray-500">Grade/lista nos colecionáveis</p>
                  </div>
                  <button
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    className={`relative w-12 h-6 rounded-full shrink-0 transition-colors ${
                      viewMode === "grid" ? "bg-[var(--color-gold)]" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        viewMode === "grid" ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Favoritos */}
          <Card>
            <CardTitle>Favoritos ({favorites.length})</CardTitle>
            <CardContent>
              {favorites.length === 0 ? (
                <p className="text-gray-500 text-sm mt-2">Nenhum favorito ainda.</p>
              ) : (
                <div className="space-y-1 mt-2">
                  {favorites.map((fav) => (
                    <Link
                      key={fav.entity_id}
                      to={`/${fav.game === "majoras-mask" ? "mm" : "oot"}/${fav.entity_type}/${fav.entity_id}`}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-gold)]/5 transition-colors text-sm"
                    >
                      <span className="text-[var(--color-gold-light)] shrink-0">★</span>
                      <span className="text-white truncate">{fav.entity_name}</span>
                      <span className="text-gray-500 text-xs ml-auto">{fav.entity_type}</span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Histórico */}
          <Card>
            <div className="flex items-center justify-between mb-2">
              <CardTitle>Buscas</CardTitle>
              {searchHistory.length > 0 && (
                <button onClick={clearSearchHistory} className="text-xs text-gray-500 hover:text-white transition-colors">Limpar</button>
              )}
            </div>
            <CardContent>
              {searchHistory.length === 0 ? (
                <p className="text-gray-500 text-sm">Nenhuma busca recente.</p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {searchHistory.map((q, i) => (
                    <Link
                      key={i}
                      to={`/?search=${encodeURIComponent(q)}`}
                      className="px-3 py-1 bg-[var(--color-gold)]/5 rounded-full text-xs text-gray-300 hover:bg-[var(--color-gold)]/10 transition-colors"
                    >
                      {q}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zona de Perigo */}
          <Card className="border-red-500/20">
            <CardTitle className="text-red-400">Zona de Perigo</CardTitle>
            <CardContent>
              <p className="text-gray-400 text-xs mb-3">Resete todo o seu progresso. Essa ação não pode ser desfeita.</p>
              <button
                onClick={() => { if (confirm("Tem certeza? Todo o progresso será perdido!")) { resetProgress(); } }}
                className="w-full px-4 py-2 text-sm border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Resetar Progresso
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
