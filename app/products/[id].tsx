import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { products } from '../../lib/products';
import { useState } from 'react';
import { useCart } from '../../lib/cartContext';
import CartButton from '../components/CartButton';
import { useFavorites } from '../../lib/favoritesContext';
import FavoritesButton from '../components/FavoritesButton';

const TABS = [
  { key: 'usage', label: 'Usage' },
  { key: 'conditions', label: 'Conditions' },
  { key: 'expiration', label: 'Expiration' },
];

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [selectedTab, setSelectedTab] = useState<'usage' | 'conditions' | 'expiration'>('usage');

  if (!product) return (
    <View className="flex-1 justify-center items-center bg-red-600">
      <Text className="text-white text-xl">Product not found</Text>
    </View>
  );

  const handleAddToCart = () => {
    addToCart({ ...product, qty });
    router.push('/cart');
  };

  const tabContent = {
    usage: product.usage,
    conditions: product.conditions,
    expiration: product.expiration,
  };

  return (
    <View className="flex-1 bg-red-600 pt-12 px-4">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-lg">← Back</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: product.image }} className="w-full h-48 rounded-xl mb-4" />
      <Text className="text-white text-3xl font-bold mb-2 font-serif tracking-widest">{product.name}</Text>
      <Text className="text-white mb-1 text-base">{product.description}</Text>
      <Text className="text-white mb-1 text-base font-semibold">Origin: <Text className="font-normal">{product.origin}</Text></Text>
      <Text className="text-red-200 text-2xl font-bold mb-2">${product.price}</Text>
      <View className="flex-row items-center mb-6">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => setQty(q => Math.max(1, q-1))} className="bg-white px-3 py-1 rounded-full mr-2"><Text className="text-lg">-</Text></TouchableOpacity>
          <Text className="text-white text-lg mx-2">{qty}</Text>
          <TouchableOpacity onPress={() => setQty(q => q+1)} className="bg-white px-3 py-1 rounded-full ml-2"><Text className="text-lg">+</Text></TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => isFavorite(product.id) ? removeFavorite(product.id) : addFavorite(product.id)}
          activeOpacity={0.7}
          className="ml-4"
        >
          <Text className="text-2xl">{isFavorite(product.id) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="bg-black px-8 py-3 rounded-lg shadow-lg items-center mb-4" onPress={handleAddToCart}>
        <Text className="text-white text-lg font-semibold">Add to Cart</Text>
      </TouchableOpacity>
      {/* Tabs */}
      <View className="flex-row justify-center mb-2 bg-white/80 rounded-xl p-1">
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setSelectedTab(tab.key as 'usage' | 'conditions' | 'expiration')}
            className={`flex-1 py-2 mx-1 rounded-lg ${selectedTab === tab.key ? 'bg-black' : 'bg-transparent'}`}
          >
            <Text className={`text-center text-sm font-semibold ${selectedTab === tab.key ? 'text-white' : 'text-black'}`}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="bg-white/90 rounded-xl p-4 mb-4 min-h-[80px]">
        <Text className="text-gray-800 text-base">{tabContent[selectedTab]}</Text>
      </View>
      <FavoritesButton />
      <CartButton />
    </View>
  );
} 