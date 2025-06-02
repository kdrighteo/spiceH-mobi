import AsyncStorage from '@react-native-async-storage/async-storage';

export type Review = {
  productId: string;
  rating: number;
  text: string;
  date: string;
};

const REVIEWS_KEY = 'spicehaven_reviews';

export async function getReviews(productId: string): Promise<Review[]> {
  const data = await AsyncStorage.getItem(REVIEWS_KEY);
  if (!data) return [];
  const all: Review[] = JSON.parse(data);
  return all.filter(r => r.productId === productId);
}

export async function addReview(productId: string, rating: number, text: string) {
  const data = await AsyncStorage.getItem(REVIEWS_KEY);
  const all: Review[] = data ? JSON.parse(data) : [];
  all.push({ productId, rating, text, date: new Date().toISOString() });
  await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
}

export async function getAverageRating(productId: string): Promise<{ avg: number, count: number }> {
  const reviews = await getReviews(productId);
  if (reviews.length === 0) return { avg: 0, count: 0 };
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { avg, count: reviews.length };
} 