import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: 'welcome',
    title: 'Welcome to Spice Haven!',
    description: 'Discover, shop, and enjoy the world\'s best spices delivered to your door.',
    image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png',
  },
  {
    key: 'shop',
    title: 'Shop Premium Spices',
    description: 'Browse our curated selection of hot, sweet, aromatic, and exotic spices.',
    image: 'https://cdn-icons-png.flaticon.com/512/2278/2278992.png',
  },
  {
    key: 'fast',
    title: 'Fast Delivery',
    description: 'Get your spices delivered quickly and track your orders in real time.',
    image: 'https://cdn-icons-png.flaticon.com/512/484/484167.png',
  },
  {
    key: 'join',
    title: 'Join Our Community',
    description: 'Sign up to save favorites, write reviews, and enjoy exclusive offers!',
    image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const handleNext = async () => {
    if (activeIndex < slides.length - 1) {
      setActiveIndex(activeIndex + 1);
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      router.replace('/LandingScreen');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('onboardingComplete', 'true');
    router.replace('/LandingScreen');
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100">
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
          <View className="flex-1 items-center justify-center px-8" style={{ width }}>
            <Image source={{ uri: item.image }} className="w-40 h-40 mb-8" />
            <Text className="text-3xl font-extrabold text-red-700 mb-4 text-center">{item.title}</Text>
            <Text className="text-lg text-gray-700 mb-8 text-center">{item.description}</Text>
          </View>
        )}
        onMomentumScrollEnd={e => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        style={{ flexGrow: 0 }}
      />
      <View className="flex-row justify-center mb-6">
        {slides.map((_, idx) => (
          <View
            key={idx}
            className={`w-3 h-3 rounded-full mx-1 ${activeIndex === idx ? 'bg-red-600' : 'bg-gray-300'}`}
          />
        ))}
      </View>
      <View className="flex-row justify-between px-8 mb-12">
        {activeIndex < slides.length - 1 ? (
          <TouchableOpacity onPress={handleSkip} className="px-6 py-3 rounded-full bg-gray-200">
            <Text className="text-gray-800 font-semibold">Skip</Text>
          </TouchableOpacity>
        ) : <View style={{ width: 80 }} />}
        <TouchableOpacity
          onPress={handleNext}
          className="px-8 py-3 rounded-full bg-red-600 shadow-lg"
        >
          <Text className="text-white text-lg font-semibold">
            {activeIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 