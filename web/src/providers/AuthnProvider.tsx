import { AuthnContext, AuthnInterface } from "../contexts/AuthnContext";
import React, { useState } from "react";

interface AuthnProviderProps {
  children: React.ReactNode;
}

function AuthnProvider({ children }: AuthnProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("isAuthenticated")
  );

  const login = (callback: () => void): void => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);

    if (callback) {
      callback();
    }
  };

  const logout = (callback: () => void): void => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);

    if (callback) {
      callback();
    }
  };

  const value: AuthnInterface = { isAuthenticated, login, logout };

  return (
    <AuthnContext.Provider value={value}>{children}</AuthnContext.Provider>
  );
}

export default AuthnProvider;
