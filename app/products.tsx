import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { products } from '../lib/products';
import { useFavorites } from '../lib/favoritesContext';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';
import { Product } from '../lib/types';

const CATEGORIES = ['All', 'Spices', 'Herbs', 'Blends', 'Seasonings'];

export default function ProductsScreen() {
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderHeader = () => (
    <View className="pt-12 px-4">
      <View className="flex-row items-center mb-6 justify-center">
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">🌶️</Text>
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest">Products</Text>
      </View>
    </View>
  );

  const renderSearch = () => (
    <View className="px-4 mb-6">
      <TextInput
        className="bg-white/90 rounded-full px-6 py-3 shadow"
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

  const renderCategories = () => (
    <View className="mb-6">
      <FlatList
        data={CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedCategory(item)}
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedCategory === item ? 'bg-red-600' : 'bg-white/90'
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedCategory === item ? 'text-white' : 'text-gray-800'
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />
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
          onPress={() => isFavorite(item.id) ? removeFavorite(item.id) : addFavorite(item.id)}
          className="ml-4"
        >
          <Text className="text-2xl">{isFavorite(item.id) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderSearch()}
            {renderCategories()}
          </>
        }
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