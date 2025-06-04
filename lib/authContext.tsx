import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { account } from './appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthContextType = {
  currentUser: any | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check AsyncStorage first
    const checkStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error reading stored user:', error);
      }
    };
    checkStoredUser();

    // Then check Appwrite session
    const getCurrentUser = async () => {
      try {
        const user = await account.get();
        setCurrentUser(user);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        setCurrentUser(null);
        await AsyncStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    getCurrentUser();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      await account.create('unique()', email, password, name);
      // Automatically log in after sign up
      await account.createSession(email, password);
      const user = await account.get();
      setCurrentUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'Failed to sign up. Please try again.');
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createSession(email, password);
      await account.createSession(email, password);
      const user = await account.get();
      setCurrentUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Failed to log in. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await account.deleteSession('current');
      await AsyncStorage.removeItem('user');
      setCurrentUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      Alert.alert('Error', error.message || 'Failed to log out. Please try again.');
    }
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 