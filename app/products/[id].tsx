import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { products } from '../../lib/products';
import { useState, useEffect } from 'react';
import { useCart } from '../../lib/cartContext';
import CartButton from '../components/CartButton';
import { useFavorites } from '../../lib/favoritesContext';
import FavoritesButton from '../components/FavoritesButton';
import { getReviews, addReview, getAverageRating, Review } from '../../lib/reviews';
import OrdersButton from '../components/OrdersButton';
import ProfileButton from '../components/ProfileButton';
import ReviewItem from '../components/ReviewItem';

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
  const [selectedTab, setSelectedTab] = useState<'usage' | 'conditions' | 'expiration' | 'reviews'>('usage');
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (product) {
      const productReviews = getReviews(product.id);
      setReviews(productReviews);
      setAvgRating(getAverageRating(productReviews));
      setReviewCount(productReviews.length);
    }
  }, [product]);

  if (!product) {
    return (
      <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100 items-center justify-center">
        <Text className="text-gray-500 text-lg">Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, qty);
    router.push('/cart');
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    setSubmitting(true);
    await addReview(product.id, reviewRating, reviewText);
    const updatedReviews = getReviews(product.id);
    setReviews(updatedReviews);
    setAvgRating(getAverageRating(updatedReviews));
    setReviewCount(updatedReviews.length);
    setReviewText('');
    setReviewRating(5);
    setSubmitting(false);
  };

  const renderReviews = () => (
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
          <ReviewItem
            review={{
              id: item.productId + item.date,
              reviewer: 'Anonymous',
              rating: item.rating,
              text: item.text,
              date: item.date,
            }}
          />
        )}
        style={{ maxHeight: 160 }}
      />
      <View className="mt-4">
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
          accessibilityLabel="Write your review"
        />
        <TouchableOpacity
          className="bg-red-600 px-4 py-2 rounded-lg items-center"
          onPress={handleSubmitReview}
          disabled={submitting || !reviewText.trim()}
        >
          <Text className="text-white font-semibold">{submitting ? 'Submitting...' : 'Submit Review'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = () => (
    <View className="pt-12 px-4">
      {/* Back Button */}
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Go back">
          <Text className="text-red-700 text-lg">← Back</Text>
        </TouchableOpacity>
      </View>
      {/* Product Image */}
      <View className="items-center mb-4">
        <Image source={{ uri: product.image }} className="w-full h-56 rounded-2xl shadow-lg mb-2" resizeMode="cover" />
      </View>
      {/* Product Info */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-3xl font-extrabold text-red-700 font-serif tracking-widest flex-1">{product.name}</Text>
          <TouchableOpacity
            onPress={() => isFavorite(product.id) ? removeFavorite(product.id) : addFavorite(product.id)}
            activeOpacity={0.7}
            className="ml-4"
            accessibilityLabel={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Text className="text-3xl">{isFavorite(product.id) ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-red-500 text-2xl font-bold mb-1">${product.price}</Text>
        <Text className="text-gray-700 mb-1 text-base font-semibold">Origin: <Text className="font-normal">{product.origin}</Text></Text>
        <Text className="text-gray-600 mb-2 text-base">{product.description}</Text>
      </View>
      {/* Quantity Selector & Add to Cart */}
      <View className="flex-row items-center mb-6">
        <View className="flex-row items-center flex-1 bg-white rounded-full shadow px-2 py-1">
          <TouchableOpacity onPress={() => setQty(q => Math.max(1, q-1))} className="bg-gray-200 px-3 py-1 rounded-full mr-2" accessibilityLabel="Decrease quantity"><Text className="text-lg">-</Text></TouchableOpacity>
          <Text className="text-gray-800 text-lg mx-2 font-semibold">{qty}</Text>
          <TouchableOpacity onPress={() => setQty(q => q+1)} className="bg-gray-200 px-3 py-1 rounded-full ml-2" accessibilityLabel="Increase quantity"><Text className="text-lg">+</Text></TouchableOpacity>
        </View>
        <TouchableOpacity
          className="bg-red-600 px-8 py-3 rounded-full shadow-lg items-center ml-4"
          onPress={handleAddToCart}
          accessibilityLabel="Add to cart"
        >
          <Text className="text-white text-lg font-semibold">Add to Cart</Text>
        </TouchableOpacity>
      </View>
      {/* Tabs */}
      <View className="flex-row justify-center mb-2 bg-white/80 rounded-xl p-1">
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setSelectedTab(tab.key as 'usage' | 'conditions' | 'expiration' | 'reviews')}
            className={`flex-1 py-2 mx-1 rounded-lg ${selectedTab === tab.key ? 'bg-red-600' : 'bg-transparent'}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: selectedTab === tab.key }}
          >
            <Text className={`text-center text-sm font-semibold ${selectedTab === tab.key ? 'text-white' : 'text-black'}`}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="bg-white/90 rounded-xl p-4 mb-4 min-h-[80px]">
        {selectedTab === 'reviews' ? renderReviews() : (
          <Text className="text-gray-800 text-base leading-relaxed">
            {selectedTab === 'usage' ? product.usage :
             selectedTab === 'conditions' ? product.conditions :
             product.expiration}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={renderContent}
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