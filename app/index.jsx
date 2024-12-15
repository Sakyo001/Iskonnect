// app/index.jsx
import 'react-native-gesture-handler';
import { Text, View, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import ProceedButton from '../components/ProceedButton'; // Custom button component
import logo from '../assets/images/puplogo.png'; // Adjust path based on your structure


export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-[#800000] p-6"> 
      <StatusBar style="light" /> 

      <Image 
        source={logo} 
        className="w-50 h-50 rounded-full"  // White border for visibility
        resizeMode="contain" 
      />

      <Text className="text-6xl font-extrabold mb-2 text-white font-poppins"> 
        Iskonnect
      </Text>

      <Text className="text-xl font-semibold text-[#f0e68c] text-center px-6 mb-2 font-poppins"> 
        FIND YOUR WAY, THE SMART WAY
      </Text>

      <Text className="text-md text-gray-200 text-center px-6 mb-10 font-poppins">
        Explore, discover, and navigate your campus effortlessly with Iskonnect—your guide to every corner.
      </Text>

      <ProceedButton />
    </View>
  );
}
