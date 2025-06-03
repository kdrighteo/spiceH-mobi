import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../lib/authContext';

export default function AuthScreen() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = (provider: string) => {
    // TODO: Integrate real social login
    Alert.alert('Social Login', `Mock: Sign in with ${provider}`);
    router.replace('/products');
  };

  const handleSubmit = async () => {
    if (!email || !password || (isSignup && !name)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        const success = await signup(email, password, name);
        if (success) {
          Alert.alert('Success', 'Account created successfully!');
          router.replace('/products');
        } else {
          Alert.alert('Error', 'Email already exists');
        }
      } else {
        const success = await login(email, password);
        if (success) {
          router.replace('/products');
        } else {
          Alert.alert('Error', 'Invalid email or password');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-b from-yellow-50 to-red-100 justify-center items-center px-4">
      {/* Hero Illustration */}
      <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }} className="w-24 h-24 mb-4 mt-12" />
      <Text className="text-4xl font-extrabold text-red-700 mb-2 tracking-widest text-center drop-shadow-lg">Spice Haven</Text>
      <Text className="text-lg text-gray-700 mb-6 text-center">Sign up or log in to start your flavor journey!</Text>
      <View className="bg-white/95 rounded-3xl p-8 shadow-xl w-full max-w-md items-center mb-8">
        {/* Social Login Buttons */}
        <View className="flex-row justify-center mb-6 space-x-4 w-full">
          <TouchableOpacity className="bg-white border border-gray-300 rounded-full p-3 mx-1 shadow" onPress={() => handleSocialLogin('Google')}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} className="w-7 h-7" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white border border-gray-300 rounded-full p-3 mx-1 shadow" onPress={() => handleSocialLogin('Facebook')}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/733/733547.png' }} className="w-7 h-7" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white border border-gray-300 rounded-full p-3 mx-1 shadow" onPress={() => handleSocialLogin('Apple')}>
            <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/179/179309.png' }} className="w-7 h-7" />
          </TouchableOpacity>
        </View>
        {/* Divider */}
        <View className="flex-row items-center w-full mb-6">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-3 text-gray-400 text-base font-semibold">or {isSignup ? 'sign up' : 'log in'} with email</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>
        {isSignup && (
          <TextInput
            className="bg-white rounded-lg px-4 py-2 border border-gray-200 mb-4 w-full"
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        <TextInput
          className="bg-white rounded-lg px-4 py-2 border border-gray-200 mb-4 w-full"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          className="bg-white rounded-lg px-4 py-2 border border-gray-200 mb-6 w-full"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          className="bg-gradient-to-r from-red-500 to-yellow-400 px-8 py-3 rounded-full shadow-lg items-center w-full mb-2 border-2 border-red-700"
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text className="text-white text-lg font-extrabold tracking-wide drop-shadow-lg">{loading ? (isSignup ? 'Signing Up...' : 'Logging In...') : isSignup ? 'Sign Up' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSignup(!isSignup)} className="w-full mt-2">
          <Text className="text-red-600 text-center underline text-base font-semibold">
            {isSignup ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 