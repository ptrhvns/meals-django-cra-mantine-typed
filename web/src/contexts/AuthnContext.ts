import { createContext } from "react";

export interface AuthnInterface {
  isAuthenticated: boolean;
  login: (callback: () => void) => void;
  logout: (callback: () => void) => void;
}

export const AuthnContext = createContext<AuthnInterface>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});
