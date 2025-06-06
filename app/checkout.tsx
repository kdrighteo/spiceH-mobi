import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Alert, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../lib/cartContext';
import { useOrders } from '../lib/orderContext';
import { useAuth } from '../lib/authContext';
import AddressForm from './components/AddressForm';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';
import { PaymentMethod } from '../lib/types';

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
  const { cart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { currentUser } = useAuth();
  const PAYMENT_METHODS: PaymentMethod[] = [
    { id: '1', type: 'credit', last4: '4242', isDefault: true },
    { id: '2', type: 'debit', last4: '1234', isDefault: false },
    { id: '3', type: 'paypal', last4: '0000', isDefault: false },
  ];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0]);
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

  // Calculate subtotal and total from cart items
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Add discount logic here if needed
  console.log('Total amount:', total);
  console.log('Cart items:', cart);
  console.log('Cart total:', cart.reduce((sum, item) => sum + item.price * item.quantity, 0));

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
    setNewAddress({ name: '', street: '', city: '', state: '', zipCode: '', country: '' });
  };

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please log in to place an order.');
      router.push('/Login');
      return;
    }
    if (!selectedAddress) {
      Alert.alert('Error', 'Please select a shipping address');
      return;
    }
    const address = savedAddresses.find(a => a.id === selectedAddress);
    if (!address) {
      Alert.alert('Error', 'Selected address not found');
      return;
    }
    // Save the order with correct field names and types
    const newOrder = await addOrder({
      items: cart,
      total,
      address: {
        id: address.id,
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zipCode, // ensure 'zip' field
        country: address.country,
        isDefault: address.isDefault,
      },
      paymentMethod: selectedPaymentMethod,
    });
    clearCart();
    if (newOrder && (newOrder as any).$id) {
      router.push(`/orders/${(newOrder as any).$id}`);
    }
  };

  const renderHeader = () => (
    <View className="pt-12 px-4">
      <View className="flex-row items-center mb-2 justify-center">
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">🧾</Text>
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest">Checkout</Text>
      </View>
      <View className="flex-row justify-center mb-4">
        <Text className="text-gray-600 font-semibold bg-white/80 rounded-full px-4 py-1">Step 2 of 2: Review & Pay</Text>
      </View>
    </View>
  );

  const AnimatedCard = ({ children }: { children: React.ReactNode }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.97)).current;
    React.useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}>{children}</Animated.View>
    );
  };

  const renderAddresses = () => (
    <View className="px-4 mb-6">
      <Text className="text-xl font-bold mb-4 text-red-700">Shipping Address</Text>
      <FlatList
        data={savedAddresses}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <AnimatedCard>
            <TouchableOpacity
              onPress={() => setSelectedAddress(item.id)}
              className={`mr-4 p-4 rounded-2xl border-2 ${
                selectedAddress === item.id ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              style={{ width: 280 }}
            >
              <Text className="text-2xl mb-2">{item.name === 'Home' ? '🏠' : '🏢'}</Text>
              <Text className="font-semibold text-gray-800 mb-2">{item.name}</Text>
              <Text className="text-gray-600">{item.street}</Text>
              <Text className="text-gray-600">{`${item.city}, ${item.state} ${item.zipCode}`}</Text>
              <Text className="text-gray-600">{item.country}</Text>
            </TouchableOpacity>
          </AnimatedCard>
        )}
      />
      <TouchableOpacity
        className="bg-red-600 px-4 py-2 rounded-full mt-2 shadow-lg"
        onPress={() => setShowNewAddressForm(true)}
      >
        <Text className="text-white text-center font-semibold">Add New Address</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPaymentMethods = () => (
    <View className="px-4 mb-6">
      <Text className="text-xl font-bold mb-4 text-red-700">Payment Method</Text>
      <FlatList
        data={PAYMENT_METHODS}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <AnimatedCard>
            <TouchableOpacity
              onPress={() => setSelectedPaymentMethod(item)}
              className={`mr-4 p-4 rounded-2xl border-2 ${
                selectedPaymentMethod.id === item.id ? 'border-red-600 bg-red-50' : 'border-gray-200 bg-white'
              }`}
            >
              <Text className="text-2xl mb-2">{item.type.toUpperCase()}</Text>
              <Text className="font-semibold text-gray-800">{item.last4}</Text>
            </TouchableOpacity>
          </AnimatedCard>
        )}
      />
    </View>
  );

  const renderOrderSummary = () => (
    <View className="px-4 mb-6">
      <Text className="text-xl font-bold mb-4 text-red-700">Order Summary</Text>
      <AnimatedCard>
        <View className="bg-white rounded-2xl p-6 shadow">
          {cart.map((item) => (
            <View key={item.id} className="flex-row justify-between mb-2">
              <Text className="text-gray-800">{item.name} x {item.quantity}</Text>
              <Text className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View className="border-t border-gray-200 mt-4 pt-4">
            <View className="flex-row justify-between">
              <Text className="font-semibold">Total</Text>
              <Text className="font-semibold">${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>
    </View>
  );

  const renderFooter = () => (
    <View className="px-4 pb-12">
      <TouchableOpacity
        className="bg-gradient-to-r from-red-500 to-yellow-400 px-10 py-4 rounded-full shadow-xl items-center border-2 border-red-700"
        onPress={handlePlaceOrder}
        activeOpacity={0.85}
      >
        <Text className="text-white text-xl font-extrabold tracking-wide drop-shadow-lg">🎉 Place Order - ${total.toFixed(2)}</Text>
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
            {renderOrderSummary()}
            {renderAddresses()}
            {renderPaymentMethods()}
          </>
        }
        ListFooterComponent={renderFooter}
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