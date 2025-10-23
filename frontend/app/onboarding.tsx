import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  ImageBackground,
  TextInput,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TraveaWordmark from '../components/TraveaWordmark';

const { width, height } = Dimensions.get('window');

interface Question {
  id: number;
  question: string;
  options: string[];
  multiSelect?: boolean;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Where do you live?',
    options: ['North America', 'South America', 'Europe', 'Africa', 'Middle East', 'Asia', 'Oceania'],
    multiSelect: true,
  },
  {
    id: 2,
    question: 'What kind of traveler are you?',
    options: ['Adventurer', 'Cultural Nomad', 'Wellness Seeker', 'City Explorer'],
    multiSelect: true,
  },
  {
    id: 3,
    question: 'What stays do you enjoy most?',
    options: ['Boutique Hotels', 'Luxury Resorts', 'Local Stays', 'Unique Properties'],
    multiSelect: true,
  },
  {
    id: 4,
    question: 'What excites you most?',
    options: ['Beaches', 'Food & Wine', 'Art & Culture', 'Adventure', 'Nightlife', 'History'],
    multiSelect: true,
  },
  {
    id: 5,
    question: 'How do you like to explore?',
    options: ['Guided Tours', 'Solo Discovery', 'Local Immersions', 'Hidden Gems'],
    multiSelect: true,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnims, setScaleAnims] = useState<{ [key: string]: Animated.Value }>({});

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Get or create scale animation for a bubble
  const getScaleAnim = (option: string) => {
    if (!scaleAnims[option]) {
      setScaleAnims(prev => ({ ...prev, [option]: new Animated.Value(1) }));
    }
    return scaleAnims[option] || new Animated.Value(1);
  };

  const handleSelectAnswer = (option: string) => {
    const currentAnswers = answers[currentQuestion.id] || [];
    
    // Scale animation: 0.98 -> 1.0 with 120ms duration
    const scaleAnim = getScaleAnim(option);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    
    if (currentQuestion.multiSelect) {
      if (currentAnswers.includes(option)) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: currentAnswers.filter(a => a !== option),
        });
      } else {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...currentAnswers, option],
        });
      }
    } else {
      setAnswers({
        ...answers,
        [currentQuestion.id]: [option],
      });
    }
  };

  const isSelected = (option: string) => {
    return answers[currentQuestion.id]?.includes(option) || false;
  };

  const canProceed = () => {
    return answers[currentQuestion.id] && answers[currentQuestion.id].length > 0;
  };

  const handleNext = () => {
    if (!canProceed()) return;

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        router.push('/landing');
      }
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      {/* Layer 1: BG (Image) */}
      <ImageBackground
        source={{
          uri: 'https://customer-assets.emergentagent.com/job_travea-auth/artifacts/zl0td0x2_output%20%286%29.jpg',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
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
        <View style={styles.bronzeOverlay} />
      </ImageBackground>

      {/* Layer 2: Header (Fixed 72px) - NOT nested inside Content */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TraveaWordmark size="small" />
          <View style={styles.profileIcon}>
            <Ionicons name="person-outline" size={16} color="#F8F8F8" />
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <Animated.View style={[styles.progressBarFill, { width: `${progress}%` }]}>
              <LinearGradient
                colors={['#B89361', '#C9A96D']}
                style={styles.progressGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
        </View>
      </View>

      {/* Layer 3: Content (Flex container for proper layout) */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Scrollable content area */}
        <View style={styles.scrollableContent}>
          {/* QuestionPane - Centered but left-aligned text */}
          <View style={styles.questionPane}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>

          {/* BubbleGrid */}
          <View style={styles.bubbleGrid}>
            {currentQuestion.options.map((option, index) => {
              const selected = isSelected(option);
              const scaleAnim = getScaleAnim(option);

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.bubbleWrapper,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleSelectAnswer(option)}
                  >
                    {selected ? (
                      <BlurView intensity={20} tint="light" style={styles.selectedBubble}>
                        <View style={styles.selectedBubbleInner}>
                          <Text style={styles.bubbleTextSelected}>{option}</Text>
                        </View>
                      </BlurView>
                    ) : (
                      <BlurView intensity={20} tint="light" style={styles.bubble}>
                        <View style={styles.bubbleInner}>
                          <Text style={styles.bubbleText}>{option}</Text>
                        </View>
                      </BlurView>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* Next Button - Pinned at bottom */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.nextButtonWrapper}
            onPress={handleNext}
            disabled={!canProceed()}
            activeOpacity={0.8}
          >
            <BlurView 
              intensity={25} 
              tint="light" 
              style={[
                styles.nextButton,
                !canProceed() ? styles.nextButtonDisabled : styles.nextButtonEnabled
              ]}
            >
              <View style={[
                styles.nextButtonInner,
                !canProceed() ? styles.nextButtonInnerDisabled : styles.nextButtonInnerEnabled
              ]}>
                {canProceed() && <View style={styles.nextButtonGlow} />}
                <Text style={[
                  styles.nextButtonText,
                  !canProceed() ? styles.nextButtonTextDisabled : styles.nextButtonTextEnabled
                ]}>
                  {currentStep === questions.length - 1 ? 'COMPLETE' : 'NEXT'}
                </Text>
              </View>
            </BlurView>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    margin: 0,
    padding: 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bronzeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(201, 169, 109, 0.08)',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    zIndex: 10,
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F8F8F8',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(248, 248, 248, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBarContainer: {
    paddingHorizontal: 0,
    marginBottom: 0,
  },
  progressBarBackground: {
    height: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
  },
  progressGradient: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    top: 160, // Shifted lower for better ergonomics and visual balance
    left: 24, // Left margin 24px
    right: 24, // Right margin 24px
    bottom: 24, // Add bottom constraint for proper NEXT button positioning
    flex: 1,
    justifyContent: 'space-between', // Space between scrollable content and bottom button
  },
  scrollableContent: {
    flex: 1,
    paddingTop: 24, // Increased for world-class spacing
  },
  bottomButtonContainer: {
    paddingBottom: 16, // Add some breathing room from bottom edge for thumb-friendliness
    marginTop: 20, // Space from content above
  },
  questionPane: {
    // Remove all background elements for clean, glowing text effect
    paddingVertical: 16, // Increased padding for text breathing room
    paddingHorizontal: 0, // Remove horizontal padding to align with bubbles
    marginBottom: 32, // Maintained spacing from answer bubbles
    justifyContent: 'flex-start', // Align to start (left)
    alignSelf: 'stretch', // Take full width
    width: '100%',
  },
  // questionContainer removed - no longer needed
  questionText: {
    fontSize: 22, // Keep current size for luxury presence
    fontWeight: '600', // Semi-bold as it was before
    color: '#F8F8F8', // Pure white with warmth
    lineHeight: 29, // 1.3 line height for balanced rhythm
    letterSpacing: 0.3, // Back to previous letter spacing
    textAlign: 'left', // Keep left alignment - this is working now
    width: '100%', // Keep full width for proper alignment
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium', // Back to previous sans-serif
      android: 'NeueHaasDisplayMedium', 
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
    ...Platform.select({
      ios: {
        // iOS text shadow for bronze glow
        shadowColor: 'rgba(201, 169, 109, 0.25)',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        shadowOpacity: 1,
      },
      android: {
        // Android text shadow
        textShadowColor: 'rgba(201, 169, 109, 0.25)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
      },
      web: {
        // Web text shadow with subtle bronze diffusion
        textShadow: '0 0 6px rgba(201, 169, 109, 0.25), 0 0 12px rgba(201, 169, 109, 0.18), 0 0 20px rgba(201, 169, 109, 0.12)',
      },
    }),
  },
  multiSelectHint: {
    fontSize: 14,
    color: '#C9A96D',
    marginTop: 8,
    fontWeight: '400',
    opacity: 0.8,
  },
  bubbleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16, // Increased vertical spacing between rows
    justifyContent: 'space-between', // Ensure proper column alignment
    marginBottom: 24, // Reduced since button is now pinned at bottom
  },
  bubbleWrapper: {
    width: '47%', // Slightly reduced to ensure perfect column alignment
    minWidth: 140,
    maxWidth: 160,
  },
  bubble: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.26)',
    height: 48,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 14,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 10px 28px -6px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(30px) saturate(130%)',
        WebkitBackdropFilter: 'blur(30px) saturate(130%)',
      },
    }),
  },
  bubbleInner: {
    backgroundColor: 'rgba(75, 75, 75, 0.45)', // Even lighter background for more elegant appearance
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        background: 'rgba(75, 75, 75, 0.45)',
      },
    }),
  },
  bubbleText: {
    fontSize: 15, // Back to previous size for classy fit in bubbles
    color: '#F2F2F2', // Back to previous color
    fontWeight: '500', // Back to previous weight
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium', // Back to previous sans-serif
      android: 'NeueHaasDisplayMedium', 
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  selectedBubble: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 109, 0.35)',
    height: 48,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(201, 169, 109, 0.28)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 24px rgba(201, 169, 109, 0.28)',
        backdropFilter: 'blur(20px) saturate(90%)',
        WebkitBackdropFilter: 'blur(20px) saturate(90%)',
      },
    }),
  },
  selectedBubbleInner: {
    backgroundColor: 'rgba(201, 169, 109, 0.55)', // Slightly more prominent for selected state
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        background: 'rgba(201, 169, 109, 0.55)',
      },
    }),
  },
  bubbleTextSelected: {
    fontSize: 15, // Back to previous size for classy fit in bubbles
    color: '#FFFFFF', // Back to previous bright white for selected
    fontWeight: '600', // Back to previous semibold for selected
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium', // Back to previous sans-serif
      android: 'NeueHaasDisplayMedium', 
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }),
  },
  // bottomContainer removed - Next button now in content flow
  nextButtonWrapper: {
    width: '100%',
    position: 'relative',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    height: 44,
    borderColor: 'rgba(201, 169, 109, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.30,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.30)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
      },
    }),
  },
  nextButtonDisabled: {
    borderColor: 'rgba(201, 169, 109, 0.35)',
  },
  nextButtonEnabled: {
    borderColor: '#C9A96D',
    backgroundColor: '#C9A96D',
  },
  nextButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  nextButtonInnerDisabled: {
    backgroundColor: 'rgba(201, 169, 109, 0.20)',
    ...Platform.select({
      web: {
        background: 'rgba(201, 169, 109, 0.20)',
      },
    }),
  },
  nextButtonInnerEnabled: {
    backgroundColor: 'rgba(201, 169, 109, 0.50)',
    ...Platform.select({
      web: {
        background: 'rgba(201, 169, 109, 0.50)',
      },
    }),
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
    zIndex: 1,
  },
  nextButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.65)',
  },
  nextButtonTextEnabled: {
    color: '#FFFFFF',
  },
  nextButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(201, 169, 109, 0.15)',
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 0 rgba(201, 169, 109, 0.2)',
      },
    }),
  },
});
