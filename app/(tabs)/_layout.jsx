import { View, Text, Image } from 'react-native';
import React from 'react';
import { Tabs } from 'expo-router';
import { createStackNavigator } from '@react-navigation/stack';
import icons from '../../constants/icons';
import EditProfile from '../../components/EditProfile';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getApps} from 'firebase/app';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm9H7YUmMfTwfkYTI1Fmiyxb82yNXIefY",
  authDomain: "iskonnect-426cd.firebaseapp.com",
  projectId: "iskonnect-426cd",
  storageBucket: "iskonnect-426cd.appspot.com",
  messagingSenderId: "924343050010",
  appId: "1:924343050010:web:ad3487b1f98038638716a3",
  measurementId: "G-4R6ZSSHZXQ",
  databaseURL: "https://iskonnect-426cd-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app); // Get storage instance

const TabIcon = ({ icon, color, focused }) => (
  <View className="items-center justify-center gap-3" style={{ marginBottom: focused ? 10 : 0 }}>
    <Image
      source={icon}
      resizeMode="contain"
      style={{ tintColor: color }}
      className="w-7 h-7"
    />
  </View>
);

const TabStack = createStackNavigator();

const TabsLayout = () => {
  return (
    <TabStack.Navigator screenOptions={{ headerShown: false }}>
  
      <TabStack.Screen name="MainTabs">
        {() => (
          <Tabs
            screenOptions={{
              tabBarShowLabel: true,
              tabBarActiveTintColor: '#FFA001',
              tabBarInactiveTintColor: '#ffffff',
              tabBarStyle: {
                backgroundColor: '#800000',
                borderTopWidth: 1,
                height: 70,
                paddingHorizontal: 10,
                borderRadius: 30,
                position: 'absolute',
                left: 5,
                right: 5,
                bottom: 5,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 3,
              },
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon icon={icons.home} color={color} focused={focused} />
                ),
              }}
            />
            <Tabs.Screen
              name="categories"
              options={{
                title: 'Categories',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon icon={icons.categories} color={color} focused={focused} />
                ),
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Settings',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon icon={icons.settings} color={color} focused={focused} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon icon={icons.profile} color={color} focused={focused} />
                ),
              }}
            />
          </Tabs>
        )}
      </TabStack.Screen>

      <TabStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ title: 'Edit Profile' }}
      />
    </TabStack.Navigator>
  );
};

export default TabsLayout;