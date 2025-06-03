// Shared types for the Spice Haven app

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  usage: string;
  conditions: string;
  expiration: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type PaymentMethod = 'credit' | 'debit' | 'paypal' | 'apple';

export type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: Address;
  paymentMethod: 'credit' | 'debit' | 'paypal' | 'apple';
  trackingNumber?: string;
  estimatedDelivery?: string;
}; 