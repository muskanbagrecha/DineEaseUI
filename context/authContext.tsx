'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import jwt from 'jsonwebtoken';

import { getSession } from '@/actions/cookies';
import { roles } from '@/types/common';

interface AuthContextType {
  isAuthorized: boolean;
  loading: boolean;
  recheckSession: () => Promise<void>;
  user: {
    email?: string;
    roles: roles;
  } | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const checkSession = async () => {
    setLoading(true);
    setIsAuthorized(false);
    try {
      const session = await getSession('token');
      setIsAuthorized(!!session);
      if (session) {
        const decodedToken = jwt.decode(session) as jwt.JwtPayload;
        setUser({
          email: decodedToken.sub,
          roles: decodedToken.roles[0].authority,
        });
      }
      if (!session) {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to check session', error);
      setIsAuthorized(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthorized, loading, recheckSession: checkSession, user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
