import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { products } from '../lib/products';
import { useFavorites } from '../lib/favoritesContext';
import CartButton from './components/CartButton';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, removeFavorite, isFavorite } = useFavorites();
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <View className="flex-1 bg-red-600 pt-12 px-4">
      <Text className="text-white text-2xl font-bold font-serif tracking-widest mb-6 self-center">Favorites</Text>
      <FlatList
        data={favoriteProducts}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text className="text-white text-center mt-8">No favorites yet.</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row items-center bg-white rounded-xl p-4 mb-4 shadow"
            onPress={() => router.push(`/products/${item.id}`)}
            activeOpacity={0.8}
          >
            <Image source={{ uri: item.image }} className="w-16 h-16 rounded-lg mr-4" />
            <View className="flex-1">
              <Text className="text-lg font-bold mb-1">{item.name}</Text>
              <Text className="text-red-500 font-bold">${item.price}</Text>
            </View>
            <TouchableOpacity
              onPress={e => {
                e.stopPropagation();
                removeFavorite(item.id);
              }}
              className="ml-2"
              activeOpacity={0.7}
            >
              <Text className="text-2xl">❤️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
      <CartButton />
    </View>
  );
} 