import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Settings() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    // Add logic to change password here
    Alert.alert('Success', 'Password changed successfully.');
    router.push('/profile');
  };

  return (
    <View className="flex-1 bg-red-600 pt-12 px-4">
      <Text className="text-white text-2xl font-bold font-serif tracking-widest mb-6 self-center">Change Password</Text>
      <View className="bg-white/90 rounded-xl p-6 mb-8 w-full max-w-md items-center">
        <TextInput
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          placeholder="Current Password"
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          className="bg-black px-8 py-3 rounded-lg shadow-lg items-center mb-4"
          onPress={handleChangePassword}
        >
          <Text className="text-white text-lg font-semibold">Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-black px-8 py-3 rounded-lg shadow-lg items-center mb-4"
          onPress={() => router.push('/profile')}
        >
          <Text className="text-white text-lg font-semibold">Back to Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 