import { useCart } from '../lib/cartContext';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { cart, updateQty, removeFromCart } = useCart();
  const router = useRouter();
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

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
      <View className="mt-auto mb-8">
        <Text className="text-white text-xl font-bold text-right">Total: ${total.toFixed(2)}</Text>
      </View>
    </View>
  );
} 