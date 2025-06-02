import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { products } from '../../lib/products';
import CartButton from '../components/CartButton';
import FavoritesButton from '../components/FavoritesButton';
import { useFavorites } from '../../lib/favoritesContext';

const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

export default function ProductList() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const filtered = products.filter(p =>
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View className="flex-1 bg-red-600 pt-12 px-4">
      <Text className="text-white text-2xl font-bold font-serif tracking-widest mb-6 self-center">Spice-Haven</Text>
      <TextInput
        className="bg-white rounded-lg px-4 py-2 mb-4 text-base"
        placeholder="Search spices..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            className={`px-4 py-2 mr-2 rounded-full border ${selectedCategory === cat ? 'bg-black border-black' : 'bg-white border-gray-300'}`}
          >
            <Text className={selectedCategory === cat ? 'text-white font-bold' : 'text-black'}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center bg-white rounded-xl p-4 mb-4 shadow"
            onPress={() => router.push(`/products/${item.id}`)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.image }} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-bold mb-1">{item.name}</Text>
              <Text className="text-red-500 font-bold">${item.price}</Text>
            </View>
            <TouchableOpacity
              onPress={e => {
                e.stopPropagation();
                isFavorite(item.id) ? removeFavorite(item.id) : addFavorite(item.id);
              }}
              className="ml-2"
              activeOpacity={0.7}
            >
              <Text className="text-2xl">
                {isFavorite(item.id) ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      <FavoritesButton />
      <CartButton />
    </View>
  );
} 