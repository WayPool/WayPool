import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export interface User {
  id: number;
  walletAddress: string;
  username: string;
  email?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  hasAcceptedLegalTerms?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/user/profile');
        if (response.status === 401) {
          return null;
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    staleTime: 60 * 1000, // 1 minute
  });

  const isAuthenticated = !!user;

  const value = {
    user: user || null,
    isAuthenticated,
    isLoading,
    error: error as Error | null,
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