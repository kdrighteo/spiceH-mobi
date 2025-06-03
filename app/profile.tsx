import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/authContext';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const renderHeader = () => (
    <View className="pt-12 px-4">
      <View className="flex-row items-center mb-6 justify-center">
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">👤</Text>
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest">Profile</Text>
      </View>
    </View>
  );

  const renderUserInfo = () => (
    <View className="px-4 mb-6">
      <View className="bg-white/90 rounded-2xl p-6 shadow">
        <Text className="text-xl font-bold text-gray-800 mb-2">{currentUser?.name}</Text>
        <Text className="text-gray-600">{currentUser?.email}</Text>
      </View>
    </View>
  );

  const renderMenuItems = () => (
    <View className="px-4 mb-6">
      <View className="bg-white/90 rounded-2xl shadow">
        <TouchableOpacity
          className="p-4 border-b border-gray-200"
          onPress={() => router.push('/orders')}
        >
          <Text className="text-gray-800 font-semibold">Order History</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 border-b border-gray-200"
          onPress={() => router.push('/favorites')}
        >
          <Text className="text-gray-800 font-semibold">Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 border-b border-gray-200"
          onPress={() => router.push('/addressBook')}
        >
          <Text className="text-gray-800 font-semibold">Address Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 border-b border-gray-200"
          onPress={() => router.push('/paymentMethods')}
        >
          <Text className="text-gray-800 font-semibold">Payment Methods</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 border-b border-gray-200"
          onPress={() => router.push('/settings')}
        >
          <Text className="text-gray-800 font-semibold">Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4 border-b border-gray-200"
          onPress={() => router.push('/myReviews')}
        >
          <Text className="text-gray-800 font-semibold">My Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="p-4"
          onPress={() => {
            logout();
            router.replace('/');
          }}
        >
          <Text className="text-red-600 font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderUserInfo()}
            {renderMenuItems()}
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