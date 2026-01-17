import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSession, login, logout, User } from './auth-service';
import { useWallet } from '@/hooks/use-wallet';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => Promise<boolean>;
  logout: () => Promise<boolean>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { address } = useWallet();

  const refreshSession = async () => {
    try {
      const session = await getSession();
      setIsLoggedIn(session.isLoggedIn);
      setUser(session.user || null);
    } catch (error) {
      console.error('Error al refrescar sesión:', error);
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Refrescar la sesión al montar el componente
  useEffect(() => {
    refreshSession();
  }, []);

  // Refrescar la sesión cuando cambia la dirección del wallet
  useEffect(() => {
    if (address) {
      refreshSession();
    }
  }, [address]);

  const loginUser = async (): Promise<boolean> => {
    if (!address) {
      console.error('No wallet address available');
      return false;
    }

    try {
      setIsLoading(true);
      const response = await login(address);
      
      if (response.success && response.user) {
        setUser(response.user);
        setIsLoggedIn(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await logout();
      
      if (response.success) {
        setUser(null);
        setIsLoggedIn(false);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoggedIn,
    isLoading,
    login: loginUser,
    logout: logoutUser,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}