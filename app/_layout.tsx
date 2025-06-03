import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "../lib/authContext";
import { CartProvider } from "../lib/cartContext";
import { FavoritesProvider } from "../lib/favoritesContext";
import { OrderProvider } from '../lib/orderContext';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('onboardingComplete');
      setShowOnboarding(seen !== 'true');
    })();
  }, []);

  if (showOnboarding === null) return null;

  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <OrderProvider>
            <Stack>
              {showOnboarding ? (
                <Stack.Screen name="Onboarding" options={{ headerShown: false }} />
              ) : (
                <>
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
                  <Stack.Screen name="settings" options={{ headerShown: false }} />
                  <Stack.Screen name="myReviews" options={{ headerShown: false }} />
                  <Stack.Screen name="LandingScreen" options={{ headerShown: false }} />
                  <Stack.Screen name="Login" options={{ headerShown: false }} />
                  <Stack.Screen name="SignUp" options={{ headerShown: false }} />
                  <Stack.Screen name="HomeScreen" options={{ headerShown: false }} />
                </>
              )}
            </Stack>
          </OrderProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
