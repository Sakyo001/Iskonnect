import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAm9H7YUmMfTwfkYTI1Fmiyxb82yNXIefY",
  authDomain: "iskonnect-aef77.firebaseapp.com",
  databaseURL: "https://iskonnect-426cd-default-rtdb.firebaseio.com",
  projectId: "iskonnect-aef77",
  storageBucket: "iskonnect-426cd.appspot.com",
  messagingSenderId: "550394304360",
  appId: "1:550394304360:android:31d24e50aa60b13b5228dd"
};

let app;
let auth;

// Initialize Firebase if not already initialized
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  // Initialize Auth with AsyncStorage persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

// Initialize Database
const database = getDatabase(app);

export { auth, database }; 