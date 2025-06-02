import { useRouter, useLocalSearchParams } from 'expo-router';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { getOrderById, updateOrderStatus, Order } from '../../lib/orders';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    if (typeof id === 'string') {
      getOrderById(id).then(o => setOrder(o || null));
    }
  }, [id]);

  // Simulate order processing and completion
  useEffect(() => {
    if (order && order.status === 'pending' && !notified) {
      const timer = setTimeout(async () => {
        await updateOrderStatus(order.id, 'completed');
        setOrder({ ...order, status: 'completed' });
        Alert.alert('Order Update', 'Your order has been completed!');
        setNotified(true);
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [order, notified]);

  return (
    <View className="flex-1 bg-green-600 pt-12 px-4 justify-center items-center">
      <Text className="text-white text-3xl font-bold mb-4">🎉 Order Placed!</Text>
      <Text className="text-white text-lg mb-4">Thank you for your purchase.</Text>
      {order && (
        <View className="bg-white/90 rounded-xl p-4 mb-4 w-full max-w-md">
          <Text className="text-black font-bold mb-1">Order #{order.id}</Text>
          <Text className="text-gray-700 mb-1">Date: {new Date(order.date).toLocaleString()}</Text>
          <Text className="text-gray-700 mb-1">Total: ${order.total.toFixed(2)}</Text>
          {order.promoCode && <Text className="text-gray-700 mb-1">Promo: <Text className="font-bold">{order.promoCode}</Text></Text>}
          {order.discount ? <Text className="text-green-600 mb-1">Discount: -${order.discount.toFixed(2)}</Text> : null}
          <Text className="mb-1">Status: <Text className={order.status === 'cancelled' ? 'text-red-400' : order.status === 'completed' ? 'text-green-400' : 'text-yellow-500'}>{order.status || 'pending'}</Text></Text>
          <Text className="font-semibold mt-2 mb-1">Items:</Text>
          {order.items.map((prod, idx) => (
            <Text key={idx} className="text-gray-800 text-sm">- {prod.name} x{prod.qty}</Text>
          ))}
        </View>
      )}
      <View className="flex-row space-x-4 mt-4">
        <TouchableOpacity className="bg-black px-4 py-2 rounded-lg" onPress={() => router.replace('/products')}>
          <Text className="text-white font-semibold">Continue Shopping</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-white px-4 py-2 rounded-lg" onPress={() => router.replace('/orders')}>
          <Text className="text-black font-semibold">View Orders</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 