/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { apiPost, refreshAccessToken } from "@/lib/api";
import { getTokenExpiry } from "@/lib/jwt";

interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = "farzara_access_token";
const REFRESH_TOKEN_KEY = "farzara_refresh_token";
const USER_KEY = "farzara_user";
const REFRESH_MARGIN_MS = 60_000; // refresh 60s before actual expiry

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearScheduledRefresh() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }

  function scheduleRefresh(accessToken: string) {
    clearScheduledRefresh();
    const expiry = getTokenExpiry(accessToken);
    if (!expiry) return;

    // eslint-disable-next-line react-hooks/purity
    const delay = Math.max(expiry - Date.now() - REFRESH_MARGIN_MS, 0);
    timerRef.current = setTimeout(async () => {
      const success = await refreshAccessToken();
      if (success) {
        const newToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (newToken) scheduleRefresh(newToken);
      } else {
        logout();
      }
    }, delay);
  }

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        scheduleRefresh(token);
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
    return clearScheduledRefresh;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persistSession(data: AuthResponse) {
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    setUser(data.user);
    scheduleRefresh(data.accessToken);
  }

  async function login(email: string, password: string) {
    const data = await apiPost<AuthResponse>("/auth/login", {
      email,
      password,
    });
    persistSession(data);
  }

  async function register(payload: RegisterPayload) {
    const data = await apiPost<AuthResponse>("/auth/register", payload);
    persistSession(data);
  }

  function logout() {
    clearScheduledRefresh();
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: Boolean(user), login, register, logout }}
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
