import { TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../lib/favoritesContext';

export default function FavoritesButton() {
  const router = useRouter();
  const { favorites } = useFavorites();
  const count = favorites.length;

  return (
    <TouchableOpacity
      className="absolute bottom-28 right-8 bg-white rounded-full w-14 h-14 justify-center items-center shadow-lg z-50 border border-gray-300"
      onPress={() => router.push('/favorites')}
      activeOpacity={0.8}
    >
      <Text className="text-red-500 text-2xl">❤️</Text>
      {count > 0 && (
        <View className="absolute top-2 right-2 bg-red-500 rounded-full w-6 h-6 justify-center items-center border-2 border-white">
          <Text className="text-white text-xs font-bold">{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
} 