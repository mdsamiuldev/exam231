"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyDocumentTheme(t: Theme) {
  if (typeof document !== "undefined") {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTheme = localStorage.getItem("social_events_theme") as Theme | null;
        if (storedTheme === "light" || storedTheme === "dark") {
          return storedTheme;
        }
      } catch {
        // ignore
      }
    }
    return "dark";
  });

  useEffect(() => {
    applyDocumentTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setThemeState(nextTheme);
    try {
      localStorage.setItem("social_events_theme", nextTheme);
    } catch {
      // ignore
    }
    applyDocumentTheme(nextTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem("social_events_theme", newTheme);
    } catch {
      // ignore
    }
    applyDocumentTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={theme} data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
