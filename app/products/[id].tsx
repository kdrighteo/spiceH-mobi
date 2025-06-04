import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, TouchableOpacity, TextInput, FlatList, Modal, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { fetchProductById } from '../../lib/productsApi';
import { useCart } from '../../lib/cartContext';
import CartButton from '../components/CartButton';
import { useFavorites } from '../../lib/favoritesContext';
import FavoritesButton from '../components/FavoritesButton';
import { getReviewsForProduct, addReviewToAppwrite } from '../../lib/reviewsApi';
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
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'usage' | 'conditions' | 'expiration' | 'reviews'>('usage');
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [zoomVisible, setZoomVisible] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        setLoading(true);
        const prod = await fetchProductById(id as string);
        setProduct(prod);
        setLoading(false);
        if (prod) {
          const productReviews = await getReviewsForProduct(prod.$id);
          setReviews(productReviews);
        }
      })();
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100 items-center justify-center">
        <ActivityIndicator size="large" color="#e3342f" />
        <Text className="text-gray-500 text-lg mt-4">Loading...</Text>
      </View>
    );
  }

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
    await addReviewToAppwrite(product.$id, reviewRating, reviewText);
    const updatedReviews = await getReviewsForProduct(product.$id);
    setReviews(updatedReviews);
    setReviewText('');
    setReviewRating(5);
    setSubmitting(false);
  };

  // Support multiple images if available, fallback to single image
  const images: string[] = (Array.isArray((product as any).images) && (product as any).images.length > 0)
    ? (product as any).images
    : [product.image];
  const screenWidth = Dimensions.get('window').width;

  const renderImageCarousel = () => (
    <View className="items-center mb-4">
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setCarouselIndex(index);
        }}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setZoomVisible(true)} activeOpacity={0.9}>
            <Image source={{ uri: item }} className="w-full h-56 rounded-2xl shadow-lg mb-2" resizeMode="cover" style={{ width: screenWidth - 32 }} />
          </TouchableOpacity>
        )}
        keyExtractor={(_: string, i: number) => i.toString()}
        style={{ width: screenWidth }}
      />
      {/* Pagination dots */}
      <View className="flex-row justify-center mt-2">
        {images.map((_: string, i: number) => (
          <View key={i} className={`w-3 h-3 rounded-full mx-1 ${carouselIndex === i ? 'bg-red-600' : 'bg-gray-300'}`} />
        ))}
      </View>
      {/* Zoom Modal */}
      <Modal visible={zoomVisible} transparent animationType="fade" onRequestClose={() => setZoomVisible(false)}>
        <View className="flex-1 bg-black/90 justify-center items-center">
          <ScrollView
            minimumZoomScale={1}
            maximumZoomScale={3}
            contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            centerContent
          >
            <Image source={{ uri: images[carouselIndex] }} style={{ width: screenWidth, height: 400, resizeMode: 'contain' }} />
          </ScrollView>
          <TouchableOpacity className="absolute top-12 right-6 bg-white/80 rounded-full p-2" onPress={() => setZoomVisible(false)}>
            <Text className="text-red-700 text-2xl">×</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );

  // Calculate average rating and review count from reviews array
  const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const reviewCount = reviews.length;

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
        ListEmptyComponent={
          <View className="items-center justify-center py-8 px-4">
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2278/2278992.png' }} className="w-24 h-24 mb-4 opacity-80" />
            <Text className="text-lg font-bold text-gray-700 mb-2 text-center">No reviews yet!</Text>
            <Text className="text-gray-500 text-base mb-2 text-center">Be the first to review this product and help others decide.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white/90 rounded-xl p-4 mb-3 flex-row items-start shadow">
            <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center mr-3 mt-1">
              <Text className="text-red-700 font-bold text-lg">A</Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                <Text className="font-semibold text-gray-800 mr-2">Anonymous</Text>
                <Text className="text-yellow-500 text-base">{'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}</Text>
              </View>
              <Text className="text-gray-600 mb-1 text-xs">{new Date(item.date).toLocaleDateString()}</Text>
              <Text className="text-gray-800 text-base">{item.text}</Text>
            </View>
          </View>
        )}
        style={{ maxHeight: 180 }}
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
          className="bg-red-600 px-4 py-2 rounded-full items-center"
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
      {/* Product Image Carousel */}
      {renderImageCarousel()}
      {/* Product Info */}
      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-3xl font-extrabold text-red-700 font-serif tracking-widest flex-1">{product.name}</Text>
          <TouchableOpacity
            onPress={() => isFavorite(product.$id) ? removeFavorite(product.$id) : addFavorite(product.$id)}
            activeOpacity={0.7}
            className="ml-4"
            accessibilityLabel={isFavorite(product.$id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Text className="text-3xl">{isFavorite(product.$id) ? '❤️' : '🤍'}</Text>
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