import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-red-600 px-4 pt-12">
      <Text className="text-white text-2xl font-bold font-serif tracking-widest mb-6 self-center">Spice-Haven</Text>
      <View className="bg-white rounded-lg flex-row items-center px-4 py-2 mb-6 shadow">
        <TextInput
          className="flex-1 text-base"
          placeholder="Search"
          placeholderTextColor="#888"
        />
        <Text className="text-xl ml-2">🔍</Text>
      </View>
      <View className="bg-white rounded-xl p-4 mb-6 shadow">
        <Text className="text-xl font-bold mb-1">Bay Leaves</Text>
        <Text className="text-gray-700 mb-2 text-sm">Luxurious, hand-harvested saffron threads with an intense aroma and rich golden color. Perfect for paella, risotto, and Middle Eastern cuisine.</Text>
        <Text className="text-red-500 text-lg font-bold mb-2">$9.6</Text>
        <View className="flex-row items-center mb-2">
          <TouchableOpacity className="bg-gray-200 px-2 py-1 rounded-full mr-2"><Text>-</Text></TouchableOpacity>
          <Text className="mx-2">1</Text>
          <TouchableOpacity className="bg-gray-200 px-2 py-1 rounded-full ml-2"><Text>+</Text></TouchableOpacity>
        </View>
        <View className="flex-row space-x-2">
          <TouchableOpacity className="flex-1 bg-gray-100 px-2 py-1 rounded"><Text>Texture</Text></TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-100 px-2 py-1 rounded"><Text>Origin</Text></TouchableOpacity>
        </View>
      </View>
      <View className="bg-white rounded-xl p-4 mb-6 shadow flex-1">
        <View className="flex-row mb-2">
          <Text className="underline mr-4">conditions</Text>
          <Text className="mr-4">Usage</Text>
          <Text className="">conditions</Text>
        </View>
        <View className="flex-1 bg-gray-50 rounded-lg" />
      </View>
      <TouchableOpacity className="absolute bottom-8 right-8 bg-black px-6 py-3 rounded-lg shadow-lg flex-row items-center">
        <Text className="text-white text-lg font-semibold mr-2">Add to Cart</Text>
        <Text className="text-white text-xl">🛒</Text>
      </TouchableOpacity>
    </View>
  );
} 