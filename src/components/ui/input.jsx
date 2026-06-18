import { cn } from "../../lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full px-4 py-2.5 glass border border-[var(--color-border)] rounded-xl text-[var(--color-text-main)] placeholder-[var(--color-text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/40 focus:border-[var(--color-gold)]/60 transition-all",
        className
      )}
      {...props}
    />
  );
}
