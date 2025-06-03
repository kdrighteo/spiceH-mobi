import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { PaymentMethod } from '../lib/types';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';

// For demo: use local state. In a real app, fetch from user context or backend.
const initialMethods: PaymentMethod[] = [
  { id: '1', type: 'credit', last4: '4242', isDefault: true },
  { id: '2', type: 'debit', last4: '1234', isDefault: false },
  { id: '3', type: 'paypal', last4: '0000', isDefault: false },
];

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [adding, setAdding] = useState(false);
  const [type, setType] = useState<'credit' | 'debit' | 'paypal'>('credit');
  const [last4, setLast4] = useState('');

  const handleAdd = () => {
    if (!last4 || last4.length !== 4) {
      Alert.alert('Error', 'Please enter the last 4 digits.');
      return;
    }
    setMethods(prev => [
      ...prev,
      { id: Date.now().toString(), type, last4, isDefault: methods.length === 0 },
    ]);
    setAdding(false);
    setLast4('');
    setType('credit');
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Payment Method', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setMethods(prev => prev.filter(m => m.id !== id)) },
    ]);
  };

  const handleSetDefault = (id: string) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const renderMethod = ({ item }: { item: PaymentMethod }) => (
    <View className={`bg-white/90 rounded-2xl p-6 mb-4 mx-4 shadow ${item.isDefault ? 'border-2 border-red-600' : ''}`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-2xl mr-2">{item.type === 'credit' ? '💳' : item.type === 'debit' ? '🏦' : '🅿️'}</Text>
        <Text className="font-semibold text-gray-800 flex-1">{item.type.charAt(0).toUpperCase() + item.type.slice(1)} {item.type !== 'paypal' ? 'Card' : ''}</Text>
        {item.isDefault && <Text className="text-xs text-red-600 font-bold ml-2">Default</Text>}
      </View>
      <Text className="text-gray-600 mb-2">•••• {item.last4}</Text>
      <View className="flex-row space-x-2 mt-2">
        <TouchableOpacity className="bg-red-600 px-4 py-2 rounded-full" onPress={() => handleSetDefault(item.id)}>
          <Text className="text-white font-semibold">Set Default</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full" onPress={() => handleDelete(item.id)}>
          <Text className="text-red-600 font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <View className="pt-12 px-4">
        <View className="flex-row items-center mb-6 justify-center">
          <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">💳</Text>
          <Text className="text-3xl font-extrabold text-red-700 tracking-widest">Payment Methods</Text>
        </View>
      </View>
      {adding ? (
        <View className="bg-white/90 rounded-2xl p-6 mx-4 shadow mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Add Payment Method</Text>
          <View className="mb-4">
            <Text className="text-gray-700 mb-2">Type</Text>
            <View className="flex-row space-x-2">
              {(['credit', 'debit', 'paypal'] as const).map(t => (
                <TouchableOpacity
                  key={t}
                  className={`px-4 py-2 rounded-full border ${type === t ? 'bg-red-600 border-red-600' : 'bg-white border-gray-300'}`}
                  onPress={() => setType(t)}
                >
                  <Text className={type === t ? 'text-white font-bold' : 'text-gray-800 font-semibold'}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {type !== 'paypal' && (
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">Last 4 Digits</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-500 mr-2">••••</Text>
                <TextInput
                  className="bg-white rounded-lg px-4 py-2 border border-gray-200 flex-1"
                  placeholder="1234"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={last4}
                  onChangeText={setLast4}
                />
              </View>
            </View>
          )}
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-gray-500 px-4 py-2 rounded-full"
              onPress={() => { setAdding(false); setLast4(''); setType('credit'); }}
            >
              <Text className="text-white text-center">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-red-600 px-4 py-2 rounded-full"
              onPress={handleAdd}
            >
              <Text className="text-white text-center">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <FlatList
            data={methods}
            renderItem={renderMethod}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <View className="items-center justify-center py-16 px-4">
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/484/484167.png' }} className="w-24 h-24 mb-4 opacity-80" />
                <Text className="text-2xl mb-2">💳</Text>
                <Text className="text-lg font-bold text-gray-700 mb-2 text-center">No payment methods saved yet.</Text>
                <Text className="text-gray-500 text-base mb-2 text-center">Add a payment method to make checkout faster and easier!</Text>
                <TouchableOpacity className="bg-red-600 px-8 py-3 rounded-full shadow-lg mt-2" onPress={() => setAdding(true)}>
                  <Text className="text-white text-lg font-semibold">Add Payment Method</Text>
                </TouchableOpacity>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
      {/* Floating Action Buttons */}
      <ProfileButton />
      <OrdersButton />
      <FavoritesButton />
      <CartButton />
    </View>
  );
} 