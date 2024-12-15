import { View } from 'react-native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAvoidingView, Platform } from 'react-native';

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
    if (getApps().length === 0) {
      const app = initializeApp(firebaseConfig);
      initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  }, []);

  return (
   
      <View style={{ flex: 1, backgroundColor: '#800000' }}>
        <StatusBar style="light" />
        <Stack screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#800000' },
          animation: 'slide_from_right'
        }}>
          <Stack.Screen name="sign-in" />
          <Stack.Screen name="sign-up" />
        </Stack>
      </View>
  );
};

export default AuthLayout;