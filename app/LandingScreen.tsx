import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/authContext';

const { width } = Dimensions.get('window');

const images = [
  { id: 1, uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80', label: 'Bay Leaves' },
  { id: 2, uri: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=600&q=80', label: 'Saffron' },
  { id: 3, uri: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80', label: 'Cinnamon' },
];

const categories = [
  { key: 'hot', label: 'Hot Spices', icon: '🌶️' },
  { key: 'sweet', label: 'Sweet Spices', icon: '🍬' },
  { key: 'aromatic', label: 'Aromatic Spices', icon: '🌺' },
  { key: 'exotic', label: 'Exotic Spices', icon: '🧭' },
];

const reviews = [
  { id: 1, name: 'John D.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', quote: 'Best quality spices I\'ve ever used!' },
  { id: 2, name: 'Sarah M.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', quote: 'Amazing selection and fast delivery.' },
  { id: 3, name: 'Carlos R.', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', quote: 'The flavors are so fresh and authentic.' },
];

export default function LandingScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  const renderHero = () => (
    <View className="pt-16 px-6 pb-8 items-center">
      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }} className="w-24 h-24 mb-4" />
      <Text className="text-4xl font-extrabold text-red-700 mb-2 tracking-widest text-center">SPICE HAVEN</Text>
      <Text className="text-lg text-gray-700 mb-4 text-center">Your Ultimate Spice Destination</Text>
      <TouchableOpacity
        className="bg-red-600 px-8 py-3 rounded-full shadow-lg mb-2"
        onPress={() => router.push('/products')}
      >
        <Text className="text-white text-lg font-semibold">Shop Now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCarousel = () => (
    <View className="mb-8">
      <FlatList
        ref={flatListRef}
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View className="items-center justify-center" style={{ width }}>
            <Image
              source={{ uri: item.uri }}
              className="w-[90%] h-48 rounded-2xl shadow-lg mb-2"
              resizeMode="cover"
            />
            <Text className="text-lg font-semibold text-gray-800 bg-white/80 px-4 py-1 rounded-full shadow">{item.label}</Text>
          </View>
        )}
      />
      <View className="flex-row justify-center mt-2">
        {images.map((_, index) => (
          <View
            key={index}
            className={`w-3 h-3 rounded-full mx-1 ${activeIndex === index ? 'bg-red-600' : 'bg-gray-300'}`}
          />
        ))}
      </View>
    </View>
  );

  const renderQuickAccess = () => (
    <View className="flex-row justify-center mb-8 space-x-4">
      {/* No quick access buttons for guests or logged-in users */}
    </View>
  );

  const renderWhyChooseUs = () => (
    <View className="bg-white/90 rounded-2xl p-6 mb-8 mx-4 shadow">
      <Text className="text-xl font-bold mb-4 text-red-700">Why Choose Us?</Text>
      <View className="flex-row flex-wrap justify-between">
        <View className="items-center w-1/2 mb-4">
          <Text className="text-3xl mb-2">🌟</Text>
          <Text className="text-gray-700 text-center">Premium Quality Spices</Text>
        </View>
        <View className="items-center w-1/2 mb-4">
          <Text className="text-3xl mb-2">🌍</Text>
          <Text className="text-gray-700 text-center">Global Selection</Text>
        </View>
        <View className="items-center w-1/2 mb-2">
          <Text className="text-3xl mb-2">🚚</Text>
          <Text className="text-gray-700 text-center">Fast Delivery</Text>
        </View>
        <View className="items-center w-1/2 mb-2">
          <Text className="text-3xl mb-2">💯</Text>
          <Text className="text-gray-700 text-center">100% Satisfaction Guaranteed</Text>
        </View>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View className="mb-8 mx-4">
      <Text className="text-xl font-bold mb-4 text-red-700">Featured Categories</Text>
      <View className="flex-row flex-wrap justify-between">
        {categories.map(cat => (
          <TouchableOpacity key={cat.key} className="bg-red-50 rounded-xl p-4 mb-4 w-[48%] items-center shadow">
            <Text className="text-3xl mb-2">{cat.icon}</Text>
            <Text className="text-lg font-semibold text-gray-800">{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderReviews = () => (
    <View className="bg-white/90 rounded-2xl p-6 mb-8 mx-4 shadow">
      <Text className="text-xl font-bold mb-4 text-red-700">What Our Customers Say</Text>
      <FlatList
        data={reviews}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-red-50 rounded-xl p-4 mr-4 w-64 items-center shadow">
            <Image source={{ uri: item.avatar }} className="w-14 h-14 rounded-full mb-2" />
            <Text className="font-semibold text-gray-800 mb-1">{item.name}</Text>
            <Text className="text-gray-600 italic text-center">"{item.quote}"</Text>
          </View>
        )}
      />
    </View>
  );

  const renderContact = () => (
    <View className="bg-white/90 rounded-2xl p-6 mb-12 mx-4 shadow items-center">
      <Text className="text-xl font-bold mb-4 text-red-700">Contact Us</Text>
      <View className="flex-row items-center mb-2">
        <Text className="text-2xl mr-2">✉️</Text>
        <Text className="text-gray-700">info@spicehaven.com</Text>
      </View>
      <View className="flex-row items-center mb-2">
        <Text className="text-2xl mr-2">📞</Text>
        <Text className="text-gray-700">+1 (555) 123-4567</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-2xl mr-2">📍</Text>
        <Text className="text-gray-700">123 Spice Street, Flavor City, FC 12345</Text>
      </View>
    </View>
  );

  const sections = [
    { id: 'hero', render: renderHero },
    { id: 'carousel', render: renderCarousel },
    { id: 'quickAccess', render: renderQuickAccess },
    { id: 'whyChooseUs', render: renderWhyChooseUs },
    { id: 'categories', render: renderCategories },
    { id: 'reviews', render: renderReviews },
    { id: 'contact', render: renderContact },
  ];

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <FlatList
        data={sections}
        renderItem={({ item }) => item.render()}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
} 