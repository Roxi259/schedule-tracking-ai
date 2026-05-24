/**
 * Custom Hook for Auth
 */

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
  loginAsync,
  registerAsync,
  logoutAsync,
  clearError,
} from '@/store/authSlice';
import { AuthRequest, RegisterRequest } from '@/types';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = (credentials: AuthRequest) => {
    return dispatch(loginAsync(credentials));
  };

  const register = (data: RegisterRequest) => {
    return dispatch(registerAsync(data));
  };

  const logout = () => {
    return dispatch(logoutAsync());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    login,
    register,
    logout,
    clearAuthError,
  };
};