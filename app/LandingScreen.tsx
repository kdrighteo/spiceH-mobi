import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function LandingScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-red-600 justify-center items-center">
      <Text className="text-7xl mb-8">🍳</Text>
      <Text className="text-white text-4xl font-bold mb-8 font-serif tracking-widest">Spice-Haven</Text>
      <TouchableOpacity
        className="bg-black px-8 py-3 rounded-lg shadow-lg mb-4"
        onPress={() => router.replace('/products')}
      >
        <Text className="text-white text-lg font-semibold">Shop</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-white px-8 py-3 rounded-lg shadow-lg mb-2"
        onPress={() => router.push('/SignUp')}
      >
        <Text className="text-black text-lg font-semibold">Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-white px-8 py-3 rounded-lg shadow-lg"
        onPress={() => router.push('/Login')}
      >
        <Text className="text-black text-lg font-semibold">Log In</Text>
      </TouchableOpacity>
    </View>
  );
} 