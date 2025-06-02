import { useCart } from '../lib/cartContext';
import { View, Text, TouchableOpacity, Image, FlatList, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { addOrder } from '../lib/orders';

export default function CartScreen() {
  const { cart, updateQty, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
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
    await addOrder(cart, total);
    clearCart();
    setPromo('');
    setDiscount(0);
    setCheckingOut(false);
    Alert.alert('Order Placed', 'Your order has been placed!');
    router.push('/orders');
  };

  return (
    <View className="flex-1 bg-red-600 pt-12 px-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-white text-lg">← Back</Text>
      </TouchableOpacity>
      <Text className="text-white text-2xl font-bold font-serif tracking-widest mb-6 self-center">Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text className="text-white text-center mt-8">Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-white rounded-xl p-4 mb-4 shadow">
            <Image source={{ uri: item.image }} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-bold mb-1">{item.name}</Text>
              <Text className="text-red-500 font-bold mb-1">${item.price}</Text>
              <View className="flex-row items-center">
                <TouchableOpacity onPress={() => updateQty(item.id, item.qty - 1)} className="bg-gray-200 px-2 py-1 rounded-full mr-2"><Text>-</Text></TouchableOpacity>
                <Text className="mx-2">{item.qty}</Text>
                <TouchableOpacity onPress={() => updateQty(item.id, item.qty + 1)} className="bg-gray-200 px-2 py-1 rounded-full ml-2"><Text>+</Text></TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)} className="ml-2"><Text className="text-red-500 text-xl">×</Text></TouchableOpacity>
          </View>
        )}
      />
      <View className="mt-4 mb-2">
        <TextInput
          className="bg-white rounded-lg px-4 py-2 mb-2 text-base"
          placeholder="Promo code"
          value={promo}
          onChangeText={setPromo}
        />
        <TouchableOpacity className="bg-black px-4 py-2 rounded-lg items-center mb-2" onPress={handleApplyPromo}>
          <Text className="text-white font-semibold">Apply Promo</Text>
        </TouchableOpacity>
      </View>
      <View className="mb-4">
        <Text className="text-white text-base">Subtotal: ${subtotal.toFixed(2)}</Text>
        {discount > 0 && <Text className="text-green-400 text-base">Discount: -${discount.toFixed(2)}</Text>}
        <Text className="text-white text-xl font-bold text-right">Total: ${total.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        className="bg-green-600 px-6 py-3 rounded-lg shadow-lg items-center mb-8"
        onPress={handleCheckout}
        disabled={cart.length === 0 || checkingOut}
      >
        <Text className="text-white text-lg font-semibold">{checkingOut ? 'Processing...' : 'Checkout'}</Text>
      </TouchableOpacity>
    </View>
  );
} 