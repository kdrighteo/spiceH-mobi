import { databases } from './appwrite';

const DATABASE_ID = '6840234600335c532636';
const PRODUCTS_COLLECTION_ID = '68402fa5000690525d2a';

export async function fetchProducts() {
  try {
    const response = await databases.listDocuments(DATABASE_ID, PRODUCTS_COLLECTION_ID);
    console.log('Fetched products from Appwrite:', response.documents);
    return response.documents;
  } catch (error) {
    console.error('Error fetching products from Appwrite:', error);
    return [];
  }
}

export async function fetchProductById(id: string) {
  try {
    const response = await databases.getDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, id);
    return response;
  } catch (error) {
    console.error('Error fetching product by ID from Appwrite:', error);
    return null;
  }
} 