import { ProgressBar } from "../ui/progress-bar";
import { ChecklistItem } from "./ChecklistItem";
import useStore from "../../store/useStore";

export function ChecklistGroup({ category, label, items, total }) {
  const getProgress = useStore((s) => s.getProgress);
  const { done, percentage } = getProgress(category, items);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-cinzel font-bold text-white">{label}</h3>
        <span className="text-sm text-gray-400">
          {done}/{total || items.length}
        </span>
      </div>
      <ProgressBar value={percentage} size="sm" showLabel={false} />
      <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <ChecklistItem key={item.id} id={item.id} name={item.name} category={category} />
        ))}
      </div>
    </div>
  );
}
