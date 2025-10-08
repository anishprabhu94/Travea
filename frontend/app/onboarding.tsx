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

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelectAnswer = (option: string) => {
    const currentAnswers = answers[currentQuestion.id] || [];
    
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

      <View style={styles.radialGlowContainer}>
        <View style={styles.radialGlow} />
      </View>

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
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => handleSelectAnswer(option)}
                style={styles.bubbleWrapper}
              >
                {selected ? (
                  <View style={styles.selectedBubbleContainer}>
                    <LinearGradient
                      colors={['#B89361', '#C9A96D']}
                      style={styles.selectedBubble}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.bubbleTextSelected}>{option}</Text>
                    </LinearGradient>
                    <View style={styles.selectedGlow} />
                  </View>
                ) : (
                  <BlurView intensity={30} tint="light" style={styles.bubble}>
                    <View style={styles.bubbleInner}>
                      <View style={styles.innerGlow} />
                      <Text style={styles.bubbleText}>{option}</Text>
                    </View>
                  </BlurView>
                )}
              </TouchableOpacity>
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
          <View style={styles.nextButtonGlow} />
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
  radialGlowContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  radialGlow: {
    width: width * 1.2,
    height: height * 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: width,
    opacity: 0.8,
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
    justifyContent: 'space-between',
    gap: 12,
  },
  bubbleWrapper: {
    width: (width - 60) / 2,
    marginBottom: 4,
  },
  bubble: {
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    minHeight: 70,
    justifyContent: 'center',
  },
  bubbleInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: 'relative',
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.10)',
    opacity: 0.5,
  },
  bubbleText: {
    fontSize: 16,
    color: '#F2F2F2',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  selectedBubbleContainer: {
    position: 'relative',
  },
  selectedBubble: {
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 70,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 109, 0.5)',
    ...Platform.select({
      ios: {
        shadowColor: '#C9A96D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(201, 169, 109, 0.3)',
      },
    }),
  },
  selectedGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
    backgroundColor: 'rgba(201, 169, 109, 0.2)',
    zIndex: -1,
    transform: [{ scale: 1.05 }],
  },
  bubbleTextSelected: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
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
  nextButtonGlow: {
    position: 'absolute',
    bottom: -8,
    left: '10%',
    right: '10%',
    height: 20,
    backgroundColor: 'rgba(201, 169, 109, 0.15)',
    borderRadius: 20,
    opacity: 0.6,
    zIndex: -1,
  },
});
