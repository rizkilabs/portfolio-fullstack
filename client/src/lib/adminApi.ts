import { api, ApiError } from "./api";
import { clearToken, getToken } from "./auth";

export async function adminApi<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getToken();

  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    return await api<T>(path, { ...init, headers });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      clearToken();
    }

    throw err;
  }
}
