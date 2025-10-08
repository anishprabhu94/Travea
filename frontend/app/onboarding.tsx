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
    question: 'What type of traveler best describes you?',
    options: ['Adventurer', 'City Explorer', 'Wellness Seeker', 'Cultural Nomad', 'Lux Traveler'],
  },
  {
    id: 2,
    question: 'What kind of stays do you enjoy most?',
    options: ['Boutique Hotels', 'Luxury Resorts', 'Cozy Airbnbs', 'Budget-Friendly'],
  },
  {
    id: 3,
    question: 'What kind of experiences excite you?',
    options: ['Beaches', 'Nature Bath', 'Food & Wine', 'Art & Culture', 'Nightlife', 'Shopping'],
    multiSelect: true,
  },
  {
    id: 4,
    question: 'How do you usually like to explore?',
    options: ['Solo', 'With Friends', 'With Family', 'Guided Experiences', 'Spontaneous'],
  },
  {
    id: 5,
    question: "What's your ideal trip length?",
    options: ['Weekend Getaway', '1 Week', '2 Weeks', 'Long Stay', 'No Fixed Plan'],
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
      
      {/* Aerial Beach Background - Same as Welcome Screen */}
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
      </ImageBackground>

      <View style={styles.topBar}>
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

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Frosted Glass Question Pane */}
        <View style={styles.questionPaneContainer}>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
          </View>
        </View>

        <View style={styles.bubblesGrid}>
          {currentQuestion.options.map((option, index) => {
            const selected = isSelected(option);
            const scaleAnim = getScaleAnim(option);
            return (
              <Animated.View
                key={index}
                style={[
                  styles.bubbleWrapper,
                  { transform: [{ scale: scaleAnim }] }
                ]}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => handleSelectAnswer(option)}
                >
                  {selected ? (
                    <BlurView intensity={30} tint="light" style={styles.selectedBubble}>
                      <View style={styles.selectedBubbleInner}>
                        <Text style={styles.bubbleTextSelected}>{option}</Text>
                      </View>
                    </BlurView>
                  ) : (
                    <BlurView intensity={30} tint="light" style={styles.bubble}>
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
      </Animated.View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.nextButtonWrapper]}
          onPress={handleNext}
          disabled={!canProceed()}
          activeOpacity={0.8}
        >
          <BlurView 
            intensity={30} 
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  bronzeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(201, 169, 109, 0.08)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 12,
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
    paddingHorizontal: 24,
    marginBottom: 24,
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
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  questionPaneContainer: {
    backgroundColor: 'rgba(25, 25, 25, 0.4)',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginBottom: 32,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
      },
    }),
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#F2F2F2',
    lineHeight: 32,
    letterSpacing: 0.3,
  },
  multiSelectHint: {
    fontSize: 14,
    color: '#C9A96D',
    marginTop: 8,
    fontWeight: '400',
    opacity: 0.8,
  },
  bubblesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  bubbleWrapper: {
    minWidth: 156,
    flex: 1,
    maxWidth: '48%',
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
    backgroundColor: 'rgba(40, 40, 40, 0.45)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        background: 'rgba(40, 40, 40, 0.45)',
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
    borderColor: 'rgba(201, 169, 109, 0.55)',
    height: 48,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.40,
        shadowRadius: 15,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 12px 30px -6px rgba(0, 0, 0, 0.40), 0 0 0 2px rgba(201, 169, 109, 0.18)',
        backdropFilter: 'blur(30px) saturate(130%)',
        WebkitBackdropFilter: 'blur(30px) saturate(130%)',
      },
    }),
  },
  selectedBubbleInner: {
    backgroundColor: 'rgba(201, 169, 109, 0.45)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        background: 'rgba(201, 169, 109, 0.45)',
      },
    }),
  },
  bubbleTextSelected: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  nextButtonWrapper: {
    width: '100%',
    position: 'relative',
  },
  nextButton: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    height: 56,
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
  nextButtonDisabled: {
    borderColor: 'rgba(201, 169, 109, 0.35)',
  },
  nextButtonEnabled: {
    borderColor: '#C9A96D',
    backgroundColor: '#C9A96D',
  },
  nextButtonInner: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  nextButtonInnerDisabled: {
    backgroundColor: 'rgba(201, 169, 109, 0.20)',
    ...Platform.select({
      web: {
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 42%)',
      },
    }),
  },
  nextButtonInnerEnabled: {
    backgroundColor: '#C9A96D',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  nextButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.65)',
  },
  nextButtonTextEnabled: {
    color: '#FFFFFF',
  },
});
