import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './cartContext';

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
};

const ORDERS_KEY = 'spicehaven_orders';

export async function addOrder(items: CartItem[], total: number) {
  const data = await AsyncStorage.getItem(ORDERS_KEY);
  const all: Order[] = data ? JSON.parse(data) : [];
  const order: Order = {
    id: Date.now().toString(),
    items,
    total,
    date: new Date().toISOString(),
  };
  all.unshift(order);
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(all));
}

export async function getOrders(): Promise<Order[]> {
  const data = await AsyncStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
} 