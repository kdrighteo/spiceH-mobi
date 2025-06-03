import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, CartItem, Address, PaymentMethod } from './types';

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status' | 'trackingNumber' | 'estimatedDelivery'>) => Promise<Order>;
  clearOrders: () => void;
  cancelOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    saveOrders();
  }, [orders]);

  const loadOrders = async () => {
    try {
      const savedOrders = await AsyncStorage.getItem('orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const saveOrders = async () => {
    try {
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving orders:', error);
    }
  };

  const addOrder: OrderContextType['addOrder'] = async (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'processing',
      trackingNumber: undefined,
      estimatedDelivery: undefined,
    };
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    await saveOrders();
    return newOrder;
  };

  const clearOrders = () => setOrders([]);

  const cancelOrder = (orderId: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'cancelled' as const }
        : order
    );
    setOrders(updatedOrders);
    saveOrders();
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