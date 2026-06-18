import { useMemo } from "react";
import { cn } from "../../lib/utils";

export function ProgressBar({ value = 0, className, size = "md", showLabel = true }) {
  const sizes = { sm: "h-1.5", md: "h-2", lg: "h-3" };

  const shadowStyle = useMemo(() => {
    if (value <= 0) return { boxShadow: "none" };
    return { boxShadow: `0 0 8px rgba(var(--color-glow-rgb), 0.4)` };
  }, [value]);

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-[11px] text-[var(--color-text-dim)]">{value}%</span>
        </div>
      )}
      <div className={cn("w-full bg-[var(--color-brown-dark)] rounded-full overflow-hidden", sizes[size])}>
        <div
          className={cn("rounded-full transition-all duration-700 ease-out bg-[var(--color-gold)]", sizes[size])}
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            ...shadowStyle,
          }}
        />
      </div>
    </div>
  );
}
