import { View, Text, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import images from '../../constants/images';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, useNavigation, useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Update imports
import GuestButton from '../../components/GuestButton';


// Email validation function
const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const SignIn = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }

    const auth = getAuth();
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setForm({ email: '', password: ''});
      Alert.alert('Success', 'Logged in successfully!');
      router.push('/home'); // Adjust this to your target screen
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GestureHandlerRootView className="bg-[#800000]"> 
      <SafeAreaView className="h-full"> 
        <ScrollView>
          <View className="w-full justify-center min-h-[80vh] px-4 my-6 bg-[#800000]"> 
            <View className="absolute top-0 left-0 mt-4 ml-4 flex-row items-center">
              <Image 
                source={images.puplogo} 
                resizeMode="contain" 
                className="w-[80px] h-[80px]" 
              />
              <View className="ml-4">
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18, color: 'white' }}>
                  Iskonnect:
                </Text>
                <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 12, color: '#D3D3D3' }}>
                  Find your way, the smart way
                </Text>
              </View>
            </View>

            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 20, color: 'white', textAlign: 'center', marginTop: 80 }}>
              Welcome, Isko/Iska!
            </Text>

            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, color: 'white', textAlign: 'center', marginTop: 20 }}>
              Sign In
            </Text>

            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-5"
              keyboardType="email-address"
              placeholder="Enter your email"
            />

            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-5"
              placeholder="Enter your password"
              secureTextEntry={true} // Ensure password field is secure
            />

            <CustomButton 
              title="Sign In"
              handlePress={submit}
              containerStyles="mt-5 bg-[#E3AC36] rounded-lg py-2"
              isLoading={isSubmitting}
            />

            <View className="justify-center pt-5 flex-row gap-2">
              <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, color: '#D3D3D3' }}>
                Don't have an account yet?
              </Text>
              <Link href="/sign-up" style={{ fontFamily: 'Poppins-SemiBold', fontSize: 16, color: '#E3AC36' }} className='my-5'>
                Sign Up
              </Link>
            </View>

            <GuestButton />
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignIn;