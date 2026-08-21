// src/lib/api.ts
export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("farzara_access_token");
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
  const res = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export async function apiAuthPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
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

// Admin \\
export async function apiAuthPatch<T>(
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
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
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    cache: "no-store",
  });
  return parseResponse<T>(res);
}

export async function apiAuthUpload<T>(
  path: string,
  formData: FormData
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${getAccessToken()}` }, // no Content-Type — browser sets the multipart boundary
    body: formData,
    cache: "no-store",
  });
  return parseResponse<T>(res);
}
