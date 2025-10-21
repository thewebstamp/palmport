"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => { },
  loading: true,
  refreshAuth: () => { }
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('palmport-token');
      const userData = localStorage.getItem('palmport-user');

      if (token && userData) {
        try {
          const response = await authAPI.verify();
          const userFromServer = response.data;
          setUser(userFromServer);
          localStorage.setItem('palmport-user', JSON.stringify(userFromServer));
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('palmport-token');
          localStorage.removeItem('palmport-user');
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const refreshAuth = () => {
    checkAuth();
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      const data = response.data;

      localStorage.setItem('palmport-token', data.token);
      localStorage.setItem('palmport-user', JSON.stringify(data.user));
      setUser(data.user);

      mergePendingCart();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.register(name, email, password);
      const data = response.data;

      localStorage.setItem('palmport-token', data.token);
      localStorage.setItem('palmport-user', JSON.stringify(data.user));
      setUser(data.user);

      mergePendingCart();
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  // Function to merge pending cart items with existing cart
  const mergePendingCart = () => {
    const pendingCart = localStorage.getItem('palmport-pending-cart');
    if (pendingCart) {
      const pendingItems = JSON.parse(pendingCart);
      const existingCart = JSON.parse(localStorage.getItem('palmport-cart') || '[]');

      // Merge logic: combine quantities for same items
      const mergedCart = [...existingCart];

      pendingItems.forEach((pendingItem: any) => {
        const existingIndex = mergedCart.findIndex((item: any) => item.id === pendingItem.id);
        if (existingIndex > -1) {
          mergedCart[existingIndex].quantity += pendingItem.quantity;
          mergedCart[existingIndex].total = mergedCart[existingIndex].price * mergedCart[existingIndex].quantity;
        } else {
          mergedCart.push(pendingItem);
        }
      });

      localStorage.setItem('palmport-cart', JSON.stringify(mergedCart));
      localStorage.removeItem('palmport-pending-cart');
    }
  };

  const logout = () => {
    localStorage.removeItem('palmport-token');
    localStorage.removeItem('palmport-user');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}