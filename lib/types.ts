export interface Product {
  id?: string; // local/mock id
  $id?: string; // Appwrite document id
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  origin: string;
  usage: string;
  conditions: string;
  expiration: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  text: string;
  date: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  address: Address;
  paymentMethod: PaymentMethod;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal';
  last4: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
} 