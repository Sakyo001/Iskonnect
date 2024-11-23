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

const TabIcon = ({ icon, color, name, focused }) => (
  <View className="items-center justify-center gap-3">
    <Image
      source={icon}
      resizeMode="contain"
      style={{ tintColor: color }}
      className="w-7 h-7"
    />
    <Text
      className={`${focused ? 'font-semibold' : 'font-regular'} text-xs`}
      style={{
        color,
        marginBottom: focused ? 20 : 0,
      }}
    >
      {name}
    </Text>
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
              tabBarShowLabel: false,
              tabBarActiveTintColor: '#FFA001',
              tabBarInactiveTintColor: '#ffffff',
              tabBarStyle: {
                backgroundColor: '#540b0e',
                borderTopWidth: 0,
                height: 84,
                paddingHorizontal: 20,
                borderRadius: 40,
                position: 'absolute',
                left: 10,
                right: 10,
                bottom: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 5,
              },
            }}
          >
           
            <Tabs.Screen
              name="home"
              options={{
                title: 'Home',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon icon={icons.home} color={color} name="Home" focused={focused} />
                ),
              }}
            />
            <Tabs.Screen
              name="categories"
              options={{
                title: 'Categories',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon icon={icons.categories} color={color} name="Categories" focused={focused} />
                ),
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Settings',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon icon={icons.settings} color={color} name="Settings" focused={focused} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon icon={icons.profile} color={color} name="Profile" focused={focused} />
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
