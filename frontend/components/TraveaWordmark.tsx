import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

interface TraveaWordmarkProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

export default function TraveaWordmark({ size = 'medium', style }: TraveaWordmarkProps) {
  const sizeStyles = {
    small: {
      fontSize: 18,
      letterSpacing: 4,
      lineHeight: 22,
    },
    medium: {
      fontSize: 24,
      letterSpacing: 6,
      lineHeight: 30,
    },
    large: {
      fontSize: 32,
      letterSpacing: 8,
      lineHeight: 40,
    },
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.wordmark, sizeStyles[size]]}>
        TR
        <Text style={styles.macronA}>Ā</Text>
        VEA
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordmark: {
    color: '#F6F4EF', // Soft ivory for dark theme
    fontWeight: '300', // Light weight for monoline effect
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Avenir Next', // Tall geometric sans-serif
      android: 'Roboto', // Clean geometric alternative
      web: 'Avenir Next, "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      ios: {
        // iOS text shadow for gentle ambient glow
        shadowColor: 'rgba(246, 244, 239, 0.15)',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
        shadowOpacity: 1,
      },
      android: {
        // Android text shadow
        textShadowColor: 'rgba(246, 244, 239, 0.15)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      },
      web: {
        // Web text shadow with subtle ambient glow
        textShadow: '0 0 6px rgba(246, 244, 239, 0.15), 0 0 12px rgba(246, 244, 239, 0.08), 0 0 20px rgba(246, 244, 239, 0.04)',
      },
    }),
  },
  macronA: {
    // Special styling for the A with macron - inherits parent styles
  },
});