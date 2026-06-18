import { Card, CardContent, CardTitle } from "../ui/card";
import { ProgressBar } from "../ui/progress-bar";
import useStore from "../../store/useStore";

export function ProgressOverview({ categories }) {
  const getOverallProgress = useStore((s) => s.getOverallProgress);
  const { total, done, percentage } = getOverallProgress(categories);

  return (
    <Card>
      <CardTitle className="text-xl mb-4">Progresso Geral</CardTitle>
      <CardContent>
        <div className="text-3xl font-bold text-white mb-2">{percentage}%</div>
        <ProgressBar value={percentage} size="lg" showLabel={false} className="mb-4" />
        <div className="text-sm text-gray-400 mb-6">
          {done} / {total} itens coletados
        </div>

        <div className="space-y-4">
          {categories.map((cat) => {
            const getProgress = useStore.getState().getProgress;
            const p = getProgress(cat.id, cat.items || []);
            if (cat.total) {
              p.total = cat.total;
            }
            return (
              <div key={cat.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{cat.label}</span>
                  <span className="text-gray-400">
                    {p.done}/{p.total || cat.items?.length || 0}
                  </span>
                </div>
                <ProgressBar
                  value={p.percentage || 0}
                  size="sm"
                  showLabel={false}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
