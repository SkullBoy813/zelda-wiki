import { cn } from "../../lib/utils";

export function Card({ children, className, glow, glass = true, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl p-4 transition-all duration-300",
        glass && "glass hover:bg-[var(--color-bg-card-hover)]",
        glow && "glow-shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={cn(className)}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h3 className={cn("text-lg font-cinzel font-bold text-[var(--color-gold)] tracking-wide glow-text-sm", className)}>{children}</h3>;
}
