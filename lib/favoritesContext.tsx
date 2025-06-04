import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { addFavoriteToAppwrite, removeFavoriteFromAppwrite, getFavoritesForUser } from './favoritesApi';
import { useAuth } from './authContext';

export type FavoritesContextType = {
  favorites: string[];
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }
    (async () => {
      try {
        const favs = await getFavoritesForUser();
        console.log('Loaded favorites:', favs);
        setFavorites(favs);
      } catch (error) {
        console.error('Error loading favorites:', error);
        Alert.alert('Error', 'Failed to load favorites. Please try again.');
      }
    })();
  }, [currentUser]);

  const addFavorite = async (id: string) => {
    try {
      await addFavoriteToAppwrite(id);
      setFavorites((prev) => prev.includes(id) ? prev : [...prev, id]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add favorite.');
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      await removeFavoriteFromAppwrite(id);
      setFavorites((prev) => prev.filter(favId => favId !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to remove favorite.');
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
} 