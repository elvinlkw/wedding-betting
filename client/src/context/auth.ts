import { AuthUser } from '../types/auth';
import { createContext } from 'react';

type AuthContextType = {
  authUser: AuthUser | null;
  setAuthUser: (user: AuthUser | null) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);
