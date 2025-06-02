import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './cartContext';

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  promoCode?: string;
  discount?: number;
  status?: 'pending' | 'completed' | 'cancelled';
};

const ORDERS_KEY = 'spicehaven_orders';

export async function addOrder(items: CartItem[], total: number, promoCode?: string, discount?: number) {
  const data = await AsyncStorage.getItem(ORDERS_KEY);
  const all: Order[] = data ? JSON.parse(data) : [];
  const order: Order = {
    id: Date.now().toString(),
    items,
    total,
    date: new Date().toISOString(),
    promoCode,
    discount,
    status: 'pending',
  };
  all.unshift(order);
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(all));
}

export async function getOrders(): Promise<Order[]> {
  const data = await AsyncStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  const orders = await getOrders();
  return orders.find(o => o.id === id);
}

export async function updateOrderStatus(id: string, status: 'pending' | 'completed' | 'cancelled') {
  const orders = await getOrders();
  const idx = orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    orders[idx].status = status;
    await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
} 