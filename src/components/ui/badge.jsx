import { cn } from "../../lib/utils";

export function Badge({ children, className, variant = "default" }) {
  const variants = {
    default: "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20",
    oot: "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20",
    mm: "bg-[var(--color-green-sage)]/10 text-[var(--color-green-sage)] border border-[var(--color-green-sage)]/20",
    gold: "bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/20",
    outline: "border border-[var(--color-border)] text-[var(--color-text-muted)]",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide", variants[variant], className)}>
      {children}
    </span>
  );
}
