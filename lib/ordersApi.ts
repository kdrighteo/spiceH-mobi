import { databases } from './appwrite';

const DATABASE_ID = '6840234600335c532636';
const ORDERS_COLLECTION_ID = 'orders';

export async function createOrder(orderData: any) {
  return await databases.createDocument(DATABASE_ID, ORDERS_COLLECTION_ID, 'unique()', orderData);
}

export async function fetchOrders(userId: string) {
  const response = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
    // You can filter by userId if needed
    // Query.equal('userId', userId)
  ]);
  return response.documents;
} 