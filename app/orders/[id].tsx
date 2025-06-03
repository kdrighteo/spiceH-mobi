import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Mock order data - in a real app, this would come from an API or database
const mockOrder = {
  id: '1',
  date: '2024-03-15',
  status: 'shipped',
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
  paymentMethod: {
    type: 'credit_card',
    last4: '4242',
  },
  estimatedDelivery: '2024-03-20',
  shippingMethod: 'Standard Shipping',
};

export default function OrderDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            setIsCancelling(true);
            // In a real app, this would make an API call to cancel the order
            setTimeout(() => {
              setIsCancelling(false);
              Alert.alert('Success', 'Order has been cancelled');
              router.back();
            }, 1000);
          },
        },
      ]
    );
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
        <TouchableOpacity
          onPress={() => router.back()}
          className="mb-4"
        >
          <Text className="text-blue-500">← Back to Orders</Text>
        </TouchableOpacity>

        <Text className="text-2xl font-bold mb-6">Order #{id}</Text>

        {/* Order Status */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">Order Status</Text>
          <View className="flex-row items-center">
            <View className="bg-blue-500 px-3 py-1 rounded-full mr-2">
              <Text className="text-white capitalize">{mockOrder.status}</Text>
            </View>
            <Text className="text-gray-600">
              Placed on {formatDate(mockOrder.date)}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">Items</Text>
          {mockOrder.items.map((item) => (
            <View key={item.id} className="flex-row justify-between py-2 border-b border-gray-100">
              <View>
                <Text className="font-medium">{item.name}</Text>
                <Text className="text-gray-500">Qty: {item.quantity}</Text>
              </View>
              <Text className="font-medium">${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View className="flex-row justify-between mt-2 pt-2 border-t border-gray-200">
            <Text className="font-semibold">Total</Text>
            <Text className="font-semibold">${mockOrder.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Shipping Information */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">Shipping Information</Text>
          <Text className="text-gray-600 mb-1">{mockOrder.shippingAddress.name}</Text>
          <Text className="text-gray-600 mb-1">{mockOrder.shippingAddress.street}</Text>
          <Text className="text-gray-600 mb-1">
            {mockOrder.shippingAddress.city}, {mockOrder.shippingAddress.state} {mockOrder.shippingAddress.zipCode}
          </Text>
          <Text className="text-gray-600 mb-2">{mockOrder.shippingAddress.country}</Text>
          <Text className="text-gray-600">Method: {mockOrder.shippingMethod}</Text>
          {mockOrder.trackingNumber && (
            <Text className="text-gray-600 mt-2">
              Tracking Number: {mockOrder.trackingNumber}
            </Text>
          )}
          <Text className="text-gray-600 mt-2">
            Estimated Delivery: {formatDate(mockOrder.estimatedDelivery)}
          </Text>
        </View>

        {/* Payment Information */}
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-lg font-semibold mb-2">Payment Information</Text>
          <Text className="text-gray-600">
            {mockOrder.paymentMethod.type === 'credit_card' ? 'Credit Card' : 'Other'} ending in {mockOrder.paymentMethod.last4}
          </Text>
        </View>

        {/* Cancel Order Button */}
        {mockOrder.status !== 'delivered' && mockOrder.status !== 'cancelled' && (
          <TouchableOpacity
            onPress={handleCancelOrder}
            disabled={isCancelling}
            className={`bg-red-500 rounded-lg p-4 mb-4 ${isCancelling ? 'opacity-50' : ''}`}
          >
            <Text className="text-white text-center font-semibold">
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
} 