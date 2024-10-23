// app/index.jsx
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Link } from 'expo-router';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-pblack">Iskonnect</Text>
      <StatusBar style="auto" />
      <Link href="/home" style={{ color: 'blue' }}>Go to Homepage</Link>
    </View>
  );
}
