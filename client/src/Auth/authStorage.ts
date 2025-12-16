// src/utils/authStorage.ts
export const authStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem("sb-auth-token");
    } catch (error) {
      console.error("Error reading auth token:", error);
      return null;
    }
  },

  setToken: (token: string): void => {
    try {
      localStorage.setItem("sb-auth-token", token);
    } catch (error) {
      console.error("Error saving auth token:", error);
    }
  },

  removeToken: (): void => {
    try {
      localStorage.removeItem("sb-auth-token");
    } catch (error) {
      console.error("Error removing auth token:", error);
    }
  },

  getSession: async () => {
    const token = authStorage.getToken();
    if (!token) return null;

    try {
      // You could validate the token here if needed
      return { hasToken: true, token };
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  },
};
