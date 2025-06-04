import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem, Address, PaymentMethod } from './types';
import { Alert } from 'react-native';
import { createOrder as createOrderApi, fetchOrders as fetchOrdersApi } from './ordersApi';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'trackingNumber' | 'estimatedDelivery'>) => Promise<Order | null>;
  clearOrders: () => void;
  cancelOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // For now, fetch all orders (no user filtering)
      const fetched = await fetchOrdersApi('');
      setOrders((fetched as unknown as Order[]));
    } catch (error) {
      Alert.alert('Error', 'Failed to load orders from Appwrite.');
    }
  };

  const addOrder: OrderContextType['addOrder'] = async (orderData) => {
    try {
      const newOrder = await createOrderApi({
        ...orderData,
        date: new Date().toISOString(),
        status: 'processing',
        trackingNumber: undefined,
        estimatedDelivery: undefined,
      });
      await loadOrders();
      return newOrder as unknown as Order;
    } catch (error) {
      Alert.alert('Error', 'Failed to create order.');
      return null;
    }
  };

  const clearOrders = () => setOrders([]);

  const cancelOrder = async (orderId: string) => {
    // For now, just update locally. To persist, you would update the order in Appwrite.
    const updatedOrders = orders.map(order =>
      (order as any).$id === orderId
        ? { ...order, status: 'cancelled' as const }
        : order
    );
    setOrders(updatedOrders);
    // TODO: Update order status in Appwrite as well
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, clearOrders, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within an OrderProvider');
  return ctx;
} 