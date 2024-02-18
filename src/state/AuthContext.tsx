import { createContext, useContext, useState } from "react";
import { LoginRequest } from "../api/auth/types";
import { useLoginMutation } from "../api/auth";
import { UseMutationResult } from "@tanstack/react-query";
import { UserWithToken } from "../models";


type AuthContextValue = {
  token: string | null;
  user: UserWithToken | null;
  loginMutation: UseMutationResult<UserWithToken, Error, LoginRequest, unknown> | null;
  login: (loginRequest: LoginRequest) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue>({
  token: null,
  user: null,
  loginMutation: null,
  login: () => {
    throw new Error('login not implemented');
  },
  logout: () => {
    throw new Error('logout not implemented');
  },
});

export const useAuthContext = () => {
  return useContext(AuthContext)
}

type AuthProviderProps = {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserWithToken | null>(null);
  const loginMutation = useLoginMutation({
    onSuccess: (user) => {
      setUser(user);
    }
  });

  const login = (loginRequest: LoginRequest) => {
    loginMutation.mutate(loginRequest);
  }

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token: user?.token || null, user, login, logout, loginMutation }}>
      {children}
    </AuthContext.Provider>
  )
}