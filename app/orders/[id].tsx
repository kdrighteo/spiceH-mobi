import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { getOrderById, updateOrderStatus, addOrder, Order } from '../../lib/orders';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id === 'string') {
      getOrderById(id).then(o => {
        setOrder(o || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleCancel = async () => {
    if (!order) return;
    await updateOrderStatus(order.id, 'cancelled');
    Alert.alert('Order Cancelled', 'Your order has been cancelled.');
    router.back();
  };

  const handleReorder = async () => {
    if (!order) return;
    await addOrder(order.items, order.total, order.promoCode, order.discount);
    Alert.alert('Order Reordered', 'This order has been added to your order history again!');
    router.push('/orders');
  };

  if (loading) {
    return <View className="flex-1 bg-red-600 justify-center items-center"><Text className="text-white">Loading...</Text></View>;
  }
  if (!order) {
    return <View className="flex-1 bg-red-600 justify-center items-center"><Text className="text-white">Order not found.</Text></View>;
  }

  return (
    <View className="flex-1 bg-red-600 pt-12 px-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-white text-lg">← Back</Text>
      </TouchableOpacity>
      <Text className="text-white text-2xl font-bold font-serif tracking-widest mb-4 self-center">Order #{order.id}</Text>
      <Text className="text-white mb-1">Date: {new Date(order.date).toLocaleString()}</Text>
      <Text className="text-white mb-1">Status: <Text className={order.status === 'cancelled' ? 'text-red-400' : order.status === 'completed' ? 'text-green-400' : 'text-yellow-300'}>{order.status || 'pending'}</Text></Text>
      <Text className="text-white mb-1">Total: ${order.total.toFixed(2)}</Text>
      {order.promoCode && <Text className="text-white mb-1">Promo Code: <Text className="font-bold">{order.promoCode}</Text></Text>}
      {order.discount ? <Text className="text-green-300 mb-1">Discount: -${order.discount.toFixed(2)}</Text> : null}
      <Text className="text-white font-semibold mt-2 mb-1">Items:</Text>
      {order.items.map((prod, idx) => (
        <Text key={idx} className="text-gray-100 text-sm">- {prod.name} x{prod.qty}</Text>
      ))}
      <View className="flex-row mt-6 space-x-4">
        {order.status === 'pending' && (
          <TouchableOpacity className="bg-red-500 px-4 py-2 rounded-lg" onPress={handleCancel}>
            <Text className="text-white font-semibold">Cancel Order</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity className="bg-black px-4 py-2 rounded-lg" onPress={handleReorder}>
          <Text className="text-white font-semibold">Reorder</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 