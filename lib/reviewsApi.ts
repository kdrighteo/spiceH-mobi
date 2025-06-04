import { databases, account } from './appwrite';
// You may need to import Query from 'appwrite' if you want to filter
import { Query } from 'appwrite';

const DATABASE_ID = '6840234600335c532636';
const REVIEWS_COLLECTION_ID = '68408886003e5a9022a7';

export async function addReviewToAppwrite(productId: string, rating: number, text: string) {
  // Get the current user
  const user = await account.get();
  const userId = user.$id;
  const date = new Date().toISOString();
  return await databases.createDocument(DATABASE_ID, REVIEWS_COLLECTION_ID, 'unique()', {
    productId, userId, rating, text, date
  });
}

export async function getReviewsForProduct(productId: string) {
  const response = await databases.listDocuments(DATABASE_ID, REVIEWS_COLLECTION_ID, [
    Query.equal('productId', productId)
  ]);
  return response.documents;
}

export async function deleteReviewFromAppwrite(reviewId: string) {
  return await databases.deleteDocument(DATABASE_ID, REVIEWS_COLLECTION_ID, reviewId);
} 