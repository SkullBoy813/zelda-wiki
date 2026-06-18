import { createContext, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { THEMES } from "../lib/themes";

const ThemeContext = createContext({ theme: THEMES.default });

export function ThemeProvider({ children }) {
  const loc = useLocation();
  const theme = useMemo(() => {
    const path = loc.pathname;
    if (path === "/mm" || path.startsWith("/mm/")) return THEMES.mm;
    if (path === "/oot" || path.startsWith("/oot/")) return THEMES.oot;
    return THEMES.default;
  }, [loc.pathname]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
