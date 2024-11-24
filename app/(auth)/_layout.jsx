// /(auth)/_layout.jsx
import { View } from 'react-native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm9H7YUmMfTwfkYTI1Fmiyxb82yNXIefY",
  authDomain: "iskonnect-426cd.firebaseapp.com",
  projectId: "iskonnect-426cd",
  storageBucket: "iskonnect-426cd.appspot.com",
  messagingSenderId: "924343050010",
  appId: "1:924343050010:web:ad3487b1f98038638716a3",
  measurementId: "G-4R6ZSSHZXQ",
  databaseURL: "https://iskonnect-426cd.firebaseio.com",
};

const AuthLayout = () => {
  useEffect(() => {
    // Check if Firebase has already been initialized
    if (getApps().length === 0) {
      const app = initializeApp(firebaseConfig);
      initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#800000' }}> 
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#800000' }
      }}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
      </Stack>
      <StatusBar backgroundColor='#800000' style='light'/>
    </View>
  );
};

export default AuthLayout;
