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
                    <Ionicons name="sparkles" size={16} color="#D9CBA0" />
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
                <Ionicons name="sparkles" size={16} color="#D9CBA0" />
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

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <LinearGradient
            colors={['rgba(13,13,13,0.98)', 'rgba(26,26,26,0.95)']}
            style={styles.inputGradient}
          >
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Ask your concierge..."
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  value={message}
                  onChangeText={setMessage}
                  onSubmitEditing={handleSend}
                  editable={!isLoading}
                  multiline
                  maxLength={500}
                />
              </View>
              
              <TouchableOpacity
                style={[styles.sendButton, (message.trim() && !isLoading) && styles.sendButtonActive]}
                onPress={handleSend}
                activeOpacity={0.8}
                disabled={!message.trim() || isLoading}
              >
                <LinearGradient
                  colors={
                    (message.trim() && !isLoading)
                      ? ['rgba(217,203,160,0.3)', 'rgba(217,203,160,0.2)']
                      : ['rgba(217,203,160,0.08)', 'rgba(217,203,160,0.04)']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sendButtonGradient}
                >
                  <Ionicons 
                    name="arrow-up" 
                    size={22} 
                    color={(message.trim() && !isLoading) ? '#D9CBA0' : 'rgba(217,203,160,0.4)'} 
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
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },

  // Header
  header: {
    paddingTop: 52,
    paddingBottom: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217,203,160,0.12)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(217,203,160,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(217,203,160,0.3)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  aiIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIndicatorDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#D9CBA0',
    ...Platform.select({
      ios: {
        shadowColor: '#D9CBA0',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 6,
      },
    }),
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  headerAction: {
    width: 42,
  },

  // Messages Container
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 140,
  },

  // Messages
  messageWrapper: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(217,203,160,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(217,203,160,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(217,203,160,0.4)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  messageBubbleContainer: {
    maxWidth: '72%',
  },
  messageBubble: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userBubble: {
    borderColor: 'rgba(217,203,160,0.35)',
    borderTopRightRadius: 6,
  },
  aiBubble: {
    borderColor: 'rgba(217,203,160,0.18)',
    borderTopLeftRadius: 6,
  },
  messageText: {
    fontSize: 15.5,
    lineHeight: 23,
    letterSpacing: 0.2,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  userMessageText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  aiMessageText: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '400',
  },

  // Loading
  loadingContainer: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 24,
  },
  loadingBubble: {
    maxWidth: '72%',
  },
  loadingBubbleGradient: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.18)',
    borderTopLeftRadius: 6,
  },
  loadingText: {
    fontSize: 22,
    color: '#D9CBA0',
    letterSpacing: 6,
    opacity: 0.7,
  },

  // Cards Section
  cardsSection: {
    marginTop: 18,
    marginBottom: 12,
    marginLeft: 54,
  },
  cardsScroll: {
    paddingRight: 24,
  },
  card: {
    width: 300,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(217,203,160,0.25)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  firstCard: {
    marginLeft: 0,
  },
  cardBg: {
    flex: 1,
  },
  cardBgStyle: {
    borderRadius: 24,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  cardName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
    letterSpacing: 0.3,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
    }),
  },
  cardTagline: {
    fontSize: 14.5,
    fontStyle: 'italic',
    color: '#D9CBA0',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 19,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  cardDurationPill: {
    backgroundColor: 'rgba(217,203,160,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.35)',
  },
  cardDuration: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#D9CBA0',
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Input Area
  inputContainer: {
    position: 'absolute',
    bottom: 74,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(217,203,160,0.12)',
  },
  inputGradient: {
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: 'rgba(217,203,160,0.09)',
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(217,203,160,0.22)',
    paddingHorizontal: 18,
    paddingVertical: 14,
    minHeight: 52,
    maxHeight: 130,
  },
  input: {
    fontSize: 15.5,
    color: '#FFFFFF',
    lineHeight: 21,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  sendButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
  },
  sendButtonActive: {
    borderWidth: 1.5,
    borderColor: 'rgba(217,203,160,0.4)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(217,203,160,0.5)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
    }),
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