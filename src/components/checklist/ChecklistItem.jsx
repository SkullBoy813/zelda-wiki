import useStore from "../../store/useStore";

export function ChecklistItem({ id, name, category }) {
  const checked = useStore((s) => s.checked);
  const toggleChecked = useStore((s) => s.toggleChecked);
  const key = `${category}:${id}`;
  const isChecked = !!checked[key];

  return (
    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group">
      <div className="relative flex items-center justify-center w-5 h-5">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={() => toggleChecked(category, id)}
          className="peer sr-only"
        />
        <div className="w-5 h-5 border-2 border-gray-500 rounded peer-checked:border-[var(--color-gold)] peer-checked:bg-[var(--color-gold)] transition-all" />
        {isChecked && (
          <svg className="absolute w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`text-sm transition-colors ${isChecked ? "text-gray-500 line-through" : "text-gray-200"}`}>
        {name}
      </span>
    </label>
  );
}
