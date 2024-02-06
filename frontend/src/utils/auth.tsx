import * as React from "react";
import { RouterContext } from "../routes/__root";

export type AuthData = {
  identityProvider: string;
  userId: string;
  username: string;
  userRoles: string[];
  claims: { [key: string]: string };
};

export interface AuthContext {
  isAuthenticated: boolean;
  setAuthData: (authData: AuthData | null) => void;
  authData: AuthData | null;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = React.useState<AuthData | null>(null);
  const isAuthenticated = !!authData;
  return (
    <AuthContext.Provider value={{ isAuthenticated, authData, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
