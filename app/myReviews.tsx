import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllReviews, deleteReview, Review } from '../lib/reviews';
import { products } from '../lib/products';
import CartButton from './components/CartButton';
import FavoritesButton from './components/FavoritesButton';
import OrdersButton from './components/OrdersButton';
import ProfileButton from './components/ProfileButton';

export default function MyReviewsScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await getAllReviews();
      setReviews(all);
      setLoading(false);
    })();
  }, []);

  const handleDelete = (review: Review) => {
    Alert.alert('Delete Review', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteReview(review.productId, review.date);
        const all = await getAllReviews();
        setReviews(all);
      } },
    ]);
  };

  const renderReview = ({ item }: { item: Review }) => {
    const product = products.find(p => p.id === item.productId);
    return (
      <View className="bg-white/90 rounded-xl p-4 mb-3 mx-4 flex-row items-start shadow">
        <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mr-3 mt-1">
          <Text className="text-red-700 font-bold text-lg">A</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Text className="font-semibold text-gray-800 mr-2">{product ? product.name : 'Product'}</Text>
            <Text className="text-yellow-500 text-base">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
          </View>
          <Text className="text-gray-600 mb-1 text-xs">{new Date(item.date).toLocaleDateString()}</Text>
          <Text className="text-gray-800 text-base mb-2">{item.text}</Text>
          <TouchableOpacity className="bg-red-600 px-4 py-2 rounded-full items-center self-start" onPress={() => handleDelete(item)}>
            <Text className="text-white font-semibold">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <View className="pt-12 px-4">
        <View className="flex-row items-center mb-6 justify-center">
          <Text className="text-3xl font-extrabold text-red-700 tracking-widest mr-2">📝</Text>
          <Text className="text-3xl font-extrabold text-red-700 tracking-widest">My Reviews</Text>
        </View>
      </View>
      <FlatList
        data={reviews}
        renderItem={renderReview}
        keyExtractor={(_, i) => i.toString()}
        ListEmptyComponent={
          <View className="items-center justify-center py-16 px-4">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2278/2278992.png' }} className="w-24 h-24 mb-4 opacity-80" />
            <Text className="text-lg font-bold text-gray-700 mb-2 text-center">You haven't written any reviews yet.</Text>
            <Text className="text-gray-500 text-base mb-2 text-center">Share your experience with our products to help others!</Text>
            <TouchableOpacity className="bg-red-600 px-8 py-3 rounded-full shadow-lg mt-2" onPress={() => router.push('/products')}>
              <Text className="text-white text-lg font-semibold">Write a Review</Text>
            </TouchableOpacity>
          </View>
        }
        refreshing={loading}
        onRefresh={async () => {
          setLoading(true);
          const all = await getAllReviews();
          setReviews(all);
          setLoading(false);
        }}
        showsVerticalScrollIndicator={false}
      />
      {/* Floating Action Buttons */}
      <ProfileButton />
      <OrdersButton />
      <FavoritesButton />
      <CartButton />
    </View>
  );
} 