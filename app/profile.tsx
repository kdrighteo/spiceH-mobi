import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-red-600 pt-12 px-4">
      <Text className="text-white text-2xl font-bold font-serif tracking-widest mb-6 self-center">Profile</Text>
      <Text className="text-white text-lg mb-4">Welcome to your profile!</Text>
      <TouchableOpacity
        className="bg-black px-8 py-3 rounded-lg shadow-lg items-center mb-4"
        onPress={() => router.push('/products')}
      >
        <Text className="text-white text-lg font-semibold">Back to Products</Text>
      </TouchableOpacity>
    </View>
  );
} 