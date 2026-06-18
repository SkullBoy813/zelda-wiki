import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useStore from "../../store/useStore";
import { ThemeVariantPicker } from "../theme/ThemeVariantPicker";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const loadProgressFromServer = useStore((s) => s.loadProgressFromServer);
  const loc = useLocation();

  const { isOot, isMm, gameFull } = useMemo(() => {
    const path = loc.pathname;
    const isOot = path === "/oot" || path.startsWith("/oot/");
    const isMm = path === "/mm" || path.startsWith("/mm/");
    return { isOot, isMm, gameFull: isOot ? "ocarina-of-time" : isMm ? "majoras-mask" : null };
  }, [loc.pathname]);

  const themeSubtitle = isOot ? "Ocarina of Time" : isMm ? "Majora's Mask" : "Wiki & Rastreador";

  useEffect(() => {
    if (user) loadProgressFromServer();
  }, [user]);

  const navLinks = [
    { to: "/oot", label: "Ocarina of Time" },
    { to: "/mm", label: "Majora's Mask" },
    { to: "/oot/checklists", label: "Progresso" },
  ];

  return (
    <header className={`sticky top-0 z-40 border-b border-[var(--color-border)] glass-dark ${isOot ? "animate-song-of-time" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          {isOot ? (
            <svg className="w-6 h-6 text-[var(--color-gold)] drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" />
            </svg>
          ) : isMm ? (
            <svg className="w-6 h-6 text-[var(--color-gold)] animate-mm-moon-glow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-[var(--color-gold)] group-hover:animate-pulse-glow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" />
            </svg>
          )}
          <div>
            <h1 className="text-base font-cinzel font-bold text-[var(--color-gold)] leading-tight tracking-wider glow-text-md">Zelda Chronicles</h1>
            <p className="text-[9px] text-[var(--color-text-dim)] leading-tight tracking-widest uppercase">{themeSubtitle}</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold)] glow-shadow-hover rounded-md hover:bg-white/5 transition-all duration-200"
            >
              {link.label}
            </Link>
          ))}
          {gameFull && <ThemeVariantPicker gameFull={gameFull} />}
          {!loading && (
            user ? (
              <Link
                to="/profile"
                className="ml-3 flex items-center gap-2 px-3 py-1.5 border border-[var(--color-border)] rounded-md hover:border-[var(--color-gold)]/50 glow-shadow-hover transition-all duration-200"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center text-[10px] font-bold text-[var(--color-gold)]">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="text-sm text-[var(--color-text-muted)] hidden lg:inline">{user.username}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="ml-3 text-sm px-3 py-1.5 bg-[var(--color-gold)]/10 text-[var(--color-gold)] border border-[var(--color-gold)]/30 rounded-md hover:bg-[var(--color-gold)]/20 glow-shadow-md transition-all duration-200"
              >
                Entrar
              </Link>
            )
          )}
        </nav>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors"
          aria-label="Menu"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-sheikah-dark">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:bg-white/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-[var(--color-border)] my-2" />
            {!loading && (
              user ? (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-all"
                >
                  <div className="w-5 h-5 rounded-full bg-[var(--color-gold)]/20 flex items-center justify-center text-[10px] font-bold text-[var(--color-gold)]">
                    {user.username[0].toUpperCase()}
                  </div>
                  {user.username}
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm text-[var(--color-gold)] hover:bg-white/5 transition-all"
                >
                  Entrar
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
