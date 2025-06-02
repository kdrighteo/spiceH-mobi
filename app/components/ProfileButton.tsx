import { TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileButton() {
  const router = useRouter();
  return (
    <TouchableOpacity
      className="absolute bottom-60 right-8 bg-white rounded-full w-14 h-14 justify-center items-center shadow-lg z-50 border border-gray-300"
      onPress={() => router.push('/profile')}
      activeOpacity={0.8}
    >
      <Text className="text-purple-600 text-2xl">👤</Text>
    </TouchableOpacity>
  );
} 