import { databases, account } from './appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = '6840234600335c532636';
const FAVORITES_COLLECTION_ID = '68408f0400133b18e408';

export async function addFavoriteToAppwrite(productId: string) {
  const user = await account.get();
  const userId = user.$id;
  return await databases.createDocument(DATABASE_ID, FAVORITES_COLLECTION_ID, 'unique()', {
    userId,
    productId,
  });
}

export async function removeFavoriteFromAppwrite(productId: string) {
  const user = await account.get();
  const userId = user.$id;
  // Find the favorite document for this user and product
  const response = await databases.listDocuments(DATABASE_ID, FAVORITES_COLLECTION_ID, [
    Query.equal('userId', userId),
    Query.equal('productId', productId)
  ]);
  if (response.documents.length > 0) {
    // Delete the first matching favorite
    return await databases.deleteDocument(DATABASE_ID, FAVORITES_COLLECTION_ID, response.documents[0].$id);
  }
}

export async function getFavoritesForUser() {
  const user = await account.get();
  const userId = user.$id;
  const response = await databases.listDocuments(DATABASE_ID, FAVORITES_COLLECTION_ID, [
    Query.equal('userId', userId)
  ]);
  // Return an array of productIds
  return response.documents.map((doc: any) => doc.productId);
} 