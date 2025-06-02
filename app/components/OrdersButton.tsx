import { TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function OrdersButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="absolute bottom-44 right-8 bg-white rounded-full w-14 h-14 justify-center items-center shadow-lg z-50 border border-gray-300"
      onPress={() => router.push('/orders')}
      activeOpacity={0.8}
    >
      <Text className="text-blue-600 text-2xl">📦</Text>
    </TouchableOpacity>
  );
} 