const KEY = "rw18_admin_auth";

export const adminCredentials = { username: "admin", password: "rw18admin" };

export const isAuthenticated = () => {
  try { return localStorage.getItem(KEY) === "1"; }
  catch { return false; }
};

export const adminLogin = (username: string, password: string): boolean => {
  if (username === adminCredentials.username && password === adminCredentials.password) {
    localStorage.setItem(KEY, "1");
    return true;
  }
  return false;
};

export const adminLogout = () => {
  try { localStorage.removeItem(KEY); } catch {}
};
