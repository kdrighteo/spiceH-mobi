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
              {showOnboarding
                ? <Stack.Screen name="Onboarding" options={{ headerShown: false }} />
                : [
                    <Stack.Screen key="index" name="index" options={{ headerShown: false }} />,
                    <Stack.Screen key="home" name="home" options={{ headerShown: false }} />,
                    <Stack.Screen key="products" name="products" options={{ headerShown: false }} />,
                    <Stack.Screen key="products/[id]" name="products/[id]" options={{ headerShown: false }} />,
                    <Stack.Screen key="cart" name="cart" options={{ headerShown: false }} />,
                    <Stack.Screen key="checkout" name="checkout" options={{ headerShown: false }} />,
                    <Stack.Screen key="orders" name="orders" options={{ headerShown: false }} />,
                    <Stack.Screen key="orders/[id]" name="orders/[id]" options={{ headerShown: false }} />,
                    <Stack.Screen key="profile" name="profile" options={{ headerShown: false }} />,
                    <Stack.Screen key="addressBook" name="addressBook" options={{ headerShown: false }} />,
                    <Stack.Screen key="paymentMethods" name="paymentMethods" options={{ headerShown: false }} />,
                    <Stack.Screen key="settings" name="settings" options={{ headerShown: false }} />,
                    <Stack.Screen key="myReviews" name="myReviews" options={{ headerShown: false }} />,
                    <Stack.Screen key="LandingScreen" name="LandingScreen" options={{ headerShown: false }} />,
                    <Stack.Screen key="Login" name="Login" options={{ headerShown: false }} />,
                    <Stack.Screen key="HomeScreen" name="HomeScreen" options={{ headerShown: false }} />
                  ]
              }
            </Stack>
          </OrderProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
