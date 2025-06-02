import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../lib/authContext';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const ok = await login(email.trim().toLowerCase(), password);
    setLoading(false);
    if (ok) {
      router.replace('/products');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  return (
    <View className="flex-1 bg-red-600 justify-center items-center px-4">
      <Text className="text-white text-3xl font-bold mb-8">Log In</Text>
      <TextInput
        className="bg-white rounded-lg px-4 py-2 mb-4 w-full max-w-md"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="bg-white rounded-lg px-4 py-2 mb-6 w-full max-w-md"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity className="bg-black px-8 py-3 rounded-lg mb-4 w-full max-w-md items-center" onPress={handleLogin} disabled={loading}>
        <Text className="text-white text-lg font-semibold">{loading ? 'Logging In...' : 'Log In'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.replace('/SignUp')}>
        <Text className="text-white underline">Don&apos;t have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
} 