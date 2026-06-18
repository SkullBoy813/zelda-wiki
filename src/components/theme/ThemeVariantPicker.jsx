import { useState } from "react";
import useStore from "../../store/useStore";
import { VARIANTS } from "../../lib/themes";

export function ThemeVariantPicker({ gameFull }) {
  const [open, setOpen] = useState(false);
  const variants = useStore((s) => s.variants);
  const setVariant = useStore((s) => s.setVariant);
  const gameVariants = VARIANTS[gameFull];
  const current = variants[gameFull] || "default";

  if (!gameVariants) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs border border-[var(--color-border)] rounded-lg hover:border-[var(--color-gold)]/40 transition-all text-[var(--color-text-muted)] hover:text-[var(--color-gold)]"
        title="Personalizar tema"
      >
        <span>🎨</span>
        <span className="hidden sm:inline">{gameVariants[current]?.label || "Tema"}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 glass rounded-xl border border-[var(--color-border)] p-3 shadow-xl">
            <p className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-wider mb-2">Variante de Tema</p>
            <div className="space-y-1">
              {Object.entries(gameVariants).map(([key, v]) => (
                <button
                  key={key}
                  onClick={() => { setVariant(gameFull, key); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition-all text-left ${
                    current === key
                      ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20"
                      : "text-[var(--color-text-muted)] hover:bg-white/[0.03] hover:text-white"
                  }`}
                >
                  <span className="text-base">{v.icon}</span>
                  <div>
                    <p className="font-medium">{v.label}</p>
                    <p className="text-[10px] text-[var(--color-text-dim)]">{v.desc}</p>
                  </div>
                  {current === key && <span className="ml-auto text-[var(--color-gold)]">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
