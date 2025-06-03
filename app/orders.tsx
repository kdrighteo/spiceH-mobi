import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  trackingNumber?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    date: '2024-03-15',
    status: 'delivered',
    items: [
      { id: '1', name: 'Black Pepper', quantity: 2, price: 5.99 },
      { id: '2', name: 'Cinnamon', quantity: 1, price: 4.99 },
    ],
    total: 16.97,
    trackingNumber: 'TRK123456789',
    shippingAddress: {
      name: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
  },
  {
    id: '2',
    date: '2024-03-10',
    status: 'shipped',
    items: [
      { id: '3', name: 'Turmeric', quantity: 1, price: 6.99 },
    ],
    total: 6.99,
    trackingNumber: 'TRK987654321',
    shippingAddress: {
      name: 'Office',
      street: '456 Work Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA',
    },
  },
];

export default function Orders() {
  const router = useRouter();

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">Order History</Text>
        {mockOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            className="bg-white rounded-lg p-4 mb-4"
            onPress={() => router.push(`/orders/${order.id}`)}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-semibold">Order #{order.id}</Text>
              <Text className="text-gray-500">{formatDate(order.date)}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Total: ${order.total.toFixed(2)}</Text>
              <View className={`px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                <Text className="text-white text-sm capitalize">{order.status}</Text>
              </View>
            </View>
            {order.trackingNumber && (
              <Text className="text-gray-600 mb-2">
                Tracking: {order.trackingNumber}
              </Text>
            )}
            <View className="border-t border-gray-200 mt-2 pt-2">
              <Text className="text-gray-600">Shipping to: {order.shippingAddress.name}</Text>
              <Text className="text-gray-600">{order.shippingAddress.street}</Text>
              <Text className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
} 