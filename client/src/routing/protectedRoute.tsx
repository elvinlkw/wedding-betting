import { ReactNode, use, useEffect, useState } from 'react';
import { AuthContext } from '../context';
import { AuthUser } from '../types/auth';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router';
import { Spinner } from '../components';
import { useAuth } from '../api/auth';

type ProtectedRouteProps = {
  children: ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { data, isLoading, isError } = useAuth();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const authContext = use(AuthContext);

  useEffect(() => {
    if (data) {
      setAuthUser(data);
      authContext?.setAuthUser(data);
    }
  }, [data, authContext]);

  if (!Cookies.get('jwttoken') || isError) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || !authUser) {
    return <Spinner />;
  }

  return children;
};
