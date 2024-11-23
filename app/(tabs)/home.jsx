import React, { useState, useRef } from 'react'
import { View, StyleSheet, Dimensions, SafeAreaView, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator, Linking, Modal, FlatList, Pressable, TextInput, Platform, Alert } from 'react-native'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import { Video } from 'expo-av'

const { width, height } = Dimensions.get('window')

const suggestedPlaces = [
  {
    id: 1,
    name: "Lagoon",
    description: "A beautiful park with walking trails and scenic views.",
    distance: "86 meters",
    image: require('../../assets/images/lagoon3.jpg'),
    category: "Park",
    coordinates: {
      x: 127,
      y: 81,
      z: -2
    },
    gallery: [
      require('../../assets/images/lagoon1.jpg'),
      require('../../assets/images/lagoon2.jpg'),
      require('../../assets/images/lagoon3.jpg'),
      require('../../assets/images/lagoon4.jpg'),
      require('../../assets/images/lagoon5.jpg'),
      require('../../assets/images/lagoon6.jpg'),
      require('../../assets/images/lagoon7.jpg'),
      // Add more images as needed
    ]
  },
  {
    id: 2,
    name: "City Museum",
    description: "Historic museum featuring local artifacts and exhibitions.",
    distance: "86 meters",
    image: require('../../assets/images/lagoon9.jpg'),
    category: "Museum",
    coordinates: {
      x: 0,
      y: 50,
      z: 0,
      radius: 100,
      theta: 45,
      phi: 60
    },
    gallery: [
      require('../../assets/images/lagoon10.jpg'),
      require('../../assets/images/lagoon11.jpg'),
      require('../../assets/images/lagoon12.jpg'),
      require('../../assets/images/lagoon13.jpg'),
      require('../../assets/images/lagoon14.jpg'),
      require('../../assets/images/lagoon15.jpg'),
      require('../../assets/images/lagoon16.jpg'),
    ]
  }
];


const INITIAL_CAMERA_SETTINGS = `
  (function() {
    const viewer = document.querySelector('model-viewer');
    if (viewer) {
      viewer.cameraOrbit = '0deg 45deg 30m';  // Closer zoom (30m instead of default)
      viewer.fieldOfView = '25deg';  // Narrower field of view for closer zoom
      viewer.maxFieldOfView = '30deg';  // Limit max zoom out
      viewer.minCameraOrbit = 'auto 0deg 20m';  // Limit closest zoom
      viewer.maxCameraOrbit = 'auto 90deg 100m';  // Limit furthest zoom

      // Add CSS to hide the AR button
      const style = document.createElement('style');
      style.textContent = 'model-viewer::part(ar-button) { display: none; }';
      document.head.appendChild(style);
    }
  })();
  true;
`;

const GalleryModal = ({ visible, images, onClose, placeName }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{placeName}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={images}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.galleryImageContainer}>
              <Image source={item} style={styles.galleryImage} resizeMode="cover" />
            </View>
          )}
          contentContainerStyle={styles.galleryGrid}
        />
      </View>
    </Modal>
  )
}

const Home = () => {
  const webViewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleLoadError = () => {
    setIsError(true);
    setIsLoading(false);
  };

  const handleViewGallery = (place) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

  const handleSeeAll = () => {
    setShowAllPlaces(true);
  };

  const handleBack = () => {
    setShowAllPlaces(false);
  };

  const handleGetDirections = (place) => {
    if (webViewRef.current) {
      const script = `
        (function() {
          const viewer = document.querySelector('model-viewer');
          if (viewer) {
            // Get current camera position
            const currentOrbit = viewer.getCameraOrbit();
            const currentTarget = viewer.getCameraTarget();
            
            // Set up smooth animation
            const startTime = performance.now();
            const duration = 1500; // 1.5 second animation
            
            function animate(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Smooth easing function
              const easing = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
              const smoothProgress = easing(progress);
              
              // Set target position based on place coordinates
              const targetX = ${place.coordinates.x};
              const targetY = ${place.coordinates.y};
              const targetZ = ${place.coordinates.z};
              const targetTheta = ${place.coordinates.theta};
              const targetPhi = ${place.coordinates.phi};
              const targetRadius = ${place.coordinates.radius};
              
              // Parse current orbit values
              const [theta, phi, radius] = currentOrbit.split(' ').map(v => parseFloat(v));
              
              // Interpolate orbit values
              const newTheta = theta + (targetTheta - theta) * smoothProgress;
              const newPhi = phi + (targetPhi - phi) * smoothProgress;
              const newRadius = radius + (targetRadius - radius) * smoothProgress;
              
              // Update camera position
              viewer.cameraOrbit = \`\${newTheta}deg \${newPhi}deg \${newRadius}m\`;
              viewer.cameraTarget = \`\${targetX} \${targetY} \${targetZ}\`;
              viewer.fieldOfView = \`\${25 - (5 * smoothProgress)}deg\`;
              
              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            }
            
            requestAnimationFrame(animate);
          }
        })();
        true;
      `;
      webViewRef.current.injectJavaScript(script);
    }

    // Show video only for Lagoon
    if (place.name === "Lagoon") {
      setShowVideo(true);
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'showVideo') {
        setShowVideo(true);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  const handleVideoFinish = () => {
    setShowVideo(false);
  };

  const handleARView = (place) => {
    const modelUrl = 'https://3dwarehouse.sketchup.com/warehouse/v1.0/content/public/f807576d-06d3-497d-abe3-cbe347014750';
    
    if (Platform.OS === 'android') {
      const sceneViewerUrl = `intent://arvr.google.com/scene-viewer/1.2?file=${encodeURIComponent(modelUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;end;`;
      Linking.openURL(sceneViewerUrl).catch(err => {
        console.error('Error opening AR view:', err);
        // Fallback for devices without AR support
        Alert.alert(
          'AR Not Available',
          'AR view is not supported on this device.',
          [{ text: 'OK' }]
        );
      });
    } else if (Platform.OS === 'ios') {
      // iOS AR Quick Look URL
      const quickLookUrl = `${modelUrl}#allowsContentScaling=0`;
      Linking.openURL(quickLookUrl).catch(err => {
        console.error('Error opening AR view:', err);
        Alert.alert(
          'AR Not Available',
          'AR view is not supported on this device.',
          [{ text: 'OK' }]
        );
      });
    }
  };

  const renderPlaceCard = (place, index) => (
    <View 
      key={place.id} 
      style={[
        styles.placeCard,
        index === suggestedPlaces.length - 1 && styles.lastCard
      ]}
    >
      <Image
        source={place.image}
        style={styles.placeImage}
        resizeMode="cover"
      />
      <View style={styles.placeInfo}>
        <View style={styles.placeHeader}>
          <Text style={styles.placeName}>{place.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{place.category}</Text>
          </View>
        </View>
        <Text style={styles.placeDescription}>{place.description}</Text>
        <Text style={styles.distanceText}>Approximately {place.distance}</Text>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.directionsButton}
            onPress={() => handleGetDirections(place)}
            android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }}
          >
            <Ionicons name="navigate-outline" size={16} color="#fff" />
            <Text style={styles.directionsButtonText}> Directions</Text>
          </Pressable>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={() => handleViewGallery(place)}
          >
            <Text style={styles.galleryButtonText}>View Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {!showAllPlaces ? (
        <>
          <View style={styles.headerContainer}>
            <View style={styles.headerContent}>
              <Image 
                source={require('../../assets/images/puplogo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
              <View style={styles.titleContainer}>
                <Text style={styles.headerTitle}>Iskonnect: <Text style={styles.headerSubtitle}>Explore Our University</Text></Text>
              </View>
            </View>
          </View>

          <View style={styles.mapSection}>
            <View style={styles.mapHeader}>
              <Text style={styles.mapTitle}>3D Campus Map</Text>
              <Text style={styles.mapSubtitle}>Explore the campus in 3D</Text>
            </View>

            <View style={styles.fixedViewerContainer}>
              <WebView
                ref={webViewRef}
                source={{ uri: 'https://3dwarehouse.sketchup.com/ar-view/u8c5cb3d2-7f71-46d6-be7e-40281aa9cb71' }}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                onError={handleLoadError}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                onShouldStartLoadWithRequest={(request) => {
                  // Intercept AR view requests
                  if (request.url.includes('scene-viewer') || request.url.includes('ar-view')) {
                    handleARView(selectedPlace);
                    return false;
                  }
                  return true;
                }}
                injectedJavaScript={INITIAL_CAMERA_SETTINGS}
                style={styles.webview}
                onMessage={handleWebViewMessage}
              />
              {isLoading && (
                <View style={styles.customLoadingContainer}>
                  <View style={styles.loadingContent}>
                    <ActivityIndicator size="large" color="#2563eb" />
                    <Text style={styles.loadingText}>Loading 3D Model...</Text>
                  </View>
                </View>
              )}
              {isError && (
                <View style={styles.customLoadingContainer}>
                  <View style={styles.loadingContent}>
                    <Text style={styles.errorText}>Failed to load 3D Model</Text>
                    <TouchableOpacity 
                      style={styles.retryButton}
                      onPress={() => {
                        setIsError(false);
                        webViewRef.current?.reload();
                      }}
                    >
                      <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>

          <ScrollView 
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          >
            <View style={styles.suggestedSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Places</Text>
                <TouchableOpacity onPress={handleSeeAll}>
                  <Text style={styles.seeAllButton}>See All</Text>
                </TouchableOpacity>
              </View>
              {suggestedPlaces.map(renderPlaceCard)}
            </View>
          </ScrollView>
        </>
      ) : (
        <>
          <View style={styles.allPlacesHeader}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.allPlacesTitle}>All Places</Text>
          </View>

          <View style={styles.allPlacesContainer}>
            {suggestedPlaces.map(place => (
              <TouchableOpacity key={place.id} style={[styles.placeCard, styles.elevation]}>
                <Image source={place.image} style={styles.placeImage} />
                <View style={styles.placeInfo}>
                  <View style={styles.placeHeader}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryText}>{place.category}</Text>
                    </View>
                  </View>
                  <Text style={styles.placeDescription} numberOfLines={2}>
                    {place.description}
                  </Text>
                  <Text style={styles.distanceText}>Approximately {place.distance}</Text>
                  <TouchableOpacity 
                    style={styles.galleryButton}
                    onPress={() => handleViewGallery(place)}
                  >
                    <Text style={styles.galleryButtonText}>View Gallery</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <GalleryModal
        visible={modalVisible}
        images={selectedPlace?.gallery || []}
        placeName={selectedPlace?.name || ''}
        onClose={() => {
          setModalVisible(false);
          setSelectedPlace(null);
        }}
      />

      {showVideo && (
        <View style={[styles.videoOverlay, { 
          position: 'absolute',
          width: '100%',
          height: height * 0.6,
          left: 0,
          top: height * 0.2,
          borderRadius: 20,
        }]}>
          <Video
            ref={videoRef}
            source={require('../../assets/images/lagoon.mp4')}
            style={[styles.video, { borderRadius: 20 }]}
            resizeMode="cover"
            shouldPlay
            isLooping={false}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setShowVideo(false);
              }
            }}
          />
          <TouchableOpacity 
            style={styles.closeVideoButton}
            onPress={() => setShowVideo(false)}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#800000',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    letterSpacing: 0.3,
  },
  fixedViewerContainer: {
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  webviewContainer: {
    flex: 1,
    borderRadius: 20,
  },
  suggestedSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  seeAllButton: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    minHeight: 164,
  },
  placeImage: {
    width: 120,
    height: 140,
    borderRadius: 12,
    margin: 12,
  },
  placeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    minWidth: 180,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  categoryText: {
    color: '#4b5563',
    fontSize: 12,
    fontWeight: '600',
  },
  placeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
    flex: 1,
  },
  placeFooter: {
    alignItems: 'flex-end',
  },
  galleryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-end',
    minWidth: 100,
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  hidden: {
    opacity: 0,
  },
  customLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: '500',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  galleryGrid: {
    padding: 8,
  },
  galleryImageContainer: {
    flex: 1,
    margin: 4,
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 1,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  allPlacesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  allPlacesTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  allPlacesContainer: {
    padding: 20,
    paddingTop: 10,
  },
  mapSection: {
    marginTop: 16,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  mapHeader: {
    marginBottom: 10,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  mapSubtitle: {
    fontSize: 14,
    color: '#666',
    letterSpacing: 0.1,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  lastCard: {
    marginBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  directionsButton: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    width: 'auto',
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
    flexShrink: 1,
  },
  galleryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    width: 100,
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  videoOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  closeVideoButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    zIndex: 1001,
  },
  distanceText: {
    fontSize: 14,
    color: '#800000',
    marginTop: 4,
    marginBottom: 8,
    fontStyle: 'italic',
  },
});

export default Home