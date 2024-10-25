// app/components/ProceedButton.jsx
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter to handle navigation
import rightArrow from '../assets/icons/right-arrow.png'; // Adjust path based on your structure

export default function ProceedButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Get the router object

  const handlePress = async () => {
    setLoading(true);
    // Simulate a network request or any action that takes time
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate 2 seconds of loading
    setLoading(false);
    
    router.push('/sign-in'); 
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      disabled={loading} 
      className={`bg-[#f0e68c] rounded-lg min-w-full h-16 flex items-center justify-center ${loading ? 'opacity-50' : ''}`} // Changed to a lighter color
    >
      <View className="flex-row items-center">
        {loading ? (
          <ActivityIndicator size="small" color="#800000" className="mr-2" /> 
        ) : (
          <>
            <Text className="text-[#800000] text-lg font-medium mr-2">Proceed to Login</Text> 
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}
