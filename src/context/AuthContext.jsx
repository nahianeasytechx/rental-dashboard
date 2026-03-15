import React, { createContext, useContext, useState, useEffect } from "react";

// Hardcoded users removed since we now fetch dynamically from localStorage or context
// We will look up users from 'abx_users' which is managed by AppContext

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("abashonx_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem("abashonx_user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password) => {
    // Dynamically retrieve users from localStorage (maintained by AppContext)
    let usersList = [];
    try {
      const storedUsers = localStorage.getItem("abx_users");
      if (storedUsers) {
        usersList = JSON.parse(storedUsers);
      }
    } catch (e) {
      console.error("Failed to parse users", e);
    }
    
    // Fallback if AppContext hasn't seeded yet (this shouldn't happen, but just in case)
    if (usersList.length === 0) {
      usersList = [
        { id: 1, name: "Admin User", email: "admin@demo.com", password: "admin", role: "admin", phone: "+880 1712-000000" },
        { id: 2, name: "Client User", email: "client@demo.com", password: "client", role: "client", phone: "+880 1823-000000" },
      ];
    }

    const account = usersList.find(
      (a) => a.email === email && a.password === password && a.status !== 'inactive'
    );
    
    if (!account) return { success: false, message: "Invalid email, password, or account inactive" };

    const avatarInitials = account.name
      ? account.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'U';

    const user = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      phone: account.phone,
      avatar: avatarInitials,
    };
    
    setCurrentUser(user);
    localStorage.setItem("abashonx_user", JSON.stringify(user));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("abashonx_user");
  };

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === "admin";
  const isClient = currentUser?.role === "client";

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, isLoggedIn, isAdmin, isClient, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
