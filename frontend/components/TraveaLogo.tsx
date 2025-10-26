import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';

interface TraveaLogoProps {
  variant?: 'white' | 'bronze';
  animated?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const TraveaLogo: React.FC<TraveaLogoProps> = ({ 
  variant = 'white', 
  animated = false,
  size = 'large' 
}) => {
  const planeAnim = useRef(new Animated.Value(0)).current;

  // Size configurations
  const sizeConfig = {
    small: { width: 150, height: 50, fontSize: 24 },
    medium: { width: 200, height: 70, fontSize: 32 },
    large: { width: 280, height: 90, fontSize: 46 },
  };

  const { width, height, fontSize } = sizeConfig[size];

  useEffect(() => {
    if (animated) {
      // Continuous ascending animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(planeAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(planeAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animated]);

  // Colors
  const textColor = variant === 'bronze' ? '#F8F8F8' : '#F8F8F8';
  const planeColor = variant === 'bronze' ? '#C9A96D' : '#F8F8F8';

  // Calculate plane position along V diagonal
  // V is approximately at position 3 of 6 letters
  // The V diagonal goes from bottom-left to top-middle
  const vPositionX = width * 0.52; // Center of V
  const vPositionY = height * 0.45; // Middle of V height

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {/* TRAVEA Text with letter-spacing */}
        <SvgText
          fill={textColor}
          fontSize={fontSize}
          fontWeight="700"
          letterSpacing={4}
          x={width / 2}
          y={height / 2 + fontSize / 3}
          textAnchor="middle"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          TRAVEA
        </SvgText>

        {/* Minimalist Plane Icon - Geometric Design */}
        {/* Positioned along V diagonal */}
        <G
          transform={`translate(${vPositionX}, ${vPositionY}) rotate(-35)`}
          opacity={animated ? 0.9 : 1}
        >
          {/* Plane body (fuselage) */}
          <Path
            d="M 0 0 L 12 0 L 12 1.5 L 0 1.5 Z"
            fill={planeColor}
          />
          
          {/* Main wings */}
          <Path
            d="M 3 0 L 3 -6 L 4.5 -6 L 4.5 0 Z"
            fill={planeColor}
          />
          <Path
            d="M 3 1.5 L 3 7.5 L 4.5 7.5 L 4.5 1.5 Z"
            fill={planeColor}
          />
          
          {/* Tail wings (smaller) */}
          <Path
            d="M 10 0 L 10 -3 L 11 -3 L 11 0 Z"
            fill={planeColor}
          />
          <Path
            d="M 10 1.5 L 10 4.5 L 11 4.5 L 11 1.5 Z"
            fill={planeColor}
          />
          
          {/* Nose (pointed front) */}
          <Path
            d="M 0 0 L -2 0.75 L 0 1.5 Z"
            fill={planeColor}
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TraveaLogo;
