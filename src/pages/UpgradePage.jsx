import { Link, useLocation, useParams } from "react-router-dom";
import { gameData } from "../data";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { BackButton } from "../components/ui/back-button";
import { GAME_LABELS } from "../lib/games";
import { usePageTitle } from "../hooks/usePageTitle";
import useStore from "../store/useStore";

const eraColors = {
  Child: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  Adult: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Both: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

function EraBadge({ era }) {
  if (!era) return null;
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${eraColors[era] || "bg-gray-500/20 text-gray-400"}`}>
      {era}
    </span>
  );
}

export function UpgradeListPage() {
  const loc = useLocation();
  const segments = loc.pathname.split("/").filter(Boolean);
  const game = segments[0] || "oot";
  const gameFull = game === "oot" ? "ocarina-of-time" : game === "la" ? "links-awakening" : "majoras-mask";
  const data = gameData[gameFull];
  const items = data?.upgrades || [];
  const addRecent = useStore((s) => s.addRecent);
  usePageTitle(`Upgrades — ${GAME_LABELS[gameFull]}`);

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="mb-6">
        <BackButton fallbackTo={`/${game}`}>
          ← {GAME_LABELS[gameFull]}
        </BackButton>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <span className="text-2xl">⬆️</span>
        <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-white">Upgrades</h1>
        <span className="text-sm text-gray-500">({items.length})</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((upgrade, i) => (
          <Link
            key={upgrade.id}
            to={`/${game}/upgrades/${upgrade.id}`}
            onClick={() => addRecent({ id: upgrade.id, name: upgrade.namePt || upgrade.name, game, tab: "upgrades" })}
          >
            <Card className="border-[var(--color-border)] hover:border-[var(--color-gold)]/30 transition-all duration-300 h-full animate-fade-in-up" glow>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{upgrade.icon}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-cinzel font-bold text-white text-sm sm:text-base truncate">
                      {upgrade.namePt || upgrade.name}
                    </h3>
                    {upgrade.namePt && (
                      <p className="text-gray-500 text-[10px] italic truncate">{upgrade.name}</p>
                    )}
                  </div>
                </div>

                <p className="text-gray-400 text-xs line-clamp-2">{upgrade.descriptionPt || upgrade.description}</p>

                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span>Inicial: {upgrade.initial.capacity}</span>
                  <span>→</span>
                  <span className="text-[var(--color-gold-light)]">Máx: {upgrade.maxCapacity}</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {upgrade.upgrades.map((u, j) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] border border-[var(--color-border)] text-gray-400">
                      +{u.capacity}
                    </span>
                  ))}
                  {upgrade.orderFlexible && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[var(--color-gold)]/5 text-[var(--color-gold)]/60 border border-[var(--color-gold)]/10">
                      ordem livre
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function UpgradeDetailPage() {
  const loc = useLocation();
  const segments = loc.pathname.split("/").filter(Boolean);
  const game = segments[0] || "oot";
  const { id } = useParams();
  const gameFull = game === "oot" ? "ocarina-of-time" : game === "la" ? "links-awakening" : "majoras-mask";
  const data = gameData[gameFull];
  const entity = data?.upgrades?.find((e) => e.id === id);
  usePageTitle(entity?.namePt || entity?.name || "");

  if (!entity) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-cinzel text-white mb-4">Upgrade não encontrado</h1>
        <BackButton fallbackTo={`/${game}/upgrades`} className="text-[var(--color-gold)] hover:underline" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="mb-6">
        <BackButton fallbackTo={`/${game}/upgrades`}>
          ← Upgrades
        </BackButton>
      </div>

      <div className="flex items-start gap-4 mb-8">
        <span className="text-4xl">{entity.icon}</span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-white">
            {entity.namePt || entity.name}
          </h1>
          {entity.namePt && <p className="text-gray-500 text-sm italic">{entity.name}</p>}
          <p className="text-gray-400 text-sm mt-2">{entity.descriptionPt || entity.description}</p>

          <div className="flex items-center gap-3 mt-3">
            <Badge variant="outline">
              Inicial: {entity.initial.capacity}
            </Badge>
            <Badge variant="gold">
              Máximo: {entity.maxCapacity}
            </Badge>
            {entity.orderFlexible && (
              <span className="text-[10px] text-gray-500 italic">Ordem flexível</span>
            )}
          </div>
        </div>
      </div>

      {/* Nível inicial */}
      <Card className="mb-4 border-[var(--color-border)]">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-[var(--color-border)] flex items-center justify-center shrink-0">
            <span className="text-sm">0</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-cinzel font-bold text-white text-sm">Nível Inicial</h3>
              <Badge variant="outline">Capacidade: {entity.initial.capacity}</Badge>
              <EraBadge era={entity.initial.era} />
            </div>
            <p className="text-gray-400 text-xs">{entity.initial.source}</p>
          </div>
        </div>
      </Card>

      {/* Upgrades */}
      <h2 className="text-lg font-cinzel font-bold text-[var(--color-gold)] mb-3 glow-text-sm">
        Upgrades ({entity.upgrades.length})
      </h2>

      <div className="space-y-4">
        {entity.upgrades.map((upgrade, i) => (
          <Card key={i} className="border-[var(--color-border)]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[var(--color-gold)]">{i + 1}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <h3 className="font-cinzel font-bold text-white text-sm">
                    {upgrade.namePt || upgrade.name}
                  </h3>
                  <Badge variant="gold">{upgrade.capacity}</Badge>
                  <EraBadge era={upgrade.era} />
                </div>

                <div className="flex items-start gap-1.5 mb-2">
                  <svg className="w-3.5 h-3.5 text-[var(--color-gold)]/60 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <p className="text-gray-400 text-xs">{upgrade.source}</p>
                </div>

                {upgrade.details && (
                  <div className="mt-2 p-3 rounded-lg bg-white/[0.02] border border-[var(--color-border)]">
                    <p className="text-gray-500 text-xs leading-relaxed">{upgrade.details}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Nota sobre ordem flexível */}
      {entity.orderFlexible && (
        <p className="text-[11px] text-gray-600 italic mt-6 text-center">
          A ordem destas upgrades pode ser invertida — a segunda upgrade obtida se torna o nível mais alto.
        </p>
      )}
    </div>
  );
}
