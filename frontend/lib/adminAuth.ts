const TOKEN_KEY = "rw18_admin_token";
const EXPIRES_KEY = "rw18_admin_expires";
const USER_KEY = "rw18_admin_user";

export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const expires = localStorage.getItem(EXPIRES_KEY);
    if (!token || !expires) return false;
    
    // Check if expired
    const expiresAt = parseInt(expires, 10) * 1000; // expires_at from backend is in seconds
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
};

export const adminLogin = async (username: string, password: string): Promise<boolean> => {
  try {
    // Determine API URL based on host/environment
    const apiBase = typeof window !== "undefined"
      ? (process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1")
      : (process.env.API_BASE_URL || "http://backend:8080/api/v1");
    
    const response = await fetch(`${apiBase}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return false;
    }

    const res = await response.json();
    const data = res.data || res;
    if (data.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(EXPIRES_KEY, data.expires_at.toString());
      localStorage.setItem(USER_KEY, JSON.stringify(data.admin));
      return true;
    }
    return false;
  } catch (error) {
    console.error("Login request failed:", error);
    return false;
  }
};

export const adminLogout = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {}
};

export const getAdminUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};
