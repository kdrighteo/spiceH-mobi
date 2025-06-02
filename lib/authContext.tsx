import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = {
  email: string;
  password: string;
};

export type AuthContextType = {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const USERS_KEY = 'spicehaven_users';
const SESSION_KEY = 'spicehaven_session';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY).then(email => {
      if (email) {
        AsyncStorage.getItem(USERS_KEY).then(data => {
          const users: User[] = data ? JSON.parse(data) : [];
          const user = users.find(u => u.email === email);
          setCurrentUser(user || null);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, []);

  const signup = async (email: string, password: string) => {
    const data = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = data ? JSON.parse(data) : [];
    if (users.find(u => u.email === email)) return false;
    users.push({ email, password });
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(SESSION_KEY, email);
    setCurrentUser({ email, password });
    return true;
  };

  const login = async (email: string, password: string) => {
    const data = await AsyncStorage.getItem(USERS_KEY);
    const users: User[] = data ? JSON.parse(data) : [];
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return false;
    await AsyncStorage.setItem(SESSION_KEY, email);
    setCurrentUser(user);
    return true;
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
} 