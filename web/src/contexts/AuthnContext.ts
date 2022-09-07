import { createContext } from "react";

export interface AuthnData {
  isAuthenticated: boolean;
  login: (callback?: () => void) => void;
  logout: (callback?: () => void) => void;
}

export const AuthnContext = createContext<AuthnData>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});
