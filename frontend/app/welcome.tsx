import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const firstName = (params.name as string) || 'Traveler';
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [paneAnim] = useState(new Animated.Value(0.3));
  const [shimmerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Cinematic entrance animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(paneAnim, {
          toValue: 1,
          duration: 600,
          delay: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleBeginPersonalization = () => {
    // Bronze shimmer animation on press
    Animated.timing(shimmerAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.push('/onboarding');
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Aerial Beach Background */}
      <ImageBackground
        source={{
          uri: 'https://customer-assets.emergentagent.com/job_travea-auth/artifacts/zl0td0x2_output%20%286%29.jpg',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark matte gradient with bronze warmth */}
        <LinearGradient
          colors={[
            'rgba(0, 0, 0, 0.45)',
            'rgba(0, 0, 0, 0.55)',
            'rgba(0, 0, 0, 0.65)',
            'rgba(0, 0, 0, 0.75)',
          ]}
          style={styles.darkOverlay}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        
        {/* Bronze warmth overlay */}
        <View style={styles.bronzeOverlay} />

        {/* Content Container */}
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* TRAVEA Logo */}
          <Text style={styles.logo}>TRAVEA</Text>

          {/* Centered Frosted Glass Pane */}
          <Animated.View
            style={[
              styles.glassPaneContainer,
              {
                opacity: paneAnim,
              },
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.glassPane}>
              <View style={styles.glassPaneInner}>
                {/* Welcome Text */}
                <Text style={styles.welcomeText}>Welcome, Traveler.</Text>
                
                {/* Subtitle */}
                <Text style={styles.subtitleText}>
                  Let's learn a little about your travel style…
                </Text>

                {/* Begin Personalization Button */}
                <TouchableOpacity
                  onPress={handleBeginPersonalization}
                  activeOpacity={0.9}
                  style={styles.beginButton}
                >
                  <BlurView intensity={25} tint="light" style={styles.beginButtonBlur}>
                    <Animated.View 
                      style={[
                        styles.beginButtonInner,
                        {
                          opacity: shimmerAnim.interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [1, 0.8, 1],
                          }),
                        },
                      ]}
                    >
                      {/* Inner Bronze Glow */}
                      <View style={styles.buttonGlow} />
                      <Text style={styles.beginButtonText}>BEGIN PERSONALIZATION</Text>
                    </Animated.View>
                  </BlurView>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C0C',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 46,
    fontWeight: '700',
    color: '#F8F8F8',
    letterSpacing: 4,
    marginBottom: 60,
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
  },
  buttonWrapper: {
    position: 'relative',
  },
  button: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 109, 0.4)',
  },
  buttonInner: {
    backgroundColor: 'rgba(201, 169, 109, 0.20)',
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 1.5,
  },
  buttonGlow: {
    position: 'absolute',
    bottom: -10,
    left: '15%',
    right: '15%',
    height: 24,
    backgroundColor: 'rgba(201, 169, 109, 0.2)',
    borderRadius: 24,
    opacity: 0.8,
    zIndex: -1,
  },
});
