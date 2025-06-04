import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useOrders } from '../lib/orderContext';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';
import { Order } from '../lib/types';

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, clearOrders } = useOrders();

  const renderHeader = () => (
    <View className="pt-12 px-4">
      <View className="flex-row items-center mb-6 justify-center">
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">📦</Text>
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest">Orders</Text>
      </View>
      <TouchableOpacity
        className="bg-red-100 border border-red-600 px-4 py-2 rounded-full self-center mb-2"
        onPress={clearOrders}
        accessibilityLabel="Clear all orders (dev only)"
      >
        <Text className="text-red-600 font-semibold">Clear All Orders (Dev)</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center mt-20 mb-20 px-6">
      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/4076/4076549.png' }} className="w-36 h-36 mb-6 opacity-90" />
      <Text className="text-2xl font-bold text-gray-700 mb-2 text-center">No orders yet!</Text>
      <Text className="text-gray-500 text-base mb-4 text-center">You haven't placed any orders. Start shopping and enjoy our premium spices!</Text>
      <TouchableOpacity className="bg-red-600 px-8 py-3 rounded-full shadow-lg" onPress={() => router.push('/products')}>
        <Text className="text-white text-lg font-semibold">Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      onPress={() => router.push(`/orders/${(item as any).$id}`)}
      className="bg-white/90 rounded-2xl p-4 mb-4 mx-4 shadow"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-semibold text-gray-800">Order #{(item as any).$id}</Text>
        <Text className={`font-semibold ${
          item.status === 'delivered' ? 'text-green-600' :
          item.status === 'cancelled' ? 'text-red-600' :
          'text-yellow-600'
        }`}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      <Text className="text-gray-600 mb-2">{new Date(item.date).toLocaleDateString()}</Text>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-700">{item.items.length} items</Text>
        <Text className="font-semibold text-gray-800">${item.total.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <FlatList
        data={orders}
        renderItem={renderOrder}
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