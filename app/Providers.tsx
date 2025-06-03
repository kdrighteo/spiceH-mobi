import React from 'react';
import { AuthProvider } from '../lib/authContext';
import { FavoritesProvider } from '../lib/favoritesContext';
import { CartProvider } from '../lib/cartContext';
import { OrderProvider } from '../lib/orderContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
} 