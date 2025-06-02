import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { products } from '../../lib/products';
import { useState, useEffect } from 'react';
import { useCart } from '../../lib/cartContext';
import CartButton from '../components/CartButton';
import { useFavorites } from '../../lib/favoritesContext';
import FavoritesButton from '../components/FavoritesButton';
import { getReviews, addReview, getAverageRating, Review } from '../../lib/reviews';

const TABS = [
  { key: 'usage', label: 'Usage' },
  { key: 'conditions', label: 'Conditions' },
  { key: 'expiration', label: 'Expiration' },
  { key: 'reviews', label: 'Reviews' },
];

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const product = products.find(p => p.id === id);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [selectedTab, setSelectedTab] = useState<'usage' | 'conditions' | 'expiration' | 'reviews'>('usage');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!product) return;
    getReviews(product.id).then(setReviews);
    getAverageRating(product.id).then(({ avg, count }) => {
      setAvgRating(avg);
      setReviewCount(count);
    });
  }, [product, submitting]);

  if (!product) return (
    <View className="flex-1 justify-center items-center bg-red-600">
      <Text className="text-white text-xl">Product not found</Text>
    </View>
  );

  const handleAddToCart = () => {
    addToCart({ ...product, qty });
    router.push('/cart');
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    setSubmitting(true);
    await addReview(product.id, reviewRating, reviewText.trim());
    setReviewText('');
    setReviewRating(5);
    setSubmitting(false);
  };

  const tabContent = {
    usage: <Text className="text-gray-800 text-base">{product.usage}</Text>,
    conditions: <Text className="text-gray-800 text-base">{product.conditions}</Text>,
    expiration: <Text className="text-gray-800 text-base">{product.expiration}</Text>,
    reviews: (
      <View>
        <View className="flex-row items-center mb-2">
          <Text className="text-lg font-bold mr-2">Reviews</Text>
          <Text className="text-yellow-500 text-lg">{'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}</Text>
          <Text className="ml-2 text-gray-700">({reviewCount})</Text>
        </View>
        <FlatList
          data={reviews}
          keyExtractor={(_, i) => i.toString()}
          ListEmptyComponent={<Text className="text-gray-500 mb-2">No reviews yet. Be the first to review!</Text>}
          renderItem={({ item }) => (
            <View className="mb-2 p-2 bg-gray-100 rounded-lg">
              <View className="flex-row items-center mb-1">
                <Text className="text-yellow-500 mr-2">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
                <Text className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</Text>
              </View>
              <Text className="text-gray-800 text-sm">{item.text}</Text>
            </View>
          )}
          style={{ maxHeight: 120 }}
        />
        <View className="mt-2">
          <Text className="font-semibold mb-1">Leave a review:</Text>
          <View className="flex-row items-center mb-2">
            {[1,2,3,4,5].map(n => (
              <TouchableOpacity key={n} onPress={() => setReviewRating(n)}>
                <Text className={n <= reviewRating ? 'text-yellow-500 text-2xl' : 'text-gray-300 text-2xl'}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            className="bg-white rounded-lg px-3 py-2 mb-2 border border-gray-200"
            placeholder="Write your review..."
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={2}
            editable={!submitting}
          />
          <TouchableOpacity
            className="bg-black px-4 py-2 rounded-lg items-center"
            onPress={handleSubmitReview}
            disabled={submitting || !reviewText.trim()}
          >
            <Text className="text-white font-semibold">{submitting ? 'Submitting...' : 'Submit Review'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    ),
  };

  return (
    <View className="flex-1 bg-red-600 pt-12 px-4">
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-lg">← Back</Text>
        </TouchableOpacity>
      </View>
      <Image source={{ uri: product.image }} className="w-full h-48 rounded-xl mb-4" />
      <Text className="text-white text-3xl font-bold mb-2 font-serif tracking-widest">{product.name}</Text>
      <Text className="text-white mb-1 text-base">{product.description}</Text>
      <Text className="text-white mb-1 text-base font-semibold">Origin: <Text className="font-normal">{product.origin}</Text></Text>
      <Text className="text-red-200 text-2xl font-bold mb-2">${product.price}</Text>
      <View className="flex-row items-center mb-6">
        <View className="flex-row items-center flex-1">
          <TouchableOpacity onPress={() => setQty(q => Math.max(1, q-1))} className="bg-white px-3 py-1 rounded-full mr-2"><Text className="text-lg">-</Text></TouchableOpacity>
          <Text className="text-white text-lg mx-2">{qty}</Text>
          <TouchableOpacity onPress={() => setQty(q => q+1)} className="bg-white px-3 py-1 rounded-full ml-2"><Text className="text-lg">+</Text></TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => isFavorite(product.id) ? removeFavorite(product.id) : addFavorite(product.id)}
          activeOpacity={0.7}
          className="ml-4"
        >
          <Text className="text-2xl">{isFavorite(product.id) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="bg-black px-8 py-3 rounded-lg shadow-lg items-center mb-4" onPress={handleAddToCart}>
        <Text className="text-white text-lg font-semibold">Add to Cart</Text>
      </TouchableOpacity>
      {/* Tabs */}
      <View className="flex-row justify-center mb-2 bg-white/80 rounded-xl p-1">
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setSelectedTab(tab.key as 'usage' | 'conditions' | 'expiration' | 'reviews')}
            className={`flex-1 py-2 mx-1 rounded-lg ${selectedTab === tab.key ? 'bg-black' : 'bg-transparent'}`}
          >
            <Text className={`text-center text-sm font-semibold ${selectedTab === tab.key ? 'text-white' : 'text-black'}`}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="bg-white/90 rounded-xl p-4 mb-4 min-h-[80px]">
        {tabContent[selectedTab]}
      </View>
      <FavoritesButton />
      <CartButton />
    </View>
  );
} 