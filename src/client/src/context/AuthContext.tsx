import { createContext } from 'react';

function noop() {}

export interface IAuthContext {
    token: string | null,
    userId: number | null,
    login: (jwtToken: string | null, id: number | null) => void,
    logout: () => void,
    isAuthenticated: boolean
}

export const AuthContext = createContext({
  token: null, 
  userId: null,
  login: noop,
  logout: noop,
  isAuthenticated: false,
} as IAuthContext);