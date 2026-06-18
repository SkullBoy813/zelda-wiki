import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

export function BackButton({ to, className }) {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => (to ? navigate(to) : navigate(-1))}
      className={cn(
        "flex items-center gap-1.5 text-sm text-[var(--color-text-dim)] hover:text-[var(--color-gold)] glow-shadow-hover transition-colors cursor-pointer",
        className
      )}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Voltar
    </button>
  );
}
