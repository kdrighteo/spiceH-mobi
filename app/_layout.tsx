import "../global.css";
import { Stack } from "expo-router";
import { AuthProvider } from "../lib/authContext";
import { CartProvider } from "../lib/cartContext";
import { FavoritesProvider } from "../lib/favoritesContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
