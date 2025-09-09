import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  email: string;
  role: string; // "admin" | "user" | "pending"
  name?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate restoring user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 🔹 Replace this with your own API call
      if (email && password) {
        const fakeUser: User = {
          email,
          role: email.includes("admin") ? "admin" : "user",
          name: email.split("@")[0],
        };
        setUser(fakeUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(fakeUser));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // 🔹 Fake Google login
      const fakeUser: User = {
        email: "googleuser@example.com",
        role: "user",
        name: "Google User",
      };
      setUser(fakeUser);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(fakeUser));
      return true;
    } catch (err) {
      console.error("Google login error:", err);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
