import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import api from "../api/axios";

interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
        localStorage.removeItem("user");
      }
    } else {
      // Clean up if it is "undefined" string or null
      if (storedUser === "undefined") {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      }

      setToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await api.post("/api/auth/register", {
        email,
        password,
        name,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Registration failed", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
