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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
        router.push('/home');
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
          <Text style={styles.logoText}>TRAVEA</Text>
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
    backgroundColor: 'rgba(85, 85, 85, 0.4)', // Lighter background for elegant appearance
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)', // Slightly more visible for elegant definition
    paddingVertical: 12, // Reduced padding for slimmer appearance
    paddingHorizontal: 20, // 20px horizontal padding maintained
    marginBottom: 32, // Increased spacing from answer bubbles for better visual separation
    height: 52, // Reduced height for slim, elegant appearance
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(201, 169, 109, 0.4)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        backdropFilter: 'blur(30px)', // 30px backdrop blur maintained
        WebkitBackdropFilter: 'blur(30px)',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(201, 169, 109, 0.25), 0 0 40px rgba(201, 169, 109, 0.12)', // Enhanced bronze glow for prominence
      },
    }),
  },
  // questionContainer removed - no longer needed
  questionText: {
    fontSize: 18, // Reduced font size for more refined appearance
    fontWeight: '600', // Weight 600 maintained
    color: 'rgba(255, 255, 255, 0.92)',
    lineHeight: 23, // 1.3 * 18px = 23.4px, rounded to 23
    letterSpacing: 0.3,
    textAlign: 'left', // Left-aligned as requested
    maxWidth: '100%', // Full width for proper left alignment
    fontFamily: Platform.select({
      ios: 'NeueHaasDisplayMedium',
      android: 'NeueHaasDisplayMedium', 
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
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
    backgroundColor: 'rgba(60, 60, 60, 0.4)', // Lighter background for elegant appearance
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        background: 'rgba(60, 60, 60, 0.4)',
      },
    }),
  },
  bubbleText: {
    fontSize: 15,
    color: '#F2F2F2',
    fontWeight: '500',
    textAlign: 'center',
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
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
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
