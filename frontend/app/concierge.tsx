import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
  ImageBackground,
} from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import Constants from 'expo-constants'

export default function Concierge() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Good evening. I'm your Trāvea concierge. How may I assist with your journey today?',
      sender: 'ai',
      cards: [],
      cardType: null
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef(null)

  const backendUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 'http://localhost:8001'

  const handleSend = async () => {
    if (message.trim() && !isLoading) {
      const userMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'user',
        cards: [],
        cardType: null
      }
      
      setMessages(prev => [...prev, userMessage])
      setMessage('')
      setIsLoading(true)

      try {
        const response = await fetch(`${backendUrl}/api/concierge/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.text,
            user_has_trip: false,
            session_id: 'demo-session'
          })
        })

        if (response.ok) {
          const data = await response.json()
          const aiMessage = {
            id: (Date.now() + 1).toString(),
            text: data.message,
            sender: 'ai',
            cards: data.cards || [],
            cardType: data.card_type
          }
          setMessages(prev => [...prev, aiMessage])
        } else {
          throw new Error('API error')
        }
      } catch (error) {
        console.error('Concierge error:', error)
        const errorMessage = {
          id: (Date.now() + 1).toString(),
          text: 'I apologize — let me reconnect. Please try again in a moment.',
          sender: 'ai',
          cards: [],
          cardType: null
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true })
    }
  }, [messages])

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['rgba(13,13,13,0.98)', 'rgba(26,26,26,0.95)']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={20} color="#D9CBA0" />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={styles.aiIndicator}>
                <View style={styles.aiIndicatorDot} />
                <Text style={styles.headerTitle}>Trāvea Concierge</Text>
              </View>
            </View>
            
            <View style={styles.headerAction} />
          </View>
        </LinearGradient>

        {/* Messages Area */}
        <ScrollView 
          ref={scrollRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg, index) => (
            <View key={msg.id}>
              <View 
                style={[
                  styles.messageWrapper,
                  msg.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper
                ]}
              >
                {msg.sender === 'ai' && (
                  <View style={styles.aiAvatar}>
                    <Ionicons name="sparkles" size={14} color="#D9CBA0" />
                  </View>
                )}
                
                <View style={styles.messageBubbleContainer}>
                  <LinearGradient
                    colors={
                      msg.sender === 'user'
                        ? ['rgba(217,203,160,0.25)', 'rgba(217,203,160,0.15)']
                        : ['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.03)']
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                      styles.messageBubble,
                      msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                    ]}
                  >
                    <Text style={[
                      styles.messageText,
                      msg.sender === 'user' ? styles.userMessageText : styles.aiMessageText
                    ]}>
                      {msg.text}
                    </Text>
                  </LinearGradient>
                </View>
              </View>

              {/* Card Carousel below AI messages */}
              {msg.sender === 'ai' && msg.cards && msg.cards.length > 0 && (
                <View style={styles.cardsSection}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.cardsScroll}
                  >
                    {msg.cards.map((card, cardIndex) => (
                      <TouchableOpacity
                        key={card.id}
                        style={[styles.card, cardIndex === 0 && styles.firstCard]}
                        activeOpacity={0.9}
                        onPress={() => {
                          if (msg.cardType === 'city') {
                            router.push('/destination')
                          } else if (msg.cardType === 'circuit') {
                            router.push('/multi-city-destination')
                          }
                        }}
                      >
                        <ImageBackground
                          source={{ uri: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' }}
                          style={styles.cardBg}
                          imageStyle={styles.cardBgStyle}
                        >
                          <LinearGradient
                            colors={['rgba(0,0,0,0.1)', 'rgba(13,13,13,0.85)']}
                            style={styles.cardGradient}
                          />
                          <View style={styles.cardContent}>
                            <Text style={styles.cardName}>{card.name}</Text>
                            <Text style={styles.cardTagline}>{card.tagline}</Text>
                            {card.subtitle && (
                              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                            )}
                            {card.duration && (
                              <View style={styles.cardDurationPill}>
                                <Text style={styles.cardDuration}>{card.duration}</Text>
                              </View>
                            )}
                          </View>
                        </ImageBackground>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          ))}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles" size={14} color="#D9CBA0" />
              </View>
              <View style={styles.loadingBubble}>
                <LinearGradient
                  colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.03)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loadingBubbleGradient}
                >
                  <Text style={styles.loadingText}>•••</Text>
                </LinearGradient>
              </View>
            </View>
          )}
      </ScrollView>

      {/* Static Input Area */}
      <View style={styles.inputContainer}>
        <LinearGradient
          colors={['rgba(13,13,13,0.98)', 'rgba(26,26,26,0.95)']}
          style={styles.inputGradient}
        >
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputPlaceholder}>Ask your concierge...</Text>
            </View>
            
            <TouchableOpacity
              style={styles.sendButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.04)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.sendButtonGradient}
              >
                <Ionicons 
                  name="arrow-up" 
                  size={22} 
                  color="rgba(217,203,160,0.4)" 
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Bottom Dock */}
      <View style={styles.bottomDock}>
        <BlurView intensity={20} tint="light" style={styles.dockContainer}>
          <View style={styles.dockContent}>
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/landing')}
            >
              <Ionicons name="home" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/bookings')}
            >
              <Ionicons name="calendar" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>Trip Canvas</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
              onPress={() => router.push('/trips')}
            >
              <Ionicons name="bookmark-outline" size={22} color="rgba(255,255,255,0.7)" />
              <Text style={styles.dockLabelInactive}>My Trips</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.dockItem} 
              activeOpacity={0.8}
            >
              <Ionicons name="chatbubble-ellipses" size={22} color="#D9CBA0" />
              <Text style={styles.dockLabelActive}>Concierge</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  // Header
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217,203,160,0.15)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(217,203,160,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  aiIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9CBA0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(217,203,160,0.8)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(217,203,160,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Messages Container
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },

  // Welcome Section
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    alignItems: 'center',
    gap: 12,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Suggested Prompts
  promptsSection: {
    marginBottom: 32,
  },
  promptsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  promptsGrid: {
    gap: 12,
  },
  promptCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    overflow: 'hidden',
  },
  promptCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  promptText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Messages
  messagesList: {
    gap: 20,
  },
  messageWrapper: {
    flexDirection: 'row',
    gap: 12,
  },
  aiAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(217,203,160,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBubbleContainer: {
    maxWidth: '75%',
  },
  messageBubble: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  aiBubble: {
    borderColor: 'rgba(217,203,160,0.15)',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  aiMessageText: {
    color: 'rgba(255,255,255,0.9)',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  aiMessageTime: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'left',
  },

  // Input Area
  inputContainer: {
    position: 'absolute',
    bottom: 72,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(217,203,160,0.15)',
  },
  inputGradient: {
    padding: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: 'rgba(217,203,160,0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: 'center',
  },
  inputPlaceholder: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom Dock
  bottomDock: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  dockContainer: {
    width: '92%',
    height: 60,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      },
    }),
  },
  dockContent: {
    flex: 1,
    backgroundColor: 'rgba(25,25,25,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dockItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dockLabelInactive: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  dockLabelActive: {
    fontSize: 11,
    color: '#D9CBA0',
    marginTop: 4,
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'Inter',
      android: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
})