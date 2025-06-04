import { databases, account } from './appwrite';
import { Query } from 'appwrite';

const DATABASE_ID = '6840234600335c532636';
const ORDERS_COLLECTION_ID = 'orders';

export async function createOrder(orderData: any) {
  try {
    const user = await account.get();
    const userId = user.$id;
    const payload = { ...orderData, userId };
    console.log('Creating order with payload:', payload);
    return await databases.createDocument(DATABASE_ID, ORDERS_COLLECTION_ID, 'unique()', payload);
  } catch (error) {
    console.error('Error creating order in Appwrite:', error);
    throw error;
  }
}

export async function fetchOrders(userId: string) {
  const response = await databases.listDocuments(DATABASE_ID, ORDERS_COLLECTION_ID, [
    Query.equal('userId', userId)
  ]);
  return response.documents;
} 