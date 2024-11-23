import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getDatabase, ref as dbRef, set, get, onValue } from 'firebase/database'; 
import { images } from '../constants';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const EditProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentProfileUrl, setCurrentProfileUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const auth = getAuth();
  const storage = getStorage();
  const database = getDatabase();

  // Fetch current profile data
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userRef = dbRef(database, `users/${user.uid}`);
      const unsubscribe = onValue(userRef, async (snapshot) => {
        const data = snapshot.val();
        if (data && data.profilePicture) {
          try {
            const imageRef = ref(storage, data.profilePicture);
            const downloadURL = await getDownloadURL(imageRef);
            setCurrentProfileUrl(downloadURL);
          } catch (error) {
            console.log("Using default profile picture");
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

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
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setProfilePicture(selectedAsset.uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleSave = async () => {
    if (!profilePicture) {
      navigation.goBack();
      return;
    }

    setIsSubmitting(true);
    const user = auth.currentUser;

    try {
      // Get current user data first
      const userRef = dbRef(database, `users/${user.uid}`);
      const userSnapshot = await get(userRef);
      const currentUserData = userSnapshot.val() || {};

      // Compress and resize the image
      const manipResult = await manipulateAsync(
        profilePicture,
        [{ resize: { width: 500, height: 500 } }],
        { compress: 0.7, format: SaveFormat.JPEG }
      );

      // Convert to blob
      const response = await fetch(manipResult.uri);
      const blob = await response.blob();

      // Create unique filename
      const timestamp = Date.now();
      const storagePath = `profilePictures/${user.uid}_${timestamp}.jpg`;
      const imageRef = ref(storage, storagePath);

      // Upload the image
      await uploadBytes(imageRef, blob);

      // Update user profile in database with merged data
      await set(userRef, {
        ...currentUserData,
        email: user.email,
        profilePicture: storagePath,
        updatedAt: new Date().toISOString(),
      });

      Alert.alert(
        "Success",
        "Profile updated successfully!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      Alert.alert(
        "Error",
        "Failed to update profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-lg font-bold mb-4">Edit Profile</Text>
      <TouchableOpacity 
        onPress={handleImagePick}
        disabled={isSubmitting}
        className="items-center"
      >
        <Image
          source={
            profilePicture 
              ? { uri: profilePicture }
              : currentProfileUrl 
                ? { uri: currentProfileUrl }
                : images.jay
          }
          className="w-32 h-32 rounded-full mb-4"
          resizeMode="cover"
        />
        <Text className="text-blue-600 mb-4">
          Tap to change profile picture
        </Text>
      </TouchableOpacity>
      <Button 
        title={isSubmitting ? "Saving..." : "Save Changes"} 
        onPress={handleSave}
        disabled={isSubmitting}
      />
    </View>
  );
};

export default EditProfile;
