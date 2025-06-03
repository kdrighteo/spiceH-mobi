import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { CartItem } from '../../types';

interface ProductCardProps {
  product: CartItem;
  isFavorite: boolean;
  onFavoriteToggle: (id: string) => void;
  onPress: () => void;
}

export default function ProductCard({ product, isFavorite, onFavoriteToggle, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white rounded-xl p-4 mb-4 shadow"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={{ uri: product.image }} className="w-16 h-16 rounded-lg mr-4" />
      <View className="flex-1">
        <Text className="text-lg font-bold mb-1">{product.name}</Text>
        <Text className="text-red-500 font-bold">${product.price}</Text>
      </View>
      <TouchableOpacity
        onPress={e => {
          e.stopPropagation();
          onFavoriteToggle(product.id);
        }}
        className="ml-2"
        activeOpacity={0.7}
      >
        <Text className="text-2xl">
          {isFavorite ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
} 