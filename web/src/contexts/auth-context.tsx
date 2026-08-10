"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface AuthContextValue {
  isLoggedIn: boolean;
  logout: () => void;
  setLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = "farzara_access_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(Boolean(localStorage.getItem(TOKEN_KEY)));
  }, []);

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setIsLoggedIn(false);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, logout, setLoggedIn: setIsLoggedIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
