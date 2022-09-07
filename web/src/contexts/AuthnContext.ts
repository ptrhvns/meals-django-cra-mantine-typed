import { createContext } from "react";

export interface AuthnData {
  authenticated: boolean;
  login: (callback?: () => void) => void;
  logout: (callback?: () => void) => void;
}

export const AuthnContext = createContext<AuthnData>({
  authenticated: false,
  login: () => {},
  logout: () => {},
});
