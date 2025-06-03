import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useOrders } from '../../lib/orderContext';
import CartButton from '../components/CartButton';
import FavoritesButton from '../components/FavoritesButton';
import OrdersButton from '../components/OrdersButton';
import ProfileButton from '../components/ProfileButton';
import { Order } from '../../lib/types';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { orders, cancelOrder } = useOrders();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100 items-center justify-center">
        <Text className="text-gray-500 text-lg">Order not found</Text>
      </View>
    );
  }

  const renderHeader = () => (
    <View className="pt-12 px-4">
      <View className="flex-row items-center mb-6 justify-center">
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">📦</Text>
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest">Order Details</Text>
      </View>
    </View>
  );

  const renderOrderInfo = () => (
    <View className="px-4 mb-6">
      <View className="bg-white/90 rounded-2xl p-6 shadow">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-semibold text-gray-800">Order #{order.id}</Text>
          <Text className={`font-semibold ${
            order.status === 'delivered' ? 'text-green-600' :
            order.status === 'cancelled' ? 'text-red-600' :
            'text-yellow-600'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Text>
        </View>
        <Text className="text-gray-600 mb-4">{new Date(order.date).toLocaleDateString()}</Text>
        {order.trackingNumber && (
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Tracking Number</Text>
            <Text className="font-semibold text-gray-800">{order.trackingNumber}</Text>
          </View>
        )}
        {order.estimatedDelivery && (
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Estimated Delivery</Text>
            <Text className="font-semibold text-gray-800">{new Date(order.estimatedDelivery).toLocaleDateString()}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderAddress = () => (
    <View className="px-4 mb-6">
      <Text className="text-xl font-bold mb-4 text-red-700">Shipping Address</Text>
      <View className="bg-white/90 rounded-2xl p-6 shadow">
        {order.address ? (
          <>
            <Text className="font-semibold text-gray-800 mb-2">{order.address.name}</Text>
            <Text className="text-gray-600">{order.address.street}</Text>
            <Text className="text-gray-600">{`${order.address.city}, ${order.address.state} ${order.address.zip}`}</Text>
            <Text className="text-gray-600">{order.address.country}</Text>
          </>
        ) : (
          <Text className="text-gray-500">No address information available.</Text>
        )}
      </View>
    </View>
  );

  const renderPayment = () => (
    <View className="px-4 mb-6">
      <Text className="text-xl font-bold mb-4 text-red-700">Payment Method</Text>
      <View className="bg-white/90 rounded-2xl p-6 shadow">
        {order.paymentMethod && order.paymentMethod.type ? (
          <>
            <Text className="font-semibold text-gray-800 mb-2">
              {order.paymentMethod.type.charAt(0).toUpperCase() + order.paymentMethod.type.slice(1)} Card
            </Text>
            <Text className="text-gray-600">•••• {order.paymentMethod.last4}</Text>
          </>
        ) : (
          <Text className="text-gray-500">No payment information available.</Text>
        )}
      </View>
    </View>
  );

  const renderItems = () => (
    <View className="px-4 mb-6">
      <Text className="text-xl font-bold mb-4 text-red-700">Order Items</Text>
      <FlatList
        data={order.items}
        renderItem={({ item }) => (
          <View className="bg-white/90 rounded-2xl p-4 mb-4 shadow">
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 mb-1">{item.name}</Text>
                <Text className="text-gray-600 mb-2">${item.price.toFixed(2)}</Text>
                <Text className="text-gray-600">Quantity: {item.quantity}</Text>
              </View>
              <Text className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );

  const renderTotal = () => (
    <View className="px-4 mb-6">
      <View className="bg-white/90 rounded-2xl p-6 shadow">
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Subtotal</Text>
          <Text className="text-gray-800">${order.total.toFixed(2)}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-gray-600">Shipping</Text>
          <Text className="text-gray-800">$5.99</Text>
        </View>
        <View className="border-t border-gray-200 pt-2 mt-2">
          <View className="flex-row justify-between">
            <Text className="font-semibold text-gray-800">Total</Text>
            <Text className="font-semibold text-gray-800">${(order.total + 5.99).toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActions = () => (
    <View className="px-4 pb-12">
      {order.status === 'processing' && (
        <TouchableOpacity
          className="bg-red-600 px-8 py-3 rounded-full shadow-lg items-center mb-4"
          onPress={() => {
            cancelOrder(order.id);
            router.back();
          }}
        >
          <Text className="text-white text-lg font-semibold">Cancel Order</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        className="bg-red-600 px-8 py-3 rounded-full shadow-lg items-center"
        onPress={() => router.push('/products')}
      >
        <Text className="text-white text-lg font-semibold">Shop Again</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={
          <>
            {renderHeader()}
            {renderOrderInfo()}
            {renderAddress()}
            {renderPayment()}
            {renderItems()}
            {renderTotal()}
          </>
        }
        ListFooterComponent={renderActions}
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