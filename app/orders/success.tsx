import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useOrders } from '../../lib/orderContext';
import CartButton from '../components/CartButton';
import FavoritesButton from '../components/FavoritesButton';
import OrdersButton from '../components/OrdersButton';
import ProfileButton from '../components/ProfileButton';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { orders } = useOrders();
  const order = orders.find(o => o.id === id);

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-green-100 justify-center items-center">
      <View className="pt-12 px-4 w-full">
        <View className="flex-row items-center mb-6 justify-center">
          <Text className="text-3xl font-extrabold text-green-700 tracking-widest mr-2">🎉</Text>
          <Text className="text-3xl font-extrabold text-green-700 tracking-widest">Order Placed!</Text>
        </View>
      </View>
      {/* Confetti/celebration illustration */}
      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2278/2278992.png' }} className="w-32 h-32 mb-4" style={{ marginTop: -16 }} />
      <Text className="text-green-700 text-xl font-bold mb-2 text-center">Thank you for your purchase!</Text>
      <Text className="text-gray-700 text-base mb-4 text-center">We're preparing your order and will notify you when it ships.</Text>
      {order ? (
        <View className="bg-white/90 rounded-2xl p-6 mb-4 mx-4 shadow w-full max-w-md">
          <Text className="text-black font-bold mb-1">Order #{order.id}</Text>
          <Text className="text-gray-700 mb-1">Date: {new Date(order.date).toLocaleString()}</Text>
          <Text className="text-gray-700 mb-1">Total: ${order.total.toFixed(2)}</Text>
          <Text className="mb-1">Status: <Text className={order.status === 'cancelled' ? 'text-red-400' : order.status === 'delivered' ? 'text-green-400' : 'text-yellow-500'}>{order.status || 'processing'}</Text></Text>
          <Text className="font-semibold mt-2 mb-1">Items:</Text>
          {order.items.map((prod, idx) => (
            <Text key={idx} className="text-gray-800 text-sm">- {prod.name} x{prod.quantity}</Text>
          ))}
        </View>
      ) : (
        <View className="bg-white/90 rounded-2xl p-6 mb-4 mx-4 shadow w-full max-w-md items-center">
          <Text className="text-gray-500">Order not found.</Text>
        </View>
      )}
      <View className="flex-row space-x-4 mt-4">
        <TouchableOpacity className="bg-gradient-to-r from-red-500 to-yellow-400 px-8 py-3 rounded-full shadow-xl items-center border-2 border-red-700" onPress={() => router.push('/products')}>
          <Text className="text-white text-lg font-semibold">Continue Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white px-8 py-3 rounded-full border-2 border-red-600 shadow-xl items-center" onPress={() => router.push('/orders')}>
          <Text className="text-red-600 text-lg font-semibold">View Orders</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="mt-6 px-4 py-2 rounded-full bg-gray-200" onPress={() => router.back()}>
        <Text className="text-black font-semibold">Back to Order History</Text>
      </TouchableOpacity>
      {/* Floating Action Buttons */}
      <ProfileButton />
      <OrdersButton />
      <FavoritesButton />
      <CartButton />
    </View>
  );
} 