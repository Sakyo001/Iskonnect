// app/components/SketchUpView.jsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

export default function SketchUpView() {
  return (
    <View style={{ flex: 1, borderWidth: 0, overflow: 'hidden' }}>
      <WebView 
        source={{ uri: 'https://3dwarehouse.sketchup.com/embed/u8c5cb3d2-7f71-46d6-be7e-40281aa9cb71?token=9ICLKyk5guw=&binaryName=s21' }} 
        style={{ width: 580, height: 326 }}  // Set width and height as per your requirement
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsFullscreenVideo={true}
        startInLoadingState={true}
        allowsInlineMediaPlayback={true}
        scrollEnabled={false}  // Disable scrolling as per the iframe's scrolling="no"
        renderLoading={() => (
          <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />
        )}
      />
    </View>
  );
}
