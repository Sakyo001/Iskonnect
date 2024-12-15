import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Button } from 'react-native';

const Privacy = ({ email, onChangePassword }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Privacy & Security</Text>
      <Text style={styles.content}>
        Here you can manage your privacy settings and security options. 
        Make sure to keep your account secure by using strong passwords and enabling two-factor authentication.
      </Text>
      
      {/* Display Email */}
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      {/* Change Password Section */}
      <View style={styles.changePasswordContainer}>
        <Text style={styles.label}>Change Password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          secureTextEntry
        />
        <Button title="Change Password" onPress={onChangePassword} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  infoContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  email: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  changePasswordContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default Privacy; 