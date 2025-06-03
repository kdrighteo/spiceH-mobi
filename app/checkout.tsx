import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../lib/cartContext';

type PaymentMethod = 'credit' | 'debit' | 'paypal' | 'apple';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export default function Checkout() {
  const router = useRouter();
  const { cart, total, clearCart } = useCart();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('credit');
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Mock saved addresses - In a real app, these would come from a database
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Office',
      street: '456 Work Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'USA',
      isDefault: false,
    },
  ]);

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zipCode || !newAddress.country) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      name: newAddress.name!,
      street: newAddress.street!,
      city: newAddress.city!,
      state: newAddress.state!,
      zipCode: newAddress.zipCode!,
      country: newAddress.country!,
      isDefault: savedAddresses.length === 0,
    };

    setSavedAddresses([...savedAddresses, address]);
    setShowNewAddressForm(false);
    setNewAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a shipping address');
      return;
    }

    // In a real app, you would process the payment and create an order here
    Alert.alert(
      'Order Placed',
      'Your order has been placed successfully!',
      [
        {
          text: 'View Order',
          onPress: () => {
            clearCart();
            router.push('/orders');
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-4">
        <Text className="text-2xl font-bold mb-6">Checkout</Text>

        {/* Order Summary */}
        <View className="bg-white rounded-lg p-4 mb-6">
          <Text className="text-xl font-semibold mb-4">Order Summary</Text>
          {cart.map((item) => (
            <View key={item.id} className="flex-row justify-between mb-2">
              <Text>{item.name} x {item.quantity}</Text>
              <Text>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View className="border-t border-gray-200 mt-4 pt-4">
            <View className="flex-row justify-between">
              <Text className="font-semibold">Total</Text>
              <Text className="font-semibold">${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Shipping Address */}
        <View className="bg-white rounded-lg p-4 mb-6">
          <Text className="text-xl font-semibold mb-4">Shipping Address</Text>
          {savedAddresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              className={`p-4 border rounded-lg mb-2 ${
                selectedAddress === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onPress={() => setSelectedAddress(address.id)}
            >
              <Text className="font-semibold">{address.name}</Text>
              <Text>{address.street}</Text>
              <Text>{`${address.city}, ${address.state} ${address.zipCode}`}</Text>
              <Text>{address.country}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            className="bg-blue-500 px-4 py-2 rounded-lg mt-2"
            onPress={() => setShowNewAddressForm(true)}
          >
            <Text className="text-white text-center">Add New Address</Text>
          </TouchableOpacity>
        </View>

        {/* New Address Form */}
        {showNewAddressForm && (
          <View className="bg-white rounded-lg p-4 mb-6">
            <Text className="text-xl font-semibold mb-4">Add New Address</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-2 mb-2"
              placeholder="Address Name (e.g., Home, Office)"
              value={newAddress.name}
              onChangeText={(text) => setNewAddress({ ...newAddress, name: text })}
            />
            <TextInput
              className="border border-gray-200 rounded-lg p-2 mb-2"
              placeholder="Street Address"
              value={newAddress.street}
              onChangeText={(text) => setNewAddress({ ...newAddress, street: text })}
            />
            <TextInput
              className="border border-gray-200 rounded-lg p-2 mb-2"
              placeholder="City"
              value={newAddress.city}
              onChangeText={(text) => setNewAddress({ ...newAddress, city: text })}
            />
            <TextInput
              className="border border-gray-200 rounded-lg p-2 mb-2"
              placeholder="State"
              value={newAddress.state}
              onChangeText={(text) => setNewAddress({ ...newAddress, state: text })}
            />
            <TextInput
              className="border border-gray-200 rounded-lg p-2 mb-2"
              placeholder="ZIP Code"
              value={newAddress.zipCode}
              onChangeText={(text) => setNewAddress({ ...newAddress, zipCode: text })}
            />
            <TextInput
              className="border border-gray-200 rounded-lg p-2 mb-4"
              placeholder="Country"
              value={newAddress.country}
              onChangeText={(text) => setNewAddress({ ...newAddress, country: text })}
            />
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="bg-gray-500 px-4 py-2 rounded-lg"
                onPress={() => setShowNewAddressForm(false)}
              >
                <Text className="text-white text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onPress={handleAddAddress}
              >
                <Text className="text-white text-center">Save Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Payment Methods */}
        <View className="bg-white rounded-lg p-4 mb-6">
          <Text className="text-xl font-semibold mb-4">Payment Method</Text>
          <View className="space-y-2">
            <TouchableOpacity
              className={`p-4 border rounded-lg ${
                selectedPaymentMethod === 'credit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onPress={() => setSelectedPaymentMethod('credit')}
            >
              <Text className="font-semibold">Credit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`p-4 border rounded-lg ${
                selectedPaymentMethod === 'debit' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onPress={() => setSelectedPaymentMethod('debit')}
            >
              <Text className="font-semibold">Debit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`p-4 border rounded-lg ${
                selectedPaymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onPress={() => setSelectedPaymentMethod('paypal')}
            >
              <Text className="font-semibold">PayPal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`p-4 border rounded-lg ${
                selectedPaymentMethod === 'apple' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onPress={() => setSelectedPaymentMethod('apple')}
            >
              <Text className="font-semibold">Apple Pay</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          className="bg-blue-500 px-4 py-3 rounded-lg mb-6"
          onPress={handlePlaceOrder}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Place Order - ${total.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
} 