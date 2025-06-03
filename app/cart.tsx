import React from 'react';
import { useCart } from '../lib/cartContext';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';
import { CartItem } from '../lib/types';

export default function CartScreen() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);

  const subtotal = cart.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;

  const handleApplyPromo = () => {
    if (promo.trim().toUpperCase() === 'SPICE20') {
      setDiscount(subtotal * 0.2);
      Alert.alert('Promo Applied', '20% discount applied!');
    } else {
      setDiscount(0);
      Alert.alert('Invalid Code', 'Promo code not valid.');
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    // In a real app, you would process the order here
    setTimeout(() => {
      setPromo('');
      setDiscount(0);
      setCheckingOut(false);
      router.push('/checkout');
    }, 1000);
  };

  const renderHeader = () => (
    <View className="pt-12 px-4">
      <View className="flex-row items-center mb-6 justify-center">
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">🛒</Text>
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest">Cart</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center mt-20 mb-20 px-6">
      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2038/2038854.png' }} className="w-36 h-36 mb-6 opacity-90" />
      <Text className="text-2xl font-bold text-gray-700 mb-2 text-center">Your cart is feeling lonely!</Text>
      <Text className="text-gray-500 text-base mb-4 text-center">Looks like you haven't added anything yet. Start shopping and fill your cart with flavor!</Text>
      <TouchableOpacity className="bg-red-600 px-8 py-3 rounded-full shadow-lg" onPress={() => router.push('/products')}>
        <Text className="text-white text-lg font-semibold">Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View className="px-4 pb-12">
      {cart.length > 0 && (
        <>
          {/* Promo Code */}
          <View className="bg-white/90 rounded-2xl p-6 mb-6 shadow">
            <Text className="text-xl font-bold mb-4 text-red-700">Promo Code</Text>
            <View className="flex-row">
              <TextInput
                className="flex-1 bg-white rounded-l-full px-4 py-2 border border-gray-200 mr-2"
                placeholder="Enter promo code"
                value={promo}
                onChangeText={setPromo}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                className="bg-red-600 px-6 py-2 rounded-r-full"
                onPress={handleApplyPromo}
              >
                <Text className="text-white font-semibold">Apply</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Order Summary */}
          <View className="bg-white/90 rounded-2xl p-6 mb-6 shadow">
            <Text className="text-xl font-bold mb-4 text-red-700">Order Summary</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="text-gray-800">${subtotal.toFixed(2)}</Text>
              </View>
              {discount > 0 && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Discount</Text>
                  <Text className="text-green-600">-${discount.toFixed(2)}</Text>
                </View>
              )}
              <View className="border-t border-gray-200 pt-2 mt-2">
                <View className="flex-row justify-between">
                  <Text className="font-semibold text-gray-800">Total</Text>
                  <Text className="font-semibold text-gray-800">${total.toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Checkout Button */}
          <TouchableOpacity
            className="bg-red-600 px-8 py-3 rounded-full shadow-lg items-center"
            onPress={handleCheckout}
            disabled={checkingOut}
            accessibilityLabel="Proceed to checkout"
          >
            <Text className="text-white text-lg font-semibold">{checkingOut ? 'Processing...' : 'Proceed to Checkout'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: CartItem }) => (
    <View className="bg-white/90 rounded-2xl p-4 mb-4 mx-4 shadow">
      <View className="flex-row items-center">
        <Image source={{ uri: item.image }} className="w-20 h-20 rounded-lg mr-4" />
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 mb-1">{item.name}</Text>
          <Text className="text-gray-600 mb-2">${item.price.toFixed(2)}</Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="bg-gray-200 px-3 py-1 rounded-full"
            >
              <Text className="text-lg">-</Text>
            </TouchableOpacity>
            <Text className="mx-4 text-gray-800">{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, item.quantity + 1)}
              className="bg-gray-200 px-3 py-1 rounded-full"
            >
              <Text className="text-lg">+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => removeFromCart(item.id)}
              className="ml-auto"
            >
              <Text className="text-red-600">Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <FlatList
        data={cart}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
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