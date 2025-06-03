import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';

export default function Settings() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Password changed successfully.');
      router.push('/profile');
    }, 1000);
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <View className="pt-12 px-4">
        <View className="flex-row items-center mb-6 justify-center">
          <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">⚙️</Text>
          <Text className="text-3xl font-extrabold text-red-700 tracking-widest">Settings</Text>
        </View>
      </View>
      <View className="bg-white/90 rounded-2xl p-6 mx-4 shadow mb-8">
        <Text className="text-xl font-bold text-gray-800 mb-4">Change Password</Text>
        <View className="mb-4">
          <Text className="text-gray-700 mb-2">Current Password</Text>
          <TextInput
            className="bg-white rounded-lg px-4 py-3 border border-gray-200"
            placeholder="Enter current password"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
        </View>
        <View className="mb-4">
          <Text className="text-gray-700 mb-2">New Password</Text>
          <TextInput
            className="bg-white rounded-lg px-4 py-3 border border-gray-200"
            placeholder="Enter new password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>
        <View className="mb-6">
          <Text className="text-gray-700 mb-2">Confirm New Password</Text>
          <TextInput
            className="bg-white rounded-lg px-4 py-3 border border-gray-200"
            placeholder="Confirm new password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
        <TouchableOpacity
          className="bg-red-600 px-8 py-3 rounded-full shadow-lg items-center mb-4"
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text className="text-white text-lg font-semibold">{loading ? 'Processing...' : 'Change Password'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-white/90 px-8 py-3 rounded-full shadow-lg items-center"
          onPress={() => router.push('/profile')}
        >
          <Text className="text-red-600 text-lg font-semibold">Back to Profile</Text>
        </TouchableOpacity>
      </View>
      {/* Floating Action Buttons */}
      <ProfileButton />
      <OrdersButton />
      <FavoritesButton />
      <CartButton />
    </View>
  );
} 