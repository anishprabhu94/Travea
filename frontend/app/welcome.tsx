import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
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
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    // Fade in from black
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBeginPersonalization = () => {
    router.push('/onboarding');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Background with vignette */}
      <LinearGradient
        colors={['#000000', '#0C0C0C', '#0C0C0C', '#000000']}
        style={styles.background}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.2, 0.8, 1]}
      />

      {/* Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        {/* Logo */}
        <Text style={styles.logo}>TRAVEA</Text>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Welcome, {firstName}.
          </Text>
          
          <Text style={styles.subtext}>
            Let's learn a little about your travel style.
          </Text>
        </View>

        {/* Begin Button */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            onPress={handleBeginPersonalization}
            activeOpacity={0.8}
            style={styles.buttonWrapper}
          >
            <BlurView intensity={25} tint="light" style={styles.button}>
              <View style={styles.buttonInner}>
                <Text style={styles.buttonText}>BEGIN PERSONALIZATION</Text>
              </View>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
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
