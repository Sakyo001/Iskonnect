import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Settings = () => {
  const settingsOptions = [
    {
      id: 1,
      title: 'Account',
      icon: 'person-outline',
      navigation: 'Account'
    },
    {
      id: 2,
      title: 'Notifications',
      icon: 'notifications-outline',
      navigation: 'Notifications'
    },
    {
      id: 3,
      title: 'Appearance',
      icon: 'eye-outline',
      navigation: 'Appearance'
    },
    {
      id: 4,
      title: 'Privacy & Security',
      icon: 'lock-closed-outline',
      navigation: 'Privacy'
    },
    {
      id: 5,
      title: 'Help and Support',
      icon: 'headset-outline',
      navigation: 'Support'
    },
    {
      id: 6,
      title: 'About',
      icon: 'information-circle-outline',
      navigation: 'About'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a setting..."
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.optionsContainer}>
        {settingsOptions.map((option) => (
          <TouchableOpacity key={option.id} style={styles.optionItem}>
            <View style={styles.optionLeft}>
              <Ionicons name={option.icon} size={24} color="#666" />
              <Text style={styles.optionText}>{option.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  optionsContainer: {
    paddingHorizontal: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333',
  },
});

export default Settings;