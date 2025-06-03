import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/authContext';

const { width } = Dimensions.get('window');

const images = [
  { id: 1, uri: 'https://via.placeholder.com/300x200?text=Product+1' },
  { id: 2, uri: 'https://via.placeholder.com/300x200?text=Product+2' },
  { id: 3, uri: 'https://via.placeholder.com/300x200?text=Product+3' },
];

export default function LandingScreen() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setActiveIndex(index);
  };

  return (
    <ScrollView className="flex-1 bg-red-600">
      <View className="pt-12 px-4">
        <Text className="text-white text-4xl font-bold font-serif tracking-widest mb-2">SPICE HAVEN</Text>
        <Text className="text-white text-lg mb-8">Your Ultimate Spice Destination</Text>

        <View className="bg-white/90 rounded-xl p-6 mb-8">
          <Text className="text-black text-xl font-semibold mb-4">Welcome to Spice Haven</Text>
          <Text className="text-black text-base mb-4">
            Discover a world of exotic spices, premium quality, and authentic flavors. From rare finds to everyday essentials, we bring the best spices from around the globe to your kitchen.
          </Text>
          <TouchableOpacity
            className="bg-black px-8 py-3 rounded-lg shadow-lg items-center"
            onPress={() => router.push('/products')}
          >
            <Text className="text-white text-lg font-semibold">Shop</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-8">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ref={scrollViewRef}
          >
            {images.map((image) => (
              <Image
                key={image.id}
                source={{ uri: image.uri }}
                className="w-[300px] h-[200px] rounded-lg"
              />
            ))}
          </ScrollView>
          <View className="flex-row justify-center mt-2">
            {images.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${
                  activeIndex === index ? 'bg-black' : 'bg-gray-400'
                }`}
              />
            ))}
          </View>
        </View>

        <View className="flex-row justify-between mb-8">
          {currentUser ? (
            <TouchableOpacity
              className="bg-black px-6 py-3 rounded-lg shadow-lg items-center flex-1 ml-2"
              onPress={() => router.push('/profile')}
            >
              <Text className="text-white text-lg font-semibold">Profile</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                className="bg-black px-6 py-3 rounded-lg shadow-lg items-center flex-1 ml-2"
                onPress={() => router.push('/SignUp')}
              >
                <Text className="text-white text-lg font-semibold">Sign Up</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-black px-6 py-3 rounded-lg shadow-lg items-center flex-1 ml-2"
                onPress={() => router.push('/Login')}
              >
                <Text className="text-white text-lg font-semibold">Log In</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View className="bg-white/90 rounded-xl p-6 mb-8">
          <Text className="text-black text-xl font-semibold mb-4">Why Choose Us?</Text>
          <View className="space-y-4">
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">🌟</Text>
              <Text className="text-black text-base flex-1">Premium Quality Spices</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">🌍</Text>
              <Text className="text-black text-base flex-1">Global Selection</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">🚚</Text>
              <Text className="text-black text-base flex-1">Fast Delivery</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="text-2xl mr-2">💯</Text>
              <Text className="text-black text-base flex-1">100% Satisfaction Guaranteed</Text>
            </View>
          </View>
        </View>

        <View className="bg-white/90 rounded-xl p-6 mb-8">
          <Text className="text-black text-xl font-semibold mb-4">Featured Categories</Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity className="bg-gray-100 rounded-lg p-4 mb-4 w-[48%] items-center">
              <Text className="text-black text-lg font-semibold">Hot Spices</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-lg p-4 mb-4 w-[48%] items-center">
              <Text className="text-black text-lg font-semibold">Sweet Spices</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-lg p-4 mb-4 w-[48%] items-center">
              <Text className="text-black text-lg font-semibold">Aromatic Spices</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-gray-100 rounded-lg p-4 mb-4 w-[48%] items-center">
              <Text className="text-black text-lg font-semibold">Exotic Spices</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-white/90 rounded-xl p-6 mb-8">
          <Text className="text-black text-xl font-semibold mb-4">Customer Reviews</Text>
          <View className="space-y-4">
            <View className="bg-gray-100 rounded-lg p-4">
              <Text className="text-black text-base font-semibold">John D.</Text>
              <Text className="text-black text-sm">"Best quality spices I've ever used!"</Text>
            </View>
            <View className="bg-gray-100 rounded-lg p-4">
              <Text className="text-black text-base font-semibold">Sarah M.</Text>
              <Text className="text-black text-sm">"Amazing selection and fast delivery."</Text>
            </View>
          </View>
        </View>

        <View className="bg-white/90 rounded-xl p-6 mb-8">
          <Text className="text-black text-xl font-semibold mb-4">Contact Us</Text>
          <Text className="text-black text-base mb-2">Email: info@spicehaven.com</Text>
          <Text className="text-black text-base mb-2">Phone: +1 (555) 123-4567</Text>
          <Text className="text-black text-base">Address: 123 Spice Street, Flavor City, FC 12345</Text>
        </View>
      </View>
    </ScrollView>
  );
} 