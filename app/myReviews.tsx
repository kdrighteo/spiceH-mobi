import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchProducts } from '../lib/productsApi';
import { getReviewsForProduct, deleteReviewFromAppwrite } from '../lib/reviewsApi';
import { account } from '../lib/appwrite';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';
import { Product } from '../lib/types';

export default function MyReviewsScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const user = await account.get();
      setUserId(user.$id);
      const prodData = await fetchProducts();
      setProducts((prodData as unknown as Product[]).filter(p => p.$id && p.name && p.description && p.price && p.image));
      // Fetch all reviews for all products, then filter by userId
      let allReviews: any[] = [];
      for (const product of prodData) {
        const productReviews = await getReviewsForProduct(product.$id);
        allReviews = allReviews.concat(productReviews);
      }
      setReviews(allReviews.filter(r => r.userId === user.$id));
      setLoading(false);
    })();
  }, []);

  const handleDelete = (review: any) => {
    Alert.alert('Delete Review', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteReviewFromAppwrite(review.$id);
        setReviews(reviews.filter(r => r.$id !== review.$id));
      } },
    ]);
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sort === 'newest') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sort === 'highest') return b.rating - a.rating;
    if (sort === 'lowest') return a.rating - b.rating;
    return 0;
  });

  const getProduct = (productId: string) => products.find(p => p.$id === productId);

  const renderHeader = () => (
    <View className="pt-12 px-4">
      <View className="flex-row items-center mb-6 justify-center">
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">📝</Text>
        <Text className="text-3xl font-extrabold text-red-700 tracking-widest">My Reviews</Text>
      </View>
      <View className="flex-row justify-center mb-4">
        {['newest', 'oldest', 'highest', 'lowest'].map(option => (
          <TouchableOpacity
            key={option}
            className={`px-4 py-2 rounded-full mx-1 ${sort === option ? 'bg-red-600' : 'bg-white/90'}`}
            onPress={() => setSort(option as any)}
          >
            <Text className={sort === option ? 'text-white font-semibold' : 'text-gray-800 font-semibold'}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View className="items-center justify-center mt-20 mb-20 px-6">
      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2278/2278992.png' }} className="w-36 h-36 mb-6 opacity-90" />
      <Text className="text-2xl font-bold text-gray-700 mb-2 text-center">No reviews yet!</Text>
      <Text className="text-gray-500 text-base mb-4 text-center">You haven't written any reviews yet. Try reviewing a product!</Text>
      <TouchableOpacity className="bg-red-600 px-8 py-3 rounded-full shadow-lg" onPress={() => router.push('/products')}>
        <Text className="text-white text-lg font-semibold">Browse Products</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => {
    const product = getProduct(item.productId);
    return (
      <View className="bg-white/90 rounded-2xl p-4 mb-4 mx-4 shadow">
        <View className="flex-row items-center mb-2">
          <Image source={{ uri: product?.image }} className="w-16 h-16 rounded-xl mr-4" />
          <View className="flex-1">
            <Text className="font-semibold text-gray-800 mb-1">{product?.name ?? 'Unknown Product'}</Text>
            <Text className="text-yellow-500 text-base">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
            <Text className="text-gray-600 text-xs">{new Date(item.date).toLocaleDateString()}</Text>
          </View>
          <TouchableOpacity onPress={() => handleDelete(item)} className="ml-4 bg-red-100 px-3 py-1 rounded-full">
            <Text className="text-red-600 font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-800 text-base mt-2">{item.text}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#e3342f" />
        </View>
      ) : (
        <FlatList
          data={sortedReviews}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
      {/* Floating Action Buttons */}
      <ProfileButton />
      <OrdersButton />
      <FavoritesButton />
      <CartButton />
    </View>
  );
} 