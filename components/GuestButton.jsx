// app/components/GuestButton.jsx
import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, View} from 'react-native';
import { useRouter } from 'expo-router';
 

const GuestButton = ({ isLoading }) => {
  const router = useRouter();

  const handlePress = () => {
    // Logic for guest login or navigation
    router.push('/home');
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      disabled={isLoading} 
      className={`bg-[#00ffff] rounded-lg min-w-full h-16 flex items-center justify-center ${isLoading ? 'opacity-50' : ''}`} // Match color with CustomButton
    >
      <View className="flex-row items-center">
        {isLoading ? (
          <ActivityIndicator size="small" color="#800000" className="mr-2" />
        ) : (
          <Text className="text-[#000000] text-md font-medium">Login as Guest</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GuestButton;
