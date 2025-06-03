import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/authContext';

export default function Profile() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    Alert.alert('Logged Out', 'You have been logged out.');
    router.replace('/Login');
  };

  return (
    <View className="flex-1 bg-red-600 pt-12 px-4">
      <Text className="text-white text-2xl font-bold font-serif tracking-widest mb-6 self-center">Profile</Text>
      <View className="bg-white/90 rounded-xl p-6 mb-8 w-full max-w-md items-center">
        <Text className="text-black text-lg font-semibold mb-2">Customer Name:</Text>
        <Text className="text-black text-base mb-4">N/A</Text>
        <Text className="text-black text-lg font-semibold mb-2">Email:</Text>
        <Text className="text-black text-base mb-4">{currentUser?.email}</Text>
      </View>
      <TouchableOpacity
        className="bg-black px-8 py-3 rounded-lg shadow-lg items-center mb-4"
        onPress={() => router.push('/orders')}
      >
        <Text className="text-white text-lg font-semibold">Order History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-black px-8 py-3 rounded-lg shadow-lg items-center mb-4"
        onPress={() => router.push('/favorites')}
      >
        <Text className="text-white text-lg font-semibold">Favorites</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-black px-8 py-3 rounded-lg shadow-lg items-center mb-4"
        onPress={() => router.push('/settings')}
      >
        <Text className="text-white text-lg font-semibold">Change Password</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-black px-8 py-3 rounded-lg shadow-lg items-center mb-4"
        onPress={handleLogout}
      >
        <Text className="text-white text-lg font-semibold">Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-black px-8 py-3 rounded-lg shadow-lg items-center mb-4"
        onPress={() => router.push('/products')}
      >
        <Text className="text-white text-lg font-semibold">Back to Products</Text>
      </TouchableOpacity>
    </View>
  );
} 