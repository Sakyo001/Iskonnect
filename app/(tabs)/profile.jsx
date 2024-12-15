import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'; // Import necessary functions
import { images } from '../../constants';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

const Profile = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const auth = getAuth();
  const database = getDatabase();
  const storage = getStorage(); // Initialize Firebase Storage

  const [userInfo, setUserInfo] = useState({
    profilePicture: images.jay, // default image
    email: auth.currentUser?.email || '', // Add email instead of name
    campus: 'PUP Main Campus', // default campus
    createdOn: '25 Oct 2024', // default creation date
  });

  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userRef = ref(database, `users/${user.uid}`);

      const unsubscribe = onValue(userRef, async (snapshot) => {
        const data = snapshot.val();
        if (data) {
          let profileImageUrl = images.jay; // Default image

          // Check if there is a profile picture path and handle errors gracefully
          if (data.profilePicture) {
            try {
              const imageRef = storageRef(storage, data.profilePicture);
              const downloadURL = await getDownloadURL(imageRef);
              profileImageUrl = { uri: downloadURL };
            } catch (error) {
              console.log("Using default profile picture");
              // Don't show error to user, just use default image
              profileImageUrl = images.jay;
            }
          }

          setUserInfo({
            profilePicture: profileImageUrl,
            email: user.email || '',
            campus: data.campus || 'PUP Main Campus',
            createdOn: data.createdOn || new Date().toLocaleDateString(),
          });
        } else {
          // Create initial user data with default values
          const initialUserData = {
            email: user.email,
            campus: 'PUP Main Campus',
            createdOn: new Date().toLocaleDateString(),
            // Don't set profilePicture initially
          };
          
          try {
            await set(ref(database, `users/${user.uid}`), initialUserData);
            setUserInfo({
              profilePicture: images.jay,
              email: user.email || '',
              campus: initialUserData.campus,
              createdOn: initialUserData.createdOn,
            });
          } catch (error) {
            console.error("Error setting initial user data:", error);
            Alert.alert("Error", "Failed to set up user profile.");
          }
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
        Alert.alert("Error", "Failed to load profile data.");
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [auth, database, storage]);

  // Add this function to handle profile picture upload errors
  const handleImageUploadError = (error) => {
    console.error("Image upload error:", error);
    Alert.alert(
      "Upload Failed",
      "Failed to upload profile picture. Please try again later.",
      [{ text: "OK" }]
    );
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile'); // Navigate to EditProfile screen
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/(auth)/sign-in');
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    ); // Show loading indicator
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      {/* Add Logout Button in Header */}
      <View className="flex-row justify-end px-4 py-2">
        <TouchableOpacity 
          onPress={handleLogout}
          className="p-2"
        >
          <Ionicons name="log-out-outline" size={24} color="#FF0000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Header Section */}
        <View className="flex items-center py-8 shadow-sm"> 
          <Image
            source={userInfo.profilePicture}
            className="w-36 h-36 rounded-full border-4 border-white shadow-lg"
            resizeMode="cover"
          />
          <Text className="mt-5 text-xl font-semibold">{userInfo.email}</Text>
          <TouchableOpacity
            onPress={handleEditProfile}
            className="bg-blue-600 px-8 py-3 rounded-lg mt-5 flex-row items-center shadow-sm"
          >
            <Image
              source={images.pencil}
              className="w-4 h-4 mr-2 tint-white"
              resizeMode="contain"
            />
            <Text className="text-white font-medium">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Overview Section */}
        <View className="mt-6 px-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-800 text-lg font-semibold">Overview</Text>
            <TouchableOpacity className="flex-row items-center" onPress={() => {}}>
             
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-xl shadow-sm">
            <View className="flex-row justify-between p-4 border-b border-gray-100">
              <Text className="text-gray-600">Email</Text>
              <Text className="text-gray-900 font-medium">{userInfo.email}</Text>
            </View>
            <View className="flex-row justify-between p-4 border-b border-gray-100">
              <Text className="text-gray-600">Campus</Text>
              <Text className="text-gray-900 font-medium">{userInfo.campus}</Text>
            </View>
            <View className="flex-row justify-between p-4">
              <Text className="text-gray-600">Created on</Text>
              <Text className="text-gray-900 font-medium">{userInfo.createdOn}</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

export default Profile;
