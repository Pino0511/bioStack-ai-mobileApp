import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface DarkModeValue {
  dark: boolean;
  toggle: () => void;
  setDark: (v: boolean) => void;
}

const DarkModeContext = createContext<DarkModeValue | undefined>(undefined);

export function DarkModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDarkState] = useState<boolean>(() => {
    const saved = localStorage.getItem('biostack-dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('biostack-dark', String(dark));
  }, [dark]);

  return (
    <DarkModeContext.Provider
      value={{ dark, toggle: () => setDarkState((v) => !v), setDark: setDarkState }}
    >
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error('useDarkMode must be used inside DarkModeProvider');
  return ctx;
}
