import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TouchableOpacity, Alert } from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref as dbRef, set } from 'firebase/database'; 
import { images } from '../constants';
import * as FileSystem from 'expo-file-system';

const EditProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const navigation = useNavigation();
  const auth = getAuth();
  const storage = getStorage();
  const database = getDatabase();

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission to access camera roll is required!");
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const handleImagePick = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        console.log("Selected image:", selectedAsset);
        setProfilePicture(selectedAsset.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSave = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      Alert.alert("User is not authenticated. Please log in.");
      return;
    }
  
    try {
      let photoURL = null;
  
      if (profilePicture) {
        // Generate a unique filename using timestamp
        const timestamp = new Date().getTime();
        const storageRef = ref(storage, `profilePictures/${user.uid}_${timestamp}.jpg`);
        
        // Convert URI to blob
        const response = await fetch(profilePicture);
        const blob = await response.blob();
        
        // Upload the image
        await uploadBytes(storageRef, blob);
        
        // Get the download URL
        photoURL = await getDownloadURL(storageRef);
        
        // Update user profile
        await updateProfile(user, { photoURL });
        
        // Update database
        const userRef = dbRef(database, `users/${user.uid}`);
        await set(userRef, {
          email: user.email,
          profilePicture: `profilePictures/${user.uid}_${timestamp}.jpg`,
          campus: 'PUP Main Campus',
          createdOn: new Date().toLocaleDateString()
        });
      }
  
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-lg font-bold mb-4">Edit Profile</Text>
      <TouchableOpacity onPress={handleImagePick}>
        <Image
          source={profilePicture ? { uri: profilePicture } : images.jay}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      </TouchableOpacity>
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

export default EditProfile;
