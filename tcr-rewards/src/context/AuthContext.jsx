import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("tcr_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("tcr_token") || "";
  });

  // ---------------- FETCH LATEST USER ----------------

  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tcr_token")}`,
        },
      });

      setUser(res.data.user);

      localStorage.setItem(
        "tcr_user",
        JSON.stringify(res.data.user)
      );

      return res.data.user;
    } catch (err) {
      console.log(err);

      // Token is invalid or user no longer exists
      setUser(null);
      setToken("");

      localStorage.removeItem("tcr_user");
      localStorage.removeItem("tcr_token");
    }
  }, []);

  // whenever app opens
  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  // ---------------- SIGNUP ----------------

  const signup = useCallback(async (userData) => {
    const res = await api.post("/auth/register", userData);

    const { user, token } = res.data;

    setUser(user);
    setToken(token);

    localStorage.setItem("tcr_user", JSON.stringify(user));
    localStorage.setItem("tcr_token", token);

    return user;
  }, []);

  // ---------------- LOGIN ----------------

  const login = useCallback(async ({ phone, password }) => {
    const res = await api.post("/auth/login", {
      phone,
      password,
    });

    const { user, token } = res.data;

    setUser(user);
    setToken(token);

    localStorage.setItem("tcr_user", JSON.stringify(user));
    localStorage.setItem("tcr_token", token);

    return user;
  }, []);

  // ---------------- LOGOUT ----------------

 const logout = useCallback(() => {
  setUser(null);
  setToken("");

  // Current auth keys
  localStorage.removeItem("tcr_user");
  localStorage.removeItem("tcr_token");

  // Old auth keys
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        fetchUser,
        setUser,
        isLoggedIn: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}; 