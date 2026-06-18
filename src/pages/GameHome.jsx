import { Link, useLocation } from "react-router-dom";
import { gameData } from "../data";
import { fetchMonsters, GAME_NAMES } from "../lib/api";
import { Card, CardTitle, CardContent } from "../components/ui/card";
import { SearchBar } from "../components/search/SearchBar";
import { ProgressOverview } from "../components/dashboard/ProgressOverview";
import { ThemeVariantPicker } from "../components/theme/ThemeVariantPicker";
import { progressCategories } from "../data";
import { GAME_LABELS } from "../lib/games";
import { usePageTitle } from "../hooks/usePageTitle";
import useStore from "../store/useStore";
import { useState, useEffect } from "react";

export function GameHome() {
  const loc = useLocation();
  const game = loc.pathname === "/mm" ? "mm" : "oot";
  const gameFull = game === "oot" ? "ocarina-of-time" : "majoras-mask";
  usePageTitle(GAME_LABELS[gameFull]);
  const data = gameData[gameFull];
  const categories = progressCategories[gameFull] || [];
  const [monsterCount, setMonsterCount] = useState(0);
  const [monsterLoading, setMonsterLoading] = useState(true);
  const recentlyViewed = useStore((s) => s.recentlyViewed);
  const gameRecent = recentlyViewed.filter((r) => r.game === game);

  useEffect(() => {
    const apiName = GAME_NAMES[gameFull === "ocarina-of-time" ? "OOT" : "MM"];
    fetchMonsters(apiName).then((m) => {
      setMonsterCount(m.length);
      setMonsterLoading(false);
    }).catch(() => setMonsterLoading(false));
  }, [gameFull]);

  if (!data) return null;

  const isOot = gameFull === "ocarina-of-time";
  const accent = isOot ? "var(--color-gold)" : "var(--color-green-sage)";
  const accentLabel = isOot ? "gold" : "green-sage";
  const bannerSrc = isOot ? "/images/banner ocarina of time.jpg" : "/images/zelda majoras mask banner.jpg";

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <section className="relative overflow-hidden min-h-[280px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${bannerSrc}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg-main)] via-[var(--color-bg-main)]/70 to-[var(--color-bg-main)]" />

        {/* Decoração temática OoT */}
        {isOot && (
          <>
            <div className="absolute top-4 right-[10%] text-[var(--color-gold)] opacity-[0.06] pointer-events-none select-none font-cinzel text-[120px] leading-none rotate-12">
              ◊
            </div>
            <div className="absolute bottom-8 left-[5%] flex gap-1 opacity-[0.05] pointer-events-none">
              {["♪", "♫", "♪", "♩"].map((n, i) => (
                <span key={i} className="text-[var(--color-gold)] text-2xl animate-oot-float" style={{ animationDelay: `${i * 0.5}s` }}>{n}</span>
              ))}
            </div>
            <svg className="absolute top-1/2 left-[6%] -translate-y-1/2 w-12 h-12 text-[var(--color-gold)] opacity-[0.04] pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" />
            </svg>
          </>
        )}

        {/* Decoração temática MM */}
        {!isOot && (
          <>
            <div className="absolute -top-10 -right-10 w-40 h-40 border-[20px] border-[var(--color-gold)] rounded-full opacity-[0.04] pointer-events-none" />
            <div className="absolute bottom-12 right-[8%] flex flex-col items-center opacity-[0.04] pointer-events-none">
              <span className="text-[var(--color-gold)] text-3xl font-cinzel">III</span>
              <span className="text-[var(--color-text-dim)] text-[10px] tracking-widest mt-1">DIAS</span>
            </div>
            <svg className="absolute top-1/4 right-[12%] w-10 h-10 text-[var(--color-gold)] opacity-[0.04] pointer-events-none animate-mm-moon-glow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </>
        )}

        <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-[var(--color-gold)] mb-2 animate-fade-in-up glow-text-lg">
            {GAME_LABELS[gameFull]}
          </h1>
          <p className={`text-sm text-[var(--color-text-muted)] mb-6 animate-fade-in-up stagger-2 ${isOot ? "" : "animate-mm-moon-glow"}`}>
            {isOot ? "A Jornada do Herói do Tempo" : "Os Três Dias que Mudaram Termina"}
          </p>
          <div className="animate-fade-in-up stagger-3">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16 grid lg:grid-cols-5 gap-6 items-start">
        {/* COLUNA ESQUERDA: Progresso Geral (2/5) */}
        <div className="lg:col-span-2 space-y-4">
          <section>
            <ProgressOverview categories={categories} />
          </section>

          {/* Tema + Links Rápidos abaixo do progresso */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardTitle>Tema</CardTitle>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-gray-400">Variante de cor para {isOot ? "Ocarina of Time" : "Majora's Mask"}:</span>
                  <ThemeVariantPicker gameFull={gameFull} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Links Rápidos</CardTitle>
              <CardContent>
                <div className="space-y-1 mt-2">
                  <Link to={`/${game}/checklists`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white transition-all">
                    <span>✅</span> Checklists
                  </Link>
                  <Link to={`/${game}/collectibles`} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white transition-all">
                    <span>💎</span> Colecionáveis
                  </Link>
                  <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white transition-all">
                    <span>📊</span> Perfil
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* COLUNA DIREITA: Enciclopédia + Visitados/Citação (3/5) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Vistos Recentemente + Citação em linha */}
          {gameRecent.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardTitle>Visitados</CardTitle>
                <CardContent>
                  <div className="space-y-1 mt-2">
                    {gameRecent.map((item) => (
                      <Link
                        key={item.id}
                        to={`/${game}/${item.tab}/${item.id}`}
                        className="block px-3 py-1.5 rounded-lg text-xs text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white transition-all truncate"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[var(--color-border)]">
                <CardContent>
                  <p className="text-xs text-[var(--color-text-dim)] italic leading-relaxed">
                    {isOot
                      ? "\"O fluxo do tempo é sempre cruel... sua velocidade parece diferente para cada pessoa.\""
                      : "\"Você encontrou um destino terrível, não encontrou?\""}
                  </p>
                  <p className="text-[9px] text-[var(--color-text-dim)] mt-2 tracking-wider uppercase">
                    — {isOot ? "Sheik" : "A Venda Misteriosa"}
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border-[var(--color-border)]">
              <CardContent>
                <p className="text-xs text-[var(--color-text-dim)] italic leading-relaxed">
                  {isOot
                    ? "\"O fluxo do tempo é sempre cruel... sua velocidade parece diferente para cada pessoa.\""
                    : "\"Você encontrou um destino terrível, não encontreu?\""}
                </p>
                <p className="text-[9px] text-[var(--color-text-dim)] mt-2 tracking-wider uppercase">
                  — {isOot ? "Sheik" : "A Venda Misteriosa"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Enciclopédia */}
          <section>
            <h2 className="text-xl font-cinzel font-bold text-[var(--color-gold)] mb-4 glow-text-sm">Enciclopédia</h2>
            <div className="encyclopedia-grid grid grid-cols-2 md:grid-cols-3 gap-4">
              <Link to={`/${game}/items`}>
                <Card className="encyclopedia-card animate-fade-in-up" glow>
                  <div className="flex items-start gap-5">
                    <span className="encyclopedia-icon shrink-0 self-center">🗡️</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-cinzel font-bold text-[var(--color-gold)] text-base mb-0.5">Itens <span className="encyclopedia-count">({data.items?.length || 0})</span></h3>
                      <p className="text-[var(--color-text-dim)] text-xs">Equipamentos do jogo</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to={`/${game}/characters`}>
                <Card className="encyclopedia-card animate-fade-in-up stagger-2" glow>
                  <div className="flex items-start gap-5">
                    <span className="encyclopedia-icon shrink-0 self-center">👤</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-cinzel font-bold text-[var(--color-gold)] text-base mb-0.5">Personagens <span className="encyclopedia-count">({data.characters?.length || 0})</span></h3>
                      <p className="text-[var(--color-text-dim)] text-xs">Habitantes do jogo</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to={`/${game}/dungeons`}>
                <Card className="encyclopedia-card animate-fade-in-up stagger-3" glow>
                  <div className="flex items-start gap-5">
                    <span className="encyclopedia-icon shrink-0 self-center">🏰</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-cinzel font-bold text-[var(--color-gold)] text-base mb-0.5">Dungeons <span className="encyclopedia-count">({data.dungeons?.length || 0})</span></h3>
                      <p className="text-[var(--color-text-dim)] text-xs">Templos e calabouços</p>
                    </div>
                  </div>
                </Card>
              </Link>
              {gameFull === "majoras-mask" && (
                <Link to="/mm/masks">
                  <Card className="encyclopedia-card animate-fade-in-up stagger-4" glow>
                    <div className="flex items-start gap-4">
                      <span className="encyclopedia-icon shrink-0">🎭</span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-cinzel font-bold text-[var(--color-gold)] text-base mb-0.5">Máscaras <span className="encyclopedia-count">({data.masks?.length || 0})</span></h3>
                        <p className="text-[var(--color-text-dim)] text-xs">Máscaras do jogo</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )}
              <Link to={`/${game}/locations`}>
                <Card className="encyclopedia-card animate-fade-in-up stagger-4" glow>
                  <div className="flex items-start gap-5">
                    <span className="encyclopedia-icon shrink-0 self-center">🌍</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-cinzel font-bold text-[var(--color-gold)] text-base mb-0.5">Locais <span className="encyclopedia-count">({data.locations?.length || 0})</span></h3>
                      <p className="text-[var(--color-text-dim)] text-xs">Regiões do mundo</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to={`/${game}/quests`}>
                <Card className="encyclopedia-card animate-fade-in-up stagger-5" glow>
                  <div className="flex items-start gap-5">
                    <span className="encyclopedia-icon shrink-0 self-center">📜</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-cinzel font-bold text-[var(--color-gold)] text-base mb-0.5">Missões <span className="encyclopedia-count">({data.quests?.length || 0})</span></h3>
                      <p className="text-[var(--color-text-dim)] text-xs">Side quests</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to={`/${game}/songs`}>
                <Card className="encyclopedia-card animate-fade-in-up stagger-6" glow>
                  <div className="flex items-start gap-5">
                    <span className="encyclopedia-icon shrink-0 self-center">🎵</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-cinzel font-bold text-[var(--color-gold)] text-base mb-0.5">Músicas <span className="encyclopedia-count">({data.songs?.length || 0})</span></h3>
                      <p className="text-[var(--color-text-dim)] text-xs">Canções da Ocarina</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to={`/${game}/collectibles`}>
                <Card className="encyclopedia-card animate-fade-in-up" glow>
                  <div className="flex items-start gap-5">
                    <span className="encyclopedia-icon shrink-0 self-center">💎</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-cinzel font-bold text-[var(--color-gold)] text-base mb-0.5">Colecionáveis <span className="encyclopedia-count">
                        ({isOot ? (data.heartPieces?.length || 0) + (data.skulltulas?.length || 0) + (data.greatFairies?.length || 0) : (data.heartPieces?.length || 0) + (data.allStrayFairies?.length || 0)})
                      </span></h3>
                      <p className="text-[var(--color-text-dim)] text-xs">Corações, Skulltulas, Fadas</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to={`/${game}/bosses`}>
                <Card className="encyclopedia-card animate-fade-in-up stagger-2" glow>
                  <div className="flex items-start gap-5">
                    <span className="encyclopedia-icon shrink-0 self-center">👹</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-cinzel font-bold text-[var(--color-gold)] text-base mb-0.5">Chefes <span className="encyclopedia-count">({data.bosses?.length || 0})</span></h3>
                      <p className="text-[var(--color-text-dim)] text-xs">Chefes e minichefes</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to={`/${game}/monsters`}>
                <Card className="encyclopedia-card animate-fade-in-up stagger-3" glow>
                  <div className="flex items-start gap-5">
                    <span className="encyclopedia-icon shrink-0 self-center">🐉</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-cinzel font-bold text-[var(--color-gold)] text-base mb-0.5">Monstros {!monsterLoading && <span className="encyclopedia-count">({monsterCount})</span>}</h3>
                      <p className="text-[var(--color-text-dim)] text-xs">Inimigos e criaturas</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
