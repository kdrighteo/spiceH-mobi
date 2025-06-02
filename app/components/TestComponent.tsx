import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Stack } from "expo-router";

export default function TestComponent() {
  return (
    <View className="flex-1 bg-white p-4 m-4 rounded-lg">
      <Text className="text-red-500 text-xl font-bold">Test Component</Text>
    </View>
  );
}

export function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
} 