import { ReactNode, use } from 'react';
import { AuthContext } from '../context';
import { Navigate } from 'react-router';

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const auth = use(AuthContext);

  if (!auth?.authUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};
