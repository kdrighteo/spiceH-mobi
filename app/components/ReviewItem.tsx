import React from 'react';
import { View, Text } from 'react-native';

interface Review {
  id: string;
  reviewer: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewItemProps {
  review: Review;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ReviewItem({ review }: ReviewItemProps) {
  return (
    <View className="bg-gray-100 rounded-lg p-4 mb-2">
      <View className="flex-row justify-between mb-1">
        <Text className="font-semibold">{review.reviewer}</Text>
        <Text className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</Text>
      </View>
      <Text className="text-gray-700 mb-1">{review.text}</Text>
      <Text className="text-gray-400 text-xs">{formatDate(review.date)}</Text>
    </View>
  );
} 