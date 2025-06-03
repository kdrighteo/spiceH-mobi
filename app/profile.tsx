import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/authContext';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      <View className="bg-white/90 rounded-2xl p-6 shadow items-center">
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} className="w-20 h-20 rounded-full mb-3" />
        <Text className="text-xl font-bold text-gray-800 mb-1">{currentUser?.name}</Text>
        <Text className="text-gray-600 mb-2">{currentUser?.email}</Text>
      </View>
    </View>
  );

  const menuItems = [
    { label: 'Order History', icon: '📦', route: '/orders' },
    { label: 'Favorites', icon: '❤️', route: '/favorites' },
    { label: 'Address Book', icon: '🏠', route: '/addressBook' },
    { label: 'Payment Methods', icon: '💳', route: '/paymentMethods' },
    { label: 'Settings', icon: '⚙️', route: '/settings' },
    { label: 'My Reviews', icon: '📝', route: '/myReviews' },
  ];

  const renderMenuItems = () => (
    <View className="px-4 mb-6">
      <View className="bg-white/90 rounded-2xl shadow flex-row flex-wrap justify-between p-2">
        {!currentUser && (
          <>
            <TouchableOpacity
              className="w-full mb-2 p-4 rounded-xl bg-black items-center shadow"
              onPress={() => router.push('/Login' as any)}
            >
              <Text className="text-white text-lg font-semibold">Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full mb-4 p-4 rounded-xl bg-white border border-black items-center shadow"
              onPress={() => router.push('/Login' as any)}
            >
              <Text className="text-black text-lg font-semibold">Log In</Text>
            </TouchableOpacity>
          </>
        )}
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.label}
            className="w-[48%] m-1 p-4 rounded-xl bg-white border border-gray-200 items-center shadow"
            onPress={() => router.push(item.route)}
          >
            <Text className="text-2xl mb-2">{item.icon}</Text>
            <Text className="text-gray-800 font-semibold text-center">{item.label}</Text>
          </TouchableOpacity>
        ))}
        {currentUser && (
          <TouchableOpacity
            className="w-full mt-4 p-4 rounded-xl bg-red-50 border border-red-200 items-center shadow"
            onPress={async () => { 
              await logout(); 
              await AsyncStorage.removeItem('onboardingComplete');
              router.replace('/Onboarding' as any); 
            }}
          >
            <Text className="text-red-600 font-semibold text-lg">Logout</Text>
          </TouchableOpacity>
        )}
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