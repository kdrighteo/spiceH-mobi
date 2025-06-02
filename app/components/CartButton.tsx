import { TouchableOpacity, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useCart } from '../../lib/cartContext';

export default function CartButton() {
  const router = useRouter();
  const { cart } = useCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <TouchableOpacity
      className="absolute bottom-8 right-8 bg-black rounded-full w-14 h-14 justify-center items-center shadow-lg z-50"
      onPress={() => router.push('/cart')}
      activeOpacity={0.8}
    >
      <Text className="text-white text-2xl">🛒</Text>
      {count > 0 && (
        <View className="absolute top-2 right-2 bg-red-500 rounded-full w-6 h-6 justify-center items-center border-2 border-white">
          <Text className="text-white text-xs font-bold">{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
} 