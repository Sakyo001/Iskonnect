import React from 'react';
import { getDatabase, ref, set } from 'firebase/database';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Alert } from 'react-native';

const Login = () => {
  const handleSignUp = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create initial user data in Realtime Database
      const database = getDatabase();
      await set(ref(database, `users/${user.uid}`), {
        email: user.email,
        campus: 'PUP Main Campus',
        createdOn: new Date().toLocaleDateString(),
        profilePicture: null // This will be updated when user uploads a picture
      });

    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    // Your component JSX goes here
    <></> // Placeholder for your component's UI
  );
};

export default Login;