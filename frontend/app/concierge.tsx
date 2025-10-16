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
  Dimensions,
} from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import Constants from 'expo-constants'

const { width } = Dimensions.get('window')

const SUGGESTION_CHIPS = [
  { id: '1', icon: 'sparkles', text: 'Inspire me for next summer' },
  { id: '2', icon: 'sunny', text: 'Show me weekend getaways' },
  { id: '3', icon: 'restaurant', text: 'Find iconic restaurants' },
  { id: '4', icon: 'map', text: 'Help me plan my Italy trip' },
]

export default function ConciergeV2() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showGreeting, setShowGreeting] = useState(true)
  const scrollRef = useRef(null)

  // Use environment variable directly
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || Constants.expoConfig?.extra?.EXPO_PUBLIC_BACKEND_URL || 'https://glass-voyage.preview.emergentagent.com'
  
  console.log('Concierge - Backend URL:', backendUrl)

  const handleChipPress = async (chipText: string) => {
    setMessage(chipText)
    setShowGreeting(false)
    
    // Auto-send the chip text
    const userMessage = {
      id: Date.now().toString(),
      text: chipText,
      sender: 'user',
      cards: [],
      cardType: null
    }
    
    setMessages([userMessage])
    setIsLoading(true)

    try {
      const response = await fetch(`${backendUrl}/api/concierge/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chipText,
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
      setMessage('')
    }
  }

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
      setShowGreeting(false)

      try {
        console.log('Backend URL:', backendUrl)
        console.log('Sending message:', userMessage.text)
        
        const response = await fetch(`${backendUrl}/api/concierge/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.text,
            user_has_trip: false,
            session_id: 'demo-session'
          })
        })

        console.log('Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Response data:', data)
          const aiMessage = {
            id: (Date.now() + 1).toString(),
            text: data.message,
            sender: 'ai',
            cards: data.cards || [],
            cardType: data.card_type
          }
          setMessages(prev => [...prev, aiMessage])
        } else {
          const errorText = await response.text()
          console.error('API error response:', errorText)
          throw new Error(`API error: ${response.status}`)
        }
      } catch (error) {
        console.error('Concierge error details:', error)
        console.error('Error message:', error.message)
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
        {/* Background Atmosphere */}
        <LinearGradient
          colors={['#0D0D0D', '#1A1A1A', '#0D0D0D']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Header Bar */}
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
              <Ionicons name="chevron-back" size={18} color="#D9CBA0" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <View style={styles.titleRow}>
                <View style={styles.breathingDot} />
                <Text style={styles.headerTitle}>Trāvea Concierge</Text>
              </View>
              <Text style={styles.headerSubtitle}>Your AI Travel Assistant for curated journeys</Text>
            </View>
            
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#D9CBA0" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Main Content */}
        <ScrollView 
          ref={scrollRef}
          style={styles.mainContent}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Greeting Pane */}
          {showGreeting && (
            <View style={styles.greetingContainer}>
              <BlurView intensity={30} tint="dark" style={styles.greetingCard}>
                <LinearGradient
                  colors={['rgba(217,203,160,0.12)', 'rgba(217,203,160,0.06)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.greetingGradient}
                >
                  <Text style={styles.greetingText}>
                    Good evening. I'm your Trāvea Concierge.{'\n'}
                    How may I assist with your journey today?
                  </Text>
                  <Text style={styles.greetingSignature}>— Aurelia, Trāvea Concierge</Text>
                </LinearGradient>
              </BlurView>
            </View>
          )}

          {/* Smart Suggestion Chips */}
          {showGreeting && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsContainer}
            >
              {SUGGESTION_CHIPS.map((chip, index) => (
                <TouchableOpacity
                  key={chip.id}
                  style={[styles.chip, index === 0 && styles.firstChip]}
                  onPress={() => handleChipPress(chip.text)}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={20} tint="dark" style={styles.chipBlur}>
                    <LinearGradient
                      colors={['rgba(217,203,160,0.15)', 'rgba(217,203,160,0.08)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.chipGradient}
                    >
                      <Ionicons name={chip.icon} size={14} color="#D9CBA0" />
                      <Text style={styles.chipText}>{chip.text}</Text>
                    </LinearGradient>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Chat Conversation Zone */}
          {messages.map((msg) => (
            <View key={msg.id}>
              <View 
                style={[
                  styles.messageWrapper,
                  msg.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper
                ]}
              >
                <View style={styles.messageBubbleContainer}>
                  {msg.sender === 'ai' ? (
                    <BlurView intensity={20} tint="dark" style={styles.aiMessageBlur}>
                      <LinearGradient
                        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.aiBubble}
                      >
                        <Text style={styles.aiMessageText}>{msg.text}</Text>
                      </LinearGradient>
                    </BlurView>
                  ) : (
                    <View style={styles.userBubble}>
                      <Text style={styles.userMessageText}>{msg.text}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Card Carousel */}
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
                          <BlurView intensity={15} tint="dark" style={styles.cardInfo}>
                            <Text style={styles.cardName}>{card.name}</Text>
                            <Text style={styles.cardTagline}>{card.tagline}</Text>
                          </BlurView>
                        </ImageBackground>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          ))}

          {/* Loading State */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <BlurView intensity={20} tint="dark" style={styles.loadingBlur}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.loadingBubble}
                >
                  <Text style={styles.loadingText}>•••</Text>
                </LinearGradient>
              </BlurView>
            </View>
          )}
        </ScrollView>

        {/* Context Strip */}
        <View style={styles.contextStrip}>
          <Text style={styles.contextText}>No active trip — ask me to create one</Text>
        </View>

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <BlurView intensity={30} tint="dark" style={styles.inputBlur}>
            <View style={styles.inputRow}>
              <View style={styles.inputIconLeft}>
                <Ionicons 
                  name={message.length > 0 ? 'airplane' : 'map-outline'} 
                  size={20} 
                  color="#D9CBA0" 
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Ask about destinations, experiences, or plans..."
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={message}
                onChangeText={setMessage}
                onSubmitEditing={handleSend}
                editable={!isLoading}
                multiline={false}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSend}
                activeOpacity={0.7}
                disabled={!message.trim() || isLoading}
              >
                <Ionicons 
                  name="paper-plane" 
                  size={20} 
                  color={message.trim() ? '#D9CBA0' : 'rgba(217,203,160,0.3)'} 
                />
              </TouchableOpacity>
            </View>
          </BlurView>
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
    paddingTop: 54,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217,203,160,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 14,
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  breathingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D9CBA0',
    ...Platform.select({
      ios: {
        shadowColor: '#D9CBA0',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#B9AE8B',
    marginTop: 4,
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  menuButton: {
    padding: 6,
  },

  // Main Content
  mainContent: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 24,
    paddingBottom: 180,
  },

  // Greeting Pane
  greetingContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  greetingCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
  },
  greetingGradient: {
    padding: 28,
  },
  greetingText: {
    fontSize: 17,
    lineHeight: 26,
    color: '#F5F5F5',
    fontWeight: '400',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  greetingSignature: {
    fontSize: 12,
    color: '#D9CBA0',
    fontStyle: 'italic',
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },

  // Suggestion Chips
  chipsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 12,
  },
  chip: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  firstChip: {
    marginLeft: 0,
  },
  chipBlur: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
    overflow: 'hidden',
  },
  chipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  chipText: {
    fontSize: 14,
    color: '#F5F5F5',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Messages
  messageWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  userMessageWrapper: {
    alignItems: 'flex-end',
  },
  aiMessageWrapper: {
    alignItems: 'flex-start',
  },
  messageBubbleContainer: {
    maxWidth: '80%',
  },
  aiMessageBlur: {
    borderRadius: 24,
    borderTopLeftRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  aiBubble: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  aiMessageText: {
    fontSize: 15.5,
    lineHeight: 23,
    color: 'rgba(255,255,255,0.92)',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  userBubble: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 24,
    borderTopRightRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  userMessageText: {
    fontSize: 15.5,
    lineHeight: 23,
    color: '#FFFFFF',
    fontWeight: '500',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Loading
  loadingContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  loadingBlur: {
    borderRadius: 24,
    borderTopLeftRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loadingBubble: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 24,
    color: '#D9CBA0',
    letterSpacing: 6,
  },

  // Cards
  cardsSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  cardsScroll: {
    paddingHorizontal: 20,
  },
  card: {
    width: 280,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.25)',
  },
  firstCard: {
    marginLeft: 0,
  },
  cardBg: {
    flex: 1,
  },
  cardBgStyle: {
    borderRadius: 20,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
  },
  cardName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  cardTagline: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#D9CBA0',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Context Strip
  contextStrip: {
    position: 'absolute',
    bottom: 142,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  contextText: {
    fontSize: 12,
    color: '#8E8E8E',
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Input Bar
  inputContainer: {
    position: 'absolute',
    bottom: 86,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  inputBlur: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(217,203,160,0.2)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  inputIconLeft: {
    width: 24,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  sendButton: {
    width: 28,
    alignItems: 'center',
  },

  // Bottom Dock
  bottomDock: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dockContainer: {
    width: '92%',
    height: 60,
    borderRadius: 28,
    overflow: 'hidden',
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
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
})
