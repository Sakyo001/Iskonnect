// FormField.js
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import React, { useState } from 'react';
import { icons } from '../constants';

const FormField = ({ title, value, handleChangeText, placeholder, otherStyles, ...props }) => {
  const [showPassword, setshowPassword] = useState(false);

  const getIcon = () => {
    switch (title) {
      case 'Email':
        return icons.email; // Assuming `email` icon is available in `icons`
      case 'Password':
        return icons.lock; // Assuming `lock` icon is available in `icons`
      case 'Confirm Password':
        return icons.lock; // Assuming `lock` icon is available in `icons`
      default:
        return null;
    }
  };

  return (
    <View className={`space-y-1 ${otherStyles}`}> 
      <Text className="text-base text-white font-pmedium">{title}</Text>

      <View className="w-full h-14 px-3 bg-white rounded-2xl focus:border-secondary items-center flex-row">
        <Image source={getIcon()} className="w-6 h-6 mr-3" resizeMode="contain" />
        <TextInput
          className="flex-1 text-black font-semibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#A9A9A9"
          onChangeText={handleChangeText}
          secureTextEntry={title !== 'Email' && !showPassword} // Make it password field if not email
        />

        {(title === 'Password' || title === 'Confirm Password') && (
          <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
            <Image source={!showPassword ? icons.eye : icons.eyehide} className="w-6 h-6" resizeMode='contain' />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
