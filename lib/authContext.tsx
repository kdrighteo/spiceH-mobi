import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { account } from './appwrite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ID } from 'appwrite';

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
    checkUser();
  }, []);

  const checkUser = async () => {
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

  const signup = async (email: string, password: string, name: string) => {
    try {
      // Use Appwrite's built-in unique ID generator
      await account.create(ID.unique(), email, password, name);
      await account.createSession(email, password);
      const user = await account.get();
      setCurrentUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message?.toLowerCase().includes('already exists')) {
        Alert.alert('Error', 'This email is already registered. Please log in instead.');
      } else {
        Alert.alert('Error', `Failed to create account: ${error.message}`);
      }
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await account.createSession(email, password);
      const user = await account.get();
      setCurrentUser(user);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Error', `Login failed: ${error.message}`);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (currentUser) {
        await account.deleteSession('current');
      }
      await AsyncStorage.removeItem('user');
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
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