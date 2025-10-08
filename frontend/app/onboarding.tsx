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
  const [scaleAnim] = useState(new Animated.Value(1));

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSelectAnswer = (option: string) => {
    const currentAnswers = answers[currentQuestion.id] || [];
    
    if (currentQuestion.multiSelect) {
      // Multi-select: toggle answer
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
      // Single select: replace answer
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

    // Fade out animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
        // Fade in animation
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        // Complete onboarding
        router.push('/home');
      }
    });
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

      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.logoText}>TRAVEA</Text>
        <View style={styles.profileIcon}>
          <Ionicons name="person-outline" size={16} color="#F8F8F8" />
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={['#B89361', '#C9A96D']}
            style={[styles.progressBarFill, { width: `${progress}%` }]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
      </View>

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Question Text */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          {currentQuestion.multiSelect && (
            <Text style={styles.multiSelectHint}>Select all that apply</Text>
          )}
        </View>

        {/* Answer Bubbles */}
        <View style={styles.answersContainer}>
          {currentQuestion.options.map((option, index) => {
            const selected = isSelected(option);
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => handleSelectAnswer(option)}
              >
                {selected ? (
                  <LinearGradient
                    colors={['#B89361', '#C9A96D']}
                    style={styles.answerBubble}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.answerTextSelected}>{option}</Text>
                  </LinearGradient>
                ) : (
                  <BlurView intensity={25} tint="light" style={styles.answerBubble}>
                    <View style={styles.answerBubbleInner}>
                      <Text style={styles.answerText}>{option}</Text>
                    </View>
                  </BlurView>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.View>

      {/* Next Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            !canProceed() && styles.nextButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={!canProceed()}
          activeOpacity={0.8}
        >
          <View style={styles.nextButtonInner}>
            <Text style={styles.nextButtonText}>
              {currentStep === questions.length - 1 ? 'COMPLETE' : 'NEXT'}
            </Text>
          </View>
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
    marginBottom: 32,
  },
  progressBarBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  questionContainer: {
    marginTop: 40,
    marginBottom: 40,
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
  },
  answersContainer: {
    gap: 12,
  },
  answerBubble: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
      },
    }),
  },
  answerBubbleInner: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  answerText: {
    fontSize: 16,
    color: '#F2F2F2',
    fontWeight: '400',
    textAlign: 'center',
  },
  answerTextSelected: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: 'rgba(201, 169, 109, 0.25)',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 109, 0.4)',
  },
  nextButtonDisabled: {
    opacity: 0.4,
  },
  nextButtonInner: {
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
