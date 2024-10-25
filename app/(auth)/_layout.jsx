// /(auth)/_layout.jsx
import { View } from 'react-native';
import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from 'firebase/app'; // Use Firebase JS SDK
import { getAuth } from 'firebase/auth'; // Get Auth from Firebase

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
  // Initialize Firebase
  useEffect(() => {
    initializeApp(firebaseConfig);
  }, []);

  return (
    <View style={{ flex: 1 }}> 
      <Stack>
        <Stack.Screen 
          name="sign-in"
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="sign-up"
          options={{ headerShown: false }}
        />
      </Stack>

      <StatusBar backgroundColor='#161622' style='light'/>
    </View>
  );
};

export default AuthLayout;
