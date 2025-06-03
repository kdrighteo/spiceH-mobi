import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Address } from '../../types';

interface AddressFormProps {
  address: Partial<Address>;
  onChange: (address: Partial<Address>) => void;
  onSave: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function AddressForm({ address, onChange, onSave, onCancel, loading }: AddressFormProps) {
  return (
    <View className="bg-white rounded-lg p-4 mb-6">
      <Text className="text-xl font-semibold mb-4">Add New Address</Text>
      <TextInput
        className="border border-gray-200 rounded-lg p-2 mb-2"
        placeholder="Address Name (e.g., Home, Office)"
        value={address.name || ''}
        onChangeText={text => onChange({ ...address, name: text })}
      />
      <TextInput
        className="border border-gray-200 rounded-lg p-2 mb-2"
        placeholder="Street Address"
        value={address.street || ''}
        onChangeText={text => onChange({ ...address, street: text })}
      />
      <TextInput
        className="border border-gray-200 rounded-lg p-2 mb-2"
        placeholder="City"
        value={address.city || ''}
        onChangeText={text => onChange({ ...address, city: text })}
      />
      <TextInput
        className="border border-gray-200 rounded-lg p-2 mb-2"
        placeholder="State"
        value={address.state || ''}
        onChangeText={text => onChange({ ...address, state: text })}
      />
      <TextInput
        className="border border-gray-200 rounded-lg p-2 mb-2"
        placeholder="ZIP Code"
        value={address.zipCode || ''}
        onChangeText={text => onChange({ ...address, zipCode: text })}
      />
      <TextInput
        className="border border-gray-200 rounded-lg p-2 mb-4"
        placeholder="Country"
        value={address.country || ''}
        onChangeText={text => onChange({ ...address, country: text })}
      />
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="bg-gray-500 px-4 py-2 rounded-lg"
          onPress={onCancel}
          disabled={loading}
        >
          <Text className="text-white text-center">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-lg"
          onPress={onSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center">Save Address</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
} 