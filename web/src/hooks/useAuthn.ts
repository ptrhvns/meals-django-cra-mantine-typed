import { AuthnContext, AuthnInterface } from "../contexts/AuthnContext";
import { useContext } from "react";

export default function useAuthn(): AuthnInterface {
  return useContext(AuthnContext);
}
