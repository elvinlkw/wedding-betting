import { useMutation, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import axios from 'axios';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  id: string;
  name: string;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axios.post('/api/auth', data);
  return response.data;
};

export const useAuthLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const getUser = async () => {
  const config = {
    headers: {
      'x-auth-token': Cookies.get('jwttoken'),
    },
  };
  const response = await axios.get('/api/auth', config);
  return response.data;
};

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: getUser,
    enabled: !!Cookies.get('jwttoken'),
  });
};
