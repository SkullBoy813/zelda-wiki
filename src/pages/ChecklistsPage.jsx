import { useLocation } from "react-router-dom";
import { gameData, progressCategories } from "../data";
import { ChecklistGroup } from "../components/checklist/ChecklistGroup";
import { ProgressOverview } from "../components/dashboard/ProgressOverview";
import { Card } from "../components/ui/card";
import { BackButton } from "../components/ui/back-button";
import useStore from "../store/useStore";
import { GAME_LABELS } from "../lib/games";
import { usePageTitle } from "../hooks/usePageTitle";

export function ChecklistsPage() {
  const loc = useLocation();
  const segments = loc.pathname.split("/").filter(Boolean);
  const game = segments[0] || "oot";
  const gameFull = game === "oot" ? "ocarina-of-time" : game === "la" ? "links-awakening" : "majoras-mask";
  usePageTitle(`Checklists — ${GAME_LABELS[gameFull]}`);
  const data = gameData[gameFull];
  const categories = progressCategories[gameFull] || [];
  const resetProgress = useStore((s) => s.resetProgress);
  const checked = useStore((s) => s.checked);
  const totalChecked = Object.keys(checked).filter((k) => checked[k]).length;

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in-up">
      <div className="mb-6">
        <BackButton fallbackTo={`/${game}`}>
          ← {GAME_LABELS[gameFull]}
        </BackButton>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-white">Checklists</h1>
          <p className="text-gray-400 text-sm mt-1">
            Marque os itens que você já coletou e acompanhe seu progresso. ({totalChecked} itens marcados)
          </p>
        </div>
        <button
          onClick={() => { if (confirm("Tem certeza? Isso vai resetar todo o seu progresso.")) resetProgress(); }}
          className="px-4 py-2 text-sm border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
        >
          Resetar Progresso
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <ProgressOverview categories={categories} game={gameFull} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {categories.map((cat) => {
            if (cat.hideFromChecklist) return null;
            return (
              <Card key={cat.id}>
                <ChecklistGroup
                  category={cat.id}
                  label={cat.label}
                  items={cat.items || []}
                  total={cat.total}
                />
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
