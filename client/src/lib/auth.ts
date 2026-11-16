const KEY = "admin_token";

export const getToken = () =>
  typeof window === "undefined" ? null : localStorage.getItem(KEY);

export const setToken = (token: string) => localStorage.setItem(KEY, token);

export const clearToken = () => localStorage.removeItem(KEY);
