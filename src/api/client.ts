/**
 * Talks to a json-server-shaped REST API.
 *
 * - In local dev (`npm run dev`), it points at a real json-server you run
 *   yourself with `npm run server` (see package.json) — reads AND writes
 *   persist to db.json on your machine.
 * - In production (built for Netlify), plain json-server can't run there —
 *   Netlify only serves static files, it can't host a long-running Node
 *   process. Instead this points at https://my-json-server.typicode.com,
 *   a free service that serves any GitHub repo's db.json as a live
 *   json-server-compatible API with zero deployment. Writes there are
 *   faked (it responds like a real API but doesn't persist), which is a
 *   limitation of the free host, not this code — see README for details.
 *
 * Override either with a VITE_API_URL environment variable if you point
 * this at your own hosted json-server (Render, Railway, etc.) instead.
 */

const MY_JSON_SERVER_URL = 'https://my-json-server.typicode.com/Saikiran1603/CM-Chat-App';

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  (import.meta.env.DEV ? 'http://localhost:3001' : MY_JSON_SERVER_URL);

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${options?.method ?? 'GET'} ${path} failed: ${res.status}`);
  // json-server returns 200 with a body for GET/POST/PATCH, and often no
  // body for DELETE — guard against empty responses.
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const api = {
  getAll: <T>(resource: string) => request<T[]>(`/${resource}`),
  getByQuery: <T>(resource: string, query: Record<string, string>) =>
    request<T[]>(`/${resource}?${new URLSearchParams(query).toString()}`),
  create: <T>(resource: string, data: T) =>
    request<T>(`/${resource}`, { method: 'POST', body: JSON.stringify(data) }),
  update: <T>(resource: string, id: string, data: Partial<T>) =>
    request<T>(`/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (resource: string, id: string) => request<void>(`/${resource}/${id}`, { method: 'DELETE' }),
};
