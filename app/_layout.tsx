import "../global.css";
import { Stack } from "expo-router";
import { CartProvider } from "../lib/cartContext";
import { FavoritesProvider } from "../lib/favoritesContext";

export default function RootLayout() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </FavoritesProvider>
  );
}
