import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "../lib/authContext";
import { CartProvider } from "../lib/cartContext";
import { FavoritesProvider } from "../lib/favoritesContext";
import { OrderProvider } from '../lib/orderContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <OrderProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="home" options={{ headerShown: false }} />
              <Stack.Screen name="products" options={{ headerShown: false }} />
              <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="cart" options={{ headerShown: false }} />
              <Stack.Screen name="checkout" options={{ headerShown: false }} />
              <Stack.Screen name="orders" options={{ headerShown: false }} />
              <Stack.Screen name="orders/[id]" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
              <Stack.Screen name="addressBook" options={{ headerShown: false }} />
              <Stack.Screen name="paymentMethods" options={{ headerShown: false }} />
            </Stack>
          </OrderProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
