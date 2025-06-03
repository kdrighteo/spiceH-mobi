import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../lib/favoritesContext';
import { products } from '../lib/products';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';
import { Product } from '../lib/types';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  const renderHeader = () => (
    <View className="pt-12 px-4">
      <View className="flex-row items-center mb-6 justify-center">
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">❤️</Text>
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest">Favorites</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center mt-20 mb-20 px-6">
      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/833/833472.png' }} className="w-36 h-36 mb-6 opacity-90" />
      <Text className="text-2xl font-bold text-gray-700 mb-2 text-center">No favorites yet!</Text>
      <Text className="text-gray-500 text-base mb-4 text-center">You haven't added any favorites. Browse our products and tap the heart to save your favorites!</Text>
      <TouchableOpacity className="bg-red-600 px-8 py-3 rounded-full shadow-lg" onPress={() => router.push('/products')}>
        <Text className="text-white text-lg font-semibold">Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      onPress={() => router.push(`/products/${item.id}`)}
      className="bg-white/90 rounded-2xl p-4 mb-4 mx-4 shadow"
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 mb-1">{item.name}</Text>
          <Text className="text-gray-600 mb-2">${item.price.toFixed(2)}</Text>
          <Text className="text-gray-600 text-sm" numberOfLines={2}>{item.description}</Text>
        </View>
        <TouchableOpacity
          onPress={() => removeFavorite(item.id)}
          className="ml-4"
        >
          <Text className="text-2xl">❤️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <FlatList
        data={favoriteProducts}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
      {/* Floating Action Buttons */}
      <ProfileButton />
      <OrdersButton />
      <FavoritesButton />
      <CartButton />
    </View>
  );
} 