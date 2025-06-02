import { View } from "react-native";
import "../global.css";

import LandingScreen from "./LandingScreen";

export default function App() {
  return (
    <View className="flex-1 bg-blue-500">
      <LandingScreen />
    </View>
  );
}
