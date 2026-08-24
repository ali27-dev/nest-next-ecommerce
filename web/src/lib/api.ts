export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

const ACCESS_TOKEN_KEY = "farzara_access_token";
const REFRESH_TOKEN_KEY = "farzara_refresh_token";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// Coming soon: broadcast this event across tabs (e.g. via storage event)
// so multiple open tabs stay in sync instead of each independently
// discovering the session is gone.
function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("farzara_user");
}

// Only one refresh in flight at a time — if five requests all hit a 401
// simultaneously, they share this single promise instead of each firing
// their own refresh call.
let refreshPromise: Promise<boolean> | null = null;

export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { Authorization: `Bearer ${refreshToken}` },
        cache: "no-store",
      });
      if (!res.ok) {
        clearSession();
        return false;
      }
      const data = await res.json();
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      return true;
    } catch {
      clearSession();
      return false;
    }
  })();

  const result = await refreshPromise;
  refreshPromise = null;
  return result;
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    throw new UnauthorizedError();
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data?.message ?? `Request failed (${res.status})`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }
  return data as T;
}

// Wraps a fetch call: on 401, attempt one silent refresh + one retry
// before giving up and throwing UnauthorizedError for the caller to
// handle (redirect to login).
async function fetchWithRefresh(
  url: string,
  init: RequestInit
): Promise<Response> {
  const res = await fetch(url, init);
  if (res.status !== 401) return res;

  const refreshed = await refreshAccessToken();
  if (!refreshed) return res;

  const retryHeaders = new Headers(init.headers);
  retryHeaders.set("Authorization", `Bearer ${getAccessToken()}`);
  return fetch(url, { ...init, headers: retryHeaders });
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json();
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export async function apiAuthGet<T>(path: string): Promise<T> {
  const res = await fetchWithRefresh(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export async function apiAuthPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetchWithRefresh(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export async function apiAuthPatch<T>(
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetchWithRefresh(`${API_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export async function apiAuthDelete<T>(path: string): Promise<T> {
  const res = await fetchWithRefresh(`${API_URL}${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export async function apiAuthUpload<T>(
  path: string,
  formData: FormData,
  method: "PATCH" | "POST" = "PATCH"
): Promise<T> {
  const res = await fetchWithRefresh(`${API_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    body: formData,
    cache: "no-store",
  });
  return parseResponse<T>(res);
}
