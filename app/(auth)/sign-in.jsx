import { View, Text, Image, Alert, Modal, Animated } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import images from '../../constants/images';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, useNavigation, useRouter } from 'expo-router';
import GuestButton from '../../components/GuestButton';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

// Email validation function
const isValidEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const SignIn = () => {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const errorFadeAnim = React.useRef(new Animated.Value(0)).current;

  const showSuccess = () => {
    setShowSuccessModal(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccessModal(false);
      router.push('/home');
    });
  };

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
    Animated.sequence([
      Animated.timing(errorFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(errorFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowErrorModal(false);
    });
  };

  const submit = async () => {
    if (!form.email || !form.password) {
      showError('Email and password are required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      setForm({ email: '', password: ''});
      showSuccess();
    } catch (error) {
      showError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }} className="bg-[#800000]"> 
      <SafeAreaView style={{ flex: 1 }} className="h-full"> 
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="w-full justify-center flex-1 px-4 my-6 bg-[#800000]"> 
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

            <View className="flex-row items-center justify-center mt-8 mb-8">
              <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 16, color: '#D3D3D3' }}>
                Don't have an account yet?
              </Text>
              <Link 
                href="/sign-up" 
                style={{ 
                  fontFamily: 'Poppins-SemiBold', 
                  fontSize: 16, 
                  color: '#E3AC36',
                  marginLeft: 8 
                }}
              >
                Sign Up
              </Link>
            </View>

            <GuestButton />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Success Modal */}
      <Modal
        transparent
        visible={showSuccessModal}
        animationType="none"
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.successModal, { opacity: fadeAnim }]}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={50} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>Welcome Back!</Text>
            <Text style={styles.successMessage}>Signed in successfully</Text>
          </Animated.View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        transparent
        visible={showErrorModal}
        animationType="none"
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.errorModal, { opacity: errorFadeAnim }]}>
            <View style={styles.iconContainer}>
              <Ionicons name="alert-circle" size={50} color="#DC2626" />
            </View>
            <Text style={styles.errorTitle}>Oops!</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </Animated.View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

// Add these styles
const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  successModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  iconContainer: {
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  errorModal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  errorTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: '#DC2626',
    marginBottom: 5,
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
  },
};

export default SignIn;