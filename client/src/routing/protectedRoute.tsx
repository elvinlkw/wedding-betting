import { AuthUser } from '../types/auth';
import { Navigate } from 'react-router';
import { ReactNode } from 'react';

type ProtectedRouteProps = {
  user: AuthUser | null;
  children: ReactNode;
};

export const ProtectedRoute = ({ user, children }: ProtectedRouteProps) => {
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};
