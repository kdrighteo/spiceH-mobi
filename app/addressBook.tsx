import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Address } from '../lib/types';
import AddressForm from './components/AddressForm';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';

// For demo: use local state. In a real app, fetch from user context or backend.
const initialAddresses: Address[] = [
  {
    id: '1',
    name: 'Home',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Office',
    street: '456 Work Ave',
    city: 'New York',
    state: 'NY',
    zip: '10002',
    country: 'USA',
    isDefault: false,
  },
];

export default function AddressBookScreen() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);
  const [formAddress, setFormAddress] = useState<Partial<Address>>({});

  const handleAdd = () => {
    if (!formAddress.name || !formAddress.street || !formAddress.city || !formAddress.state || !formAddress.zip || !formAddress.country) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setAddresses(prev => [...prev, { ...formAddress, id: Date.now().toString(), isDefault: addresses.length === 0 } as Address]);
    setShowForm(false);
    setFormAddress({});
  };

  const handleEdit = () => {
    if (!formAddress.id) return;
    setAddresses(prev => prev.map(a => (a.id === formAddress.id ? { ...formAddress } as Address : a)));
    setEditAddress(null);
    setShowForm(false);
    setFormAddress({});
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setAddresses(prev => prev.filter(a => a.id !== id)) },
    ]);
  };

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  };

  const startAdd = () => {
    setEditAddress(null);
    setFormAddress({});
    setShowForm(true);
  };

  const startEdit = (address: Address) => {
    setEditAddress(address);
    setFormAddress(address);
    setShowForm(true);
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <View className={`bg-white/90 rounded-2xl p-6 mb-4 mx-4 shadow ${item.isDefault ? 'border-2 border-red-600' : ''}`}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-semibold text-gray-800">{item.name}</Text>
        {item.isDefault && <Text className="text-xs text-red-600 font-bold">Default</Text>}
      </View>
      <Text className="text-gray-600">{item.street}</Text>
      <Text className="text-gray-600">{`${item.city}, ${item.state} ${item.zip}`}</Text>
      <Text className="text-gray-600 mb-2">{item.country}</Text>
      <View className="flex-row space-x-2 mt-2">
        <TouchableOpacity className="bg-red-600 px-4 py-2 rounded-full" onPress={() => handleSetDefault(item.id)}>
          <Text className="text-white font-semibold">Set Default</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-200 px-4 py-2 rounded-full" onPress={() => startEdit(item)}>
          <Text className="text-gray-800 font-semibold">Edit</Text>
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
          <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">🏠</Text>
          <Text className="text-3xl font-extrabold text-red-700 tracking-widest">Address Book</Text>
        </View>
      </View>
      {showForm ? (
        <AddressForm
          address={formAddress}
          onChange={setFormAddress}
          onSave={editAddress ? handleEdit : handleAdd}
          onCancel={() => { setShowForm(false); setEditAddress(null); setFormAddress({}); }}
        />
      ) : (
        <>
          <FlatList
            data={addresses}
            renderItem={({ item }) => renderAddress({ item })}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <View className="items-center justify-center py-16 px-4">
                <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/484/484167.png' }} className="w-24 h-24 mb-4 opacity-80" />
                <Text className="text-lg font-bold text-gray-700 mb-2 text-center">No addresses saved yet.</Text>
                <Text className="text-gray-500 text-base mb-2 text-center">Add your shipping address to make checkout faster!</Text>
                <TouchableOpacity className="bg-red-600 px-8 py-3 rounded-full shadow-lg mt-2" onPress={startAdd}>
                  <Text className="text-white text-lg font-semibold">Add Address</Text>
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