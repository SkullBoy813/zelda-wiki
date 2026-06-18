import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "./Header";
import { ThemeProvider } from "../../contexts/ThemeContext";
import useStore from "../../store/useStore";

function LayoutInner({ children }) {
  const loc = useLocation();
  const variants = useStore((s) => s.variants);

  const { themeClass, variantClass, isOot, isMm, gameFull } = useMemo(() => {
    const path = loc.pathname;
    const isOot = path === "/oot" || path.startsWith("/oot/");
    const isMm = path === "/mm" || path.startsWith("/mm/");
    const gameFull = isOot ? "ocarina-of-time" : isMm ? "majoras-mask" : null;
    const variant = gameFull ? variants[gameFull] : null;
    const variantClass = variant && variant !== "default" ? `variant-${variant}` : "";
    return {
      themeClass: isOot ? "theme-oot" : isMm ? "theme-mm" : "",
      variantClass,
      isOot,
      isMm,
      gameFull,
    };
  }, [loc.pathname, variants]);

  return (
    <div className={`min-h-screen bg-sheikah text-[var(--color-text-main)] relative overflow-x-hidden ${themeClass} ${variantClass}`}>
      {/* Tema padrão: scanline + grid + pattern (sempre presente) */}
      <div className="sheikah-grid fixed inset-0 pointer-events-none z-0" />
      <div className="theme-pattern-overlay fixed inset-0 pointer-events-none z-0" />
      <div className="sheikah-pattern fixed inset-0 pointer-events-none z-0" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]">
        <div className="animate-scanline w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
      </div>

      {/* OoT: Triforça pulsante + Fadinha Navi */}
      {isOot && (
        <>
          <div className="theme-triforce-glow fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none z-0" />
          <svg className="theme-deco-fairy fixed top-1/3 right-[12%] w-4 h-4 text-[var(--color-gold)] pointer-events-none z-0 opacity-30" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="4" r="2" opacity="0.5" />
            <circle cx="20" cy="12" r="2" opacity="0.5" />
            <circle cx="12" cy="20" r="2" opacity="0.5" />
            <circle cx="4" cy="12" r="2" opacity="0.5" />
          </svg>
          <svg className="theme-deco-fairy fixed bottom-1/4 left-[10%] w-3 h-3 text-[var(--color-green-sage)] pointer-events-none z-0 opacity-20" style={{ animationDelay: "1.5s" }} viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="4" r="2" opacity="0.5" />
            <circle cx="20" cy="12" r="2" opacity="0.5" />
            <circle cx="12" cy="20" r="2" opacity="0.5" />
            <circle cx="4" cy="12" r="2" opacity="0.5" />
          </svg>
        </>
      )}

      {/* MM: Lua descendo + Olho da Majora + Glow sinistro */}
      {isMm && (
        <>
          <div className="theme-moon-glow fixed top-0 right-0 w-[400px] h-[400px] pointer-events-none z-0" />
          <svg className="theme-mask-eye fixed top-[15%] left-[8%] w-16 h-16 pointer-events-none z-0" viewBox="0 0 100 100" fill="none" stroke="var(--color-accent, #ef4444)" strokeWidth="2" opacity="0.08">
            <circle cx="50" cy="50" r="45" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" strokeWidth="2" />
            <circle cx="50" cy="50" r="5" fill="currentColor" stroke="none" />
            <path d="M15 50 Q 32 25, 50 50 Q 68 75, 85 50" strokeWidth="1.5" fill="none" />
          </svg>
          <div className="theme-deco-clock fixed bottom-[15%] right-[10%] w-20 h-20 pointer-events-none z-0 opacity-[0.04] border-2 border-[var(--color-gold)] rounded-full">
            <div className="absolute top-1/2 left-1/2 w-[2px] h-[40%] bg-[var(--color-gold)] origin-bottom -translate-x-1/2 -translate-y-full" style={{ transform: "translateX(-50%) translateY(-100%) rotate(180deg)" }} />
          </div>
        </>
      )}

      <Header />

      <main className="relative z-10 animate-fade-in">{children}</main>

      {/* Rodapé temático (apenas em páginas de jogo) */}
      {(isOot || isMm) && (
        <footer className="relative z-10 border-t border-[var(--color-border)] py-4 text-center">
          <p className="text-[10px] text-[var(--color-text-dim)] tracking-widest uppercase">
            {isOot && "\"O fluxo do tempo é sempre cruel...\""}
            {isMm && "\"Você encontrou um destino terrível, não encontrou?\""}
          </p>
        </footer>
      )}
    </div>
  );
}

export function Layout({ children }) {
  return (
    <ThemeProvider>
      <LayoutInner>{children}</LayoutInner>
    </ThemeProvider>
  );
}
