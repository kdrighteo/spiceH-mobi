import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getOrders, Order } from '../lib/orders';

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <View className="flex-1 bg-red-600 pt-12 px-4">
      <TouchableOpacity onPress={() => router.back()} className="mb-4">
        <Text className="text-white text-lg">← Back</Text>
      </TouchableOpacity>
      <Text className="text-white text-2xl font-bold font-serif tracking-widest mb-6 self-center">Order History</Text>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text className="text-white text-center mt-8">No orders yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/orders/${item.id}`)}>
            <View className="bg-white rounded-xl p-4 mb-4 shadow">
              <Text className="text-lg font-bold mb-1">Order #{item.id}</Text>
              <Text className="text-gray-700 mb-1">Date: {new Date(item.date).toLocaleString()}</Text>
              <Text className="text-gray-700 mb-2">Total: ${item.total.toFixed(2)}</Text>
              <Text className="font-semibold mb-1">Items:</Text>
              {item.items.map((prod, idx) => (
                <Text key={idx} className="text-gray-800 text-sm">- {prod.name} x{prod.qty}</Text>
              ))}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
} 