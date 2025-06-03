import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Order } from '../../types';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

function getStatusColor(status: Order['status']) {
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
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const OrderCard = ({ order, onPress }: OrderCardProps) => (
  <TouchableOpacity
    className="bg-white rounded-lg p-4 mb-4"
    onPress={onPress}
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
);

export default OrderCard; 