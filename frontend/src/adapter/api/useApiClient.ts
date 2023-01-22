import axios from 'axios';
import { Configuration, DefaultApi } from './__generated';
import React from 'react';
import { useAuth } from '../../providers/AuthProvider';

export const useApiClient = () => {
  const { accessToken } = useAuth();
  return React.useMemo(() => {
    const basePath = '/api';
    const authHeaders: Record<string, string> = accessToken ? { Authorization: accessToken } : {};
    const axiosInstance = axios.create({ headers: authHeaders });
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (401 === error.response.status) {
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      },
    );
    const config = new Configuration({ basePath });
    return new DefaultApi(config, basePath, axiosInstance);
  }, [accessToken]);
};
