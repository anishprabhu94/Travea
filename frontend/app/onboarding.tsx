import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
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
    
    // Scale animation: 0.98 -> 1.0
    const scaleAnim = getScaleAnim(option);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.0,
        duration: 150,
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
      
      <LinearGradient
        colors={['#000000', '#0C0C0C', '#0C0C0C', '#000000']}
        style={styles.background}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        locations={[0, 0.2, 0.8, 1]}
      />

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
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {currentQuestion.multiSelect && (
            <Text style={styles.multiSelectHint}>Select all that apply</Text>
          )}
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
                  activeOpacity={0.7}
                  onPress={() => handleSelectAnswer(option)}
                >
                  {selected ? (
                    <BlurView intensity={25} tint="light" style={styles.selectedBubble}>
                      <View style={styles.selectedBubbleInner}>
                        <Text style={styles.bubbleTextSelected}>{option}</Text>
                      </View>
                    </BlurView>
                  ) : (
                    <BlurView intensity={25} tint="light" style={styles.bubble}>
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
          style={[styles.nextButtonWrapper, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
          activeOpacity={0.8}
        >
          <BlurView intensity={25} tint="light" style={styles.nextButton}>
            <View style={styles.nextButtonInner}>
              <Text style={styles.nextButtonText}>
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
    backgroundColor: '#0C0C0C',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#F8F8F8',
    letterSpacing: 2,
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
    paddingHorizontal: 24,
  },
  questionContainer: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#F8F8F8',
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
  },
  bubbleWrapper: {
    width: (width - 80) / 2,
  },
  bubble: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 46,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.4)',
      },
    }),
  },
  bubbleInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  bubbleText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedBubble: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 109, 0.45)',
    minHeight: 46,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#C9A96D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(201, 169, 109, 0.4)',
      },
    }),
  },
  selectedBubbleInner: {
    backgroundColor: 'rgba(201, 169, 109, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  bubbleTextSelected: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
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
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButton: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 109, 0.4)',
  },
  nextButtonInner: {
    backgroundColor: 'rgba(201, 169, 109, 0.20)',
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    letterSpacing: 1.5,
  },
});
