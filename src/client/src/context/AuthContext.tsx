import { createContext } from 'react';

function noop() {}

export interface IAuthContext {
    token: string | null,
    userId: string | null,
    login: (jwtToken: string | null, id: string | null) => void,
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