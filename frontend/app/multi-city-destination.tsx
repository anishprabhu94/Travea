import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Platform,
  StyleSheet,
} from 'react-native'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'

// Multi-city circuit data
const multiCityCircuit = {
  cities: ['Amalfi', 'Ravello', 'Sorrento'],
  cityCodes: ['AMF', 'RAV', 'SOR'],
}

const cityDataMap = {
  'Amalfi': {
    name: 'Amalfi',
    subtitle: 'Where azure meets ancient stone',
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
  essenceTags: ['Azure Air', 'Lemon Calm', 'Cliff Light'],
  travelInfo: [
    { icon: 'calendar-outline', label: 'Apr–Jun', sublabel: 'Best Time' },
    { icon: 'card-outline', label: 'EUR', sublabel: 'Currency' },
    { icon: 'airplane-outline', label: 'NAP', sublabel: 'Airport' },
    { icon: 'time-outline', label: 'CET+1', sublabel: 'Time Zone' }
  ],
  poeticLine: 'Where time slows, and the sea hums.',
  discoveryCards: [
    {
      id: 'experiences',
      title: 'Experiences',
      subtext: 'Lemon groves · Cathedral echoes',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
    },
    {
      id: 'dining',
      title: 'Dining',
      subtext: 'Coastal flavors · Limoncello',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
    },
    {
      id: 'culture',
      title: 'Culture',
      subtext: 'Maritime heritage · Artisan craft',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
    },
    {
      id: 'nature',
      title: 'Nature',
      subtext: 'Hidden coves · Clifftop gardens',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
    }
  ],
  detailsExpansion: [
    { name: 'Villa Cimbrone Gardens', info: '9 AM–6 PM', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' },
    { name: 'Lemon Farm Tour', info: '€35, 2 hrs', image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' }
  ],
  essentials: {
    left: [
      { icon: 'calendar-outline', label: 'Best Time', value: 'Apr–Jun, Sep–Oct' },
      { icon: 'card-outline', label: 'Currency', value: 'Euro (EUR)' },
      { icon: 'chatbubble-outline', label: 'Language', value: 'Italian (English common)' },
      { icon: 'shirt-outline', label: 'Etiquette', value: 'Modest dress in churches' }
    ],
    right: [
      { icon: 'airplane-outline', label: 'Airport', value: 'Naples Intl (NAP)' },
      { icon: 'time-outline', label: 'Time Zone', value: 'CET+1' },
      { icon: 'bus-outline', label: 'Getting Around', value: 'Buses, ferries, walk' },
      { icon: 'restaurant-outline', label: 'Tipping', value: '10% common' }
    ]
  },
  insights: [
    { quote: 'Lemons here grow as large as grapefruits.', attribution: null },
    { quote: 'Every evening, church bells echo over the cliffs.', attribution: null },
    { quote: 'Paper has been made by hand here since 1220.', attribution: null }
  ],
  experiences: [
    {
      title: 'Lemon Grove Walk',
      subtext: '2 hrs · Ravello',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
    },
    {
      title: 'Villa Cimbrone Gardens',
      subtext: 'Views from infinity',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
    },
    {
      title: 'Hidden Coves by Boat',
      subtext: 'Rock, sea, and silence',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
    }
  ],
  foodCulture: [
    {
      icon: '🍝',
      title: 'Trattoria da Gemma',
      subtext: 'Sea salt on lips, limoncello sunsets',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
    },
    {
      icon: '🏛️',
      title: 'Paper Museum',
      subtext: 'Hands shaping history since 1220',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
    },
    {
      icon: '🍋',
      title: 'Amalfi Cathedral',
      subtext: 'Gold mosaics, evening bells',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
    }
  ],
  suggestedJourneys: [
    {
      title: 'The Lemon Coast Circuit',
      subtitle: '3 days · Amalfi → Ravello → Sorrento',
      description: 'Cliffs, calm, and citrus trails.',
      stops: [
        { code: 'AMF', name: 'Amalfi' },
        { code: 'RAV', name: 'Ravello' },
        { code: 'SOR', name: 'Sorrento' }
      ],
      images: [
        {
          url: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
          caption: 'Amalfi'
        },
        {
          url: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
          caption: 'Ravello'
        },
        {
          url: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
          caption: 'Sorrento'
        }
      ]
    },
    {
      title: 'Southern Escape',
      subtitle: '4 days · Positano → Capri → Amalfi',
      description: 'Boats, blues, and endless breeze.',
      stops: [
        { code: 'POS', name: 'Positano' },
        { code: 'CAP', name: 'Capri' },
        { code: 'AMF', name: 'Amalfi' }
      ],
      images: [
        {
          url: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
          caption: 'Positano'
        },
        {
          url: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
          caption: 'Capri'
        },
        {
          url: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
          caption: 'Amalfi'
        }
      ]
    }
  ]
  },
  'Ravello': {
    name: 'Ravello',
    subtitle: 'Where silence hums between lemon trees',
    heroImage: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
    essenceTags: ['Garden Heights', 'Musical Legacy', 'Silent Beauty'],
    travelInfo: [
      { icon: 'calendar-outline', label: 'Apr–Jun', sublabel: 'Best Time' },
      { icon: 'card-outline', label: 'EUR', sublabel: 'Currency' },
      { icon: 'airplane-outline', label: 'NAP', sublabel: 'Airport' },
      { icon: 'time-outline', label: 'CET+1', sublabel: 'Time Zone' }
    ],
    poeticLine: 'Gardens suspended above the world.',
    discoveryCards: [
      {
        id: 'experiences',
        title: 'Experiences',
        subtext: 'Villa gardens · Mountain paths',
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
      },
      {
        id: 'dining',
        title: 'Dining',
        subtext: 'Michelin star · Terrace views',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
      },
      {
        id: 'culture',
        title: 'Culture',
        subtext: 'Music festival · Historic villas',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
      },
      {
        id: 'nature',
        title: 'Nature',
        subtext: 'Terraced gardens · Infinity views',
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
      }
    ],
    detailsExpansion: [
      { name: 'Villa Rufolo', info: '9 AM–7 PM', image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' },
      { name: 'Concert at Terrace', info: 'Jul–Sep', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg' }
    ],
    essentials: {
      left: [
        { icon: 'calendar-outline', label: 'Best Time', value: 'Apr–Jun, Sep–Oct' },
        { icon: 'card-outline', label: 'Currency', value: 'Euro (EUR)' },
        { icon: 'chatbubble-outline', label: 'Language', value: 'Italian (English common)' },
        { icon: 'shirt-outline', label: 'Etiquette', value: 'Modest dress in churches' }
      ],
      right: [
        { icon: 'airplane-outline', label: 'Airport', value: 'Naples Intl (NAP)' },
        { icon: 'time-outline', label: 'Time Zone', value: 'CET+1' },
        { icon: 'bus-outline', label: 'Getting Around', value: 'Buses, walk' },
        { icon: 'restaurant-outline', label: 'Tipping', value: '10% common' }
      ]
    },
    insights: [
      { quote: 'Wagner composed Parsifal in these gardens.', attribution: null },
      { quote: 'The Terrace of Infinity offers views to eternity.', attribution: null },
      { quote: 'Ravello hosts a summer music festival since 1953.', attribution: null }
    ],
    experiences: [
      {
        title: 'Villa Cimbrone Gardens',
        subtext: '2 hrs · Infinity views',
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
      },
      {
        title: 'Villa Rufolo',
        subtext: 'Musical heritage',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
      },
      {
        title: 'Mountain Path Walk',
        subtext: 'Terraced beauty',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
      }
    ],
    foodCulture: [
      {
        icon: '⭐',
        title: 'Ristorante Rossellinis',
        subtext: 'Michelin star elegance',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
      },
      {
        icon: '🎵',
        title: 'Concert at Terrace',
        subtext: 'Music under the stars',
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
      },
      {
        icon: '🌿',
        title: 'Garden Meditation',
        subtext: 'Quiet among ancient trees',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
      }
    ],
    suggestedJourneys: [
      {
        title: 'Path of the Gods',
        subtitle: 'Hiking trail · Ravello to Positano',
        description: 'Ancient footpath with coastal panoramas.',
        stops: [
          { code: 'RAV', name: 'Ravello' },
          { code: 'POS', name: 'Positano' }
        ],
        images: [
          {
            url: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
            caption: 'Trail views'
          }
        ]
      },
      {
        title: 'Villa Circuit',
        subtitle: '1 day · Historic gardens tour',
        description: 'Explore Rufolo, Cimbrone, and terraces.',
        stops: [
          { code: 'RAV', name: 'Ravello' }
        ],
        images: [
          {
            url: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
            caption: 'Villa gardens'
          }
        ]
      }
    ]
  },
  'Sorrento': {
    name: 'Sorrento',
    subtitle: 'Island allure & Mediterranean calm',
    heroImage: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
    essenceTags: ['Citrus Perfume', 'Bay Views', 'Capri Gateway'],
    travelInfo: [
      { icon: 'calendar-outline', label: 'Apr–Jun', sublabel: 'Best Time' },
      { icon: 'card-outline', label: 'EUR', sublabel: 'Currency' },
      { icon: 'airplane-outline', label: 'NAP', sublabel: 'Airport' },
      { icon: 'time-outline', label: 'CET+1', sublabel: 'Time Zone' }
    ],
    poeticLine: 'Where citrus perfumes the twilight air.',
    discoveryCards: [
      {
        id: 'experiences',
        title: 'Experiences',
        subtext: 'Marina walk · Boat to Capri',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
      },
      {
        id: 'dining',
        title: 'Dining',
        subtext: 'Fresh seafood · Limoncello',
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
      },
      {
        id: 'culture',
        title: 'Culture',
        subtext: 'Artisan workshops · Piazzas',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
      },
      {
        id: 'nature',
        title: 'Nature',
        subtext: 'Cliffside beaches · Bay views',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
      }
    ],
    detailsExpansion: [
      { name: 'Marina Grande', info: 'Fishing village', image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg' },
      { name: 'Limoncello Tasting', info: '€20, 1 hr', image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg' }
    ],
    essentials: {
      left: [
        { icon: 'calendar-outline', label: 'Best Time', value: 'Apr–Jun, Sep–Oct' },
        { icon: 'card-outline', label: 'Currency', value: 'Euro (EUR)' },
        { icon: 'chatbubble-outline', label: 'Language', value: 'Italian (English common)' },
        { icon: 'shirt-outline', label: 'Etiquette', value: 'Modest dress in churches' }
      ],
      right: [
        { icon: 'airplane-outline', label: 'Airport', value: 'Naples Intl (NAP)' },
        { icon: 'time-outline', label: 'Time Zone', value: 'CET+1' },
        { icon: 'bus-outline', label: 'Getting Around', value: 'Trains, ferries' },
        { icon: 'restaurant-outline', label: 'Tipping', value: '10% common' }
      ]
    },
    insights: [
      { quote: 'Sorrento produces the finest limoncello in Italy.', attribution: null },
      { quote: 'Cliffside streets lead to hidden beaches.', attribution: null },
      { quote: 'The Bay of Naples sparkles at sunset.', attribution: null }
    ],
    experiences: [
      {
        title: 'Marina Grande Walk',
        subtext: '2 hrs · Fishing village',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
      },
      {
        title: 'Limoncello Tasting',
        subtext: 'Local distillery',
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
      },
      {
        title: 'Bay of Naples Cruise',
        subtext: 'Sunset views',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
      }
    ],
    foodCulture: [
      {
        icon: '🐟',
        title: "L'Antica Trattoria",
        subtext: 'Family recipes, sea views',
        image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg'
      },
      {
        icon: '🍋',
        title: 'Limoncello Factory',
        subtext: 'Handcrafted since 1890',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg'
      },
      {
        icon: '🎨',
        title: 'Artisan Workshops',
        subtext: 'Inlaid wood & ceramics',
        image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg'
      }
    ],
    suggestedJourneys: [
      {
        title: 'Capri Day Trip',
        subtitle: 'Ferry from Sorrento · Full day',
        description: 'Blue grotto, shopping, and island charm.',
        stops: [
          { code: 'SOR', name: 'Sorrento' },
          { code: 'CAP', name: 'Capri' }
        ],
        images: [
          {
            url: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
            caption: 'Capri'
          }
        ]
      },
      {
        title: 'Pompeii & Vesuvius',
        subtitle: '1 day · Ancient history',
        description: 'Ruins, volcano, and archaeological wonder.',
        stops: [
          { code: 'SOR', name: 'Sorrento' },
          { code: 'POM', name: 'Pompeii' }
        ],
        images: [
          {
            url: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
            caption: 'Pompeii ruins'
          }
        ]
      }
    ]
  }
}

// Discovery Section - Redesigned for React Native
const DiscoverySection = () => {
  const discoveryData = [
    {
      id: 'experiences',
      title: 'Experiences',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      chips: ['2–3 hrs', 'Clifftop', 'Tickets']
    },
    {
      id: 'dining', 
      title: 'Dining',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      chips: ['Seafood', '€€', 'Old Town']
    },
    {
      id: 'culture',
      title: 'Culture', 
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      chips: ['Basilica', 'Museo', '10–18']
    }
  ]

  const highlights = [
    {
      name: 'Villa Cimbrone Gardens',
      meta: '9–18 • Ravello',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/sy3verjz_amalfi.jpg',
      chips: ['€€', 'Viewpoint']
    },
    {
      name: 'Amalfi Cathedral', 
      meta: 'Basilica • 9–19',
      image: 'https://customer-assets.emergentagent.com/job_b5ab561f-228e-4e39-a6f5-4ce831be1eb0/artifacts/a995lk61_amalfi.jpg',
      chips: ['Family-friendly']
    },
    {
      name: 'Lemon Grove Walk',
      meta: '2 hrs • Terrace paths',
      image: 'https://customer-assets.emergentagent.com/job_luxury-travel-3/artifacts/t67s0a4d_kyoto.jpg',
      chips: ['Guided']
    }
  ]

  return (
    <View style={styles.discoveryContainer}>
      {/* Section Header */}
      <View style={styles.discoveryHeader}>
        <Text style={styles.discoveryTitle}>Discovery</Text>
        <View style={styles.discoveryUnderline} />
      </View>

      {/* Horizontal Feature Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.discoveryScroll}
      >
        {discoveryData.map((item, index) => (
          <View key={item.id} style={[styles.discoveryCard, index === 0 && styles.firstDiscoveryCard]}>
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.discoveryCardImage}
              imageStyle={styles.discoveryCardImageStyle}
            >
              <View style={styles.discoveryCardGradient} />
              
              {/* Frosted bottom band */}
              <View style={styles.discoveryCardBand}>
                <Text style={styles.discoveryCardTitle}>{item.title}</Text>
                <View style={styles.discoveryChipsRow}>
                  {item.chips.slice(0, 3).map((chip, chipIndex) => (
                    <View key={chipIndex} style={styles.discoveryChip}>
                      <Text style={styles.discoveryChipText}>{chip}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ImageBackground>
          </View>
        ))}
      </ScrollView>

      {/* Editor's Highlights */}
      <View style={styles.highlightsPane}>
        {/* Header */}
        <View style={styles.highlightsHeader}>
          <View style={styles.highlightsLeft}>
            <Ionicons name="star" size={14} color="#CBB88C" />
            <Text style={styles.highlightsTitle}>Editor's Highlights</Text>
          </View>
          <View style={styles.highlightsRight}>
            <Text style={styles.seeAllText}>See All</Text>
            <Ionicons name="chevron-forward" size={11} color="#9B958D" />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.highlightsDivider} />

        {/* Highlight Rows */}
        {highlights.map((highlight, index) => (
          <View key={index}>
            <View style={styles.highlightRow}>
              <ImageBackground
                source={{ uri: highlight.image }}
                style={styles.highlightThumb}
                imageStyle={styles.highlightThumbStyle}
              />
              <View style={styles.highlightContent}>
                <Text style={styles.highlightName}>{highlight.name}</Text>
                <Text style={styles.highlightMeta}>{highlight.meta}</Text>
              </View>
              <View style={styles.highlightChips}>
                {highlight.chips.slice(0, 2).map((chip, chipIndex) => (
                  <View key={chipIndex} style={styles.highlightChip}>
                    <Text style={styles.highlightChipText}>{chip}</Text>
                  </View>
                ))}
              </View>
            </View>
            {index < highlights.length - 1 && <View style={styles.highlightRowDivider} />}
          </View>
        ))}
      </View>
    </View>
  )
}

export default function MultiCityDestinationInfo() {
  const [isSaved, setIsSaved] = useState(false)
  const [selectedCity, setSelectedCity] = useState('Amalfi')
  
  const destinationData = cityDataMap[selectedCity]

  return (
    <View style={styles.container}>
      {/* Faint gold grain overlay for texture depth */}
      <View style={styles.grainOverlay} />
      
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Hero Gallery Header */}
        <View style={styles.heroSection}>
          <ImageBackground
            source={{ uri: destinationData.heroImage }}
            style={styles.heroImage}
            imageStyle={styles.heroImageStyle}
          >
            {/* Dark gradient overlay */}
            <View style={styles.heroOverlay} />
            
            {/* Top Controls */}
            <View style={styles.topControls}>
              <TouchableOpacity 
                style={styles.topNavButton}
                onPress={() => router.back()}
              >
                <View style={styles.topNavCircle}>
                  <Ionicons name="arrow-back" size={18} color="#CBB88C" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.topNavButton}
                onPress={() => setIsSaved(!isSaved)}
              >
                <View style={[styles.topNavCircle, isSaved && styles.topNavCircleActive]}>
                  <Ionicons 
                    name={isSaved ? "bookmark" : "bookmark-outline"} 
                    size={18} 
                    color="#CBB88C" 
                  />
                </View>
              </TouchableOpacity>
            </View>

            {/* Hero Text Overlay - Positioned Higher */}
            <View style={styles.heroTextOverlay}>
              <Text style={styles.heroTitle}>{destinationData.name}</Text>
              <Text style={styles.heroSubtitle}>{destinationData.subtitle}</Text>
            </View>
          </ImageBackground>
        </View>

        {/* 2. Essence Capsule */}
        <View style={styles.essenceCapsule}>
          <View style={styles.essenceBlur}>
            <View style={styles.essenceContent}>
              {/* City Selector Pills (Above Tags) - Smaller & Moved Up */}
              <View style={styles.citySelectorRow}>
                {multiCityCircuit.cities.map((city, idx) => (
                  <TouchableOpacity
                    key={city}
                    style={[
                      styles.citySelectorPillInPane,
                      selectedCity === city && styles.citySelectorPillInPaneActive
                    ]}
                    onPress={() => setSelectedCity(city)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.citySelectorTextInPane,
                      selectedCity === city && styles.citySelectorTextInPaneActive
                    ]}>
                      {multiCityCircuit.cityCodes[idx]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Row 1: Golden Tags - With More Spacing */}
              <View style={styles.essenceTagsRow}>
                {destinationData.essenceTags.map((tag, index) => (
                  <View key={index} style={styles.essenceTag}>
                    <Text style={styles.essenceTagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {/* Row 2: Travel Icons - With More Top Spacing */}
              <View style={styles.travelIconsRow}>
                {destinationData.travelInfo.map((info, index) => (
                  <View key={index} style={styles.travelIconContainer}>
                    <View style={styles.travelIcon}>
                      <Ionicons name={info.icon as any} size={20} color="#F3F1E7" />
                    </View>
                    <Text style={styles.travelIconLabel}>{info.label}</Text>
                  </View>
                ))}
              </View>

              {/* Row 3: Poetic Line - With More Top Spacing */}
              <Text style={styles.poeticLine}>{destinationData.poeticLine}</Text>
            </View>
          </View>
        </View>

        {/* 3. Explore Section */}
        <View style={styles.exploreSection}>
          <View style={styles.exploreHeader}>
            <Text style={styles.exploreTitle}>Explore the Coast</Text>
            <View style={styles.exploreDivider} />
          </View>

          {/* Experiences Carousel */}
          <View style={styles.carouselContainer}>
            <View style={styles.carouselHeader}>
              <Text style={styles.carouselTitle}>Experiences</Text>
              <Text style={styles.carouselSubtitle}>Walks, views, and hidden gems</Text>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselScroll}
            >
              {destinationData.experiences.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.experienceImageCard, index === 0 && styles.firstCard]}
                  activeOpacity={0.8}
                >
                  <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.experienceImageCardBg}
                    imageStyle={styles.experienceImageCardBgStyle}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                      style={styles.experienceImageCardGradient}
                    />
                    <View style={styles.experienceImageCardFrosted}>
                      <Text style={styles.experienceCardTitle}>{item.title}</Text>
                      <Text style={styles.experienceCardDetails}>{item.subtext}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Food & Culture Carousel */}
          <View style={styles.carouselContainer}>
            <View style={styles.carouselHeader}>
              <Text style={styles.carouselTitle}>Food & Culture</Text>
              <Text style={styles.carouselSubtitle}>Taste and traditions from the coast</Text>
            </View>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselScroll}
            >
              {destinationData.foodCulture.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.experienceImageCard, index === 0 && styles.firstCard]}
                  activeOpacity={0.8}
                >
                  <ImageBackground
                    source={{ uri: item.image }}
                    style={styles.experienceImageCardBg}
                    imageStyle={styles.experienceImageCardBgStyle}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
                      style={styles.experienceImageCardGradient}
                    />
                    <View style={styles.experienceImageCardFrosted}>
                      <Text style={styles.foodCultureIcon}>{item.icon}</Text>
                      <Text style={styles.experienceCardTitle}>{item.title}</Text>
                      <Text style={styles.experienceCardDetails}>{item.subtext}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 4. Local Insights - Frosted Pane (Trip Canvas Style) */}
        <View style={styles.localInsightsSection}>
          <View style={styles.insightsTripCanvasPane}>
            <View style={styles.insightsPaneContent}>
              {/* Header */}
              <View style={styles.insightsTitleBar}>
                <Text style={styles.insightsTitle}>LOCAL INSIGHTS</Text>
                <View style={styles.insightsTitleDivider} />
              </View>

              {/* 2×3 Grid Layout */}
              <View style={styles.insightsGrid}>
                {/* Left Column */}
                <View style={styles.insightsColumn}>
                  {destinationData.essentials.left.map((item, index) => (
                    <View key={index} style={styles.insightItem}>
                      <Ionicons name={item.icon as any} size={16} color="#CBB88C" style={styles.insightBronzeIcon} />
                      <View style={styles.insightText}>
                        <Text style={styles.insightLabel}>{item.label}</Text>
                        <Text style={styles.insightDetail}>{item.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Right Column */}
                <View style={styles.insightsColumn}>
                  {destinationData.essentials.right.map((item, index) => (
                    <View key={index} style={styles.insightItem}>
                      <Ionicons name={item.icon as any} size={16} color="#CBB88C" style={styles.insightBronzeIcon} />
                      <View style={styles.insightText}>
                        <Text style={styles.insightLabel}>{item.label}</Text>
                        <Text style={styles.insightDetail}>{item.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Elegant One-Liner */}
              <View style={styles.insightsFooter}>
                <Text style={styles.insightsWhisper}>
                  "Tipping 10% shows grace, not habit."
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. Suggested Journeys - Frosted Pane (Trip Canvas Style) */}
        <View style={styles.suggestedJourneysSection}>
          {/* Section Header */}
          <View style={styles.journeysHeader}>
            <Text style={styles.journeysTitle}>SUGGESTED JOURNEYS</Text>
            <Text style={styles.journeysSubtitle}>Curated paths from travelers in the know</Text>
            <View style={styles.journeysDivider} />
          </View>

          {/* Journey Cards - With Trip Canvas Frosted Panes */}
          <View style={styles.journeysContainer}>
            {destinationData.suggestedJourneys.map((journey, index) => (
              <View key={index} style={styles.journeyTripCanvasCard}>
                {/* Top Row - Title + Meta */}
                <View style={styles.journeyHeader}>
                  <Text style={styles.journeyTitle}>{journey.title}</Text>
                  <Text style={styles.journeyMeta}>{journey.subtitle}</Text>
                </View>

                {/* Middle - Description */}
                <Text style={styles.journeyDescription}>{journey.description}</Text>

                {/* Bottom Row - Images + Arrow */}
                <View style={styles.journeyBottom}>
                  <View style={styles.journeyThumbnails}>
                    {journey.images.map((image, imgIndex) => (
                      <View key={imgIndex} style={styles.journeyThumbnailContainer}>
                        <ImageBackground
                          source={{ uri: image.url }}
                          style={styles.journeyThumbnail}
                          imageStyle={styles.journeyThumbnailImage}
                        />
                        <Text style={styles.journeyThumbnailCaption}>{image.caption}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity style={styles.journeyArrowButton}>
                    <View style={styles.journeyArrowCircle}>
                      <Ionicons name="arrow-up-outline" size={14} color="#CBB88C" style={{ transform: [{ rotate: '45deg' }] }} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom spacing for fixed footer */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* 6. Footer Action Bar */}
      <View style={styles.footerActionBar}>
        <View style={styles.footerBlur}>
          <View style={styles.footerContent}>
            <TouchableOpacity style={styles.addToTripsButton}>
              <Text style={styles.addToTripsText}>Add to My Trips</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.planTripButton}>
              <Text style={styles.planTripText}>Plan This Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A', // Primary background
  },
  grainOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(203,184,140,0.03)', // Faint gold grain overlay
    pointerEvents: 'none',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 104, // Space for fixed footer
  },

  // 1. Hero Gallery Header (300px tall, rounded bottom corners 40px)
  heroSection: {
    height: 300,
  },
  heroImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.4)',
      },
    }),
  },

  // Top Controls (24px from edge, 48px from top)
  topControls: {
    position: 'absolute',
    top: 48,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(20,20,20,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  saveButtonActive: {
    backgroundColor: 'rgba(203,184,140,0.3)',
  },

  // Hero Text Overlay (positioned higher to avoid pane overlap)
  heroTextOverlay: {
    position: 'absolute',
    bottom: 80, // Moved up from 24 to 80 to avoid overlap with essence pane
    left: 24,
    right: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '600', // Neue Montreal SemiBold
    color: '#F3F1E7', // Text white
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '300', // SF Pro Display Light Italic
    fontStyle: 'italic',
    color: 'rgba(243,241,231,0.85)', // 85% opacity white
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // City Selector Pills Inside Pane (Elegant & World-Class)
  citySelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    marginTop: -8,
    justifyContent: 'center',
  },
  citySelectorPillInPane: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(181,155,115,0.25)',
  },
  citySelectorPillInPaneActive: {
    backgroundColor: 'rgba(201,169,109,0.2)',
    borderWidth: 1.5,
    borderColor: '#C9A96D',
  },
  citySelectorTextInPane: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.65)',
    letterSpacing: 1.3,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },
  citySelectorTextInPaneActive: {
    color: '#C9A96D',
  },

  // 2. Frosted Panel (MATCHING TRIP CANVAS EXACTLY)
  essenceCapsule: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 24,
    marginTop: -40,
    marginBottom: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 1px 1px 0 rgba(255,255,255,0.05)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  essenceBlur: {
    flex: 1,
  },
  essenceContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-around',
  },

  // Essence Row 1: Golden Tags
  essenceTagsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  essenceTag: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(203,184,140,0.15)',
  },
  essenceTagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#CBB88C', // Gold accent
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Essence Row 2: Travel Icons
  travelIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  travelIconContainer: {
    alignItems: 'center',
  },
  travelIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  travelIconLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9B958D', // Muted gray
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Essence Row 3: Poetic Line
  poeticLine: {
    fontSize: 13,
    fontWeight: '300',
    fontStyle: 'italic',
    color: '#CBB88C', // Gold accent
    textAlign: 'center',
    marginTop: 4,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  // Top Navigation - Frosted Circles (Landing Page Style)
  topNavButton: {
    // No additional styling needed - just for structure
  },
  topNavCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)', // Frosted glass
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(10px)',
      },
    }),
  },
  topNavCircleActive: {
    backgroundColor: 'rgba(203,184,140,0.15)', // Bronze tint when active
    borderColor: 'rgba(203,184,140,0.25)',
  },

  // 3. Discovery Grid
  discoverySection: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600', // Neue Montreal SemiBold
    color: '#F3F1E7', // Text white
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  sectionDivider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.25)', // Faint gold divider
  },

  // Discovery Grid Layout (2 cards per row)
  discoveryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  discoveryCard: {
    width: 165,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden', // Critical for iOS rounded corners
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.2)',
    ...Platform.select({
      web: {
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
      },
    }),
  },
  discoveryCardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  discoveryCardImageStyle: {
    // Remove borderRadius from image - let container handle it
  },
  discoveryCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.3)',
      },
    }),
  },
  discoveryCardContent: {
    padding: 16,
  },
  discoveryCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F3F1E7', // White
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  discoveryCardSubtext: {
    fontSize: 13,
    fontWeight: '400',
    color: '#CBB88C', // Gold
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Discovery Expansion Panel
  discoveryExpansion: {
    height: 120,
    borderRadius: 28,
    overflow: 'hidden', // Critical for iOS rounded corners
    ...Platform.select({
      web: {
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
  },
  expansionBlur: {
    flex: 1,
    backgroundColor: 'rgba(20,20,20,0.8)', // Solid background for iOS
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.25)',
    borderRadius: 28, // iOS-friendly rounded corners
  },
  expansionContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    justifyContent: 'space-around',
  },
  expansionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expansionThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden', // Critical for iOS rounded corners
  },
  expansionThumbnailStyle: {
    // Remove borderRadius from image - let container handle it
  },
  expansionText: {
    flex: 1,
  },
  expansionName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F3F1E7', // White
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  expansionInfo: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9B958D', // Muted gray
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // 4. Essentials Panel
  essentialsPanel: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 24,
    overflow: 'hidden', // Critical for iOS rounded corners
    marginTop: 28,
    marginBottom: 28,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
  },
  essentialsBlur: {
    backgroundColor: 'rgba(20,20,20,0.8)', // Solid background for iOS
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.25)',
    borderRadius: 24, // iOS-friendly rounded corners
  },
  essentialsContent: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  essentialsColumns: {
    flexDirection: 'row',
    gap: 12,
  },
  essentialsColumn: {
    flex: 1,
    gap: 16,
  },
  essentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  essentialText: {
    flex: 1,
  },
  essentialLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F3F1E7', // White
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  essentialValue: {
    fontSize: 13,
    fontWeight: '400',
    color: '#9B958D', // Muted gray
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // 5. Local Insights
  insightsSection: {
    paddingLeft: 20,
    marginBottom: 28,
  },
  insightsScroll: {
    paddingRight: 20,
  },
  insightCard: {
    width: 280,
    height: 140,
    borderRadius: 22,
    overflow: 'hidden', // Critical for iOS rounded corners
    marginRight: 16,
  },
  insightCardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  insightCardImageStyle: {
    // Remove borderRadius from image - let container handle it
  },
  insightCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    ...Platform.select({
      web: {
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
      },
      default: {
        backgroundColor: 'rgba(0,0,0,0.4)',
      },
    }),
  },
  insightCardContent: {
    padding: 20,
    alignItems: 'center',
  },
  insightQuote: {
    fontSize: 15,
    fontWeight: '400',
    fontStyle: 'italic',
    color: '#F3F1E7', // White
    textAlign: 'left',
    lineHeight: 22,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  insightAttribution: {
    fontSize: 12,
    fontWeight: '400',
    color: '#CBB88C', // Gold
    marginTop: 8,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Bottom spacing for fixed footer
  bottomSpacing: {
    height: 104,
  },

  // 6. Footer Action Bar (Fixed at bottom)
  footerActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopWidth: 1,
    borderTopColor: 'rgba(203,184,140,0.2)',
  },
  footerBlur: {
    flex: 1,
    backgroundColor: 'rgba(20,20,20,0.9)', // More solid for iOS
  },
  footerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
  },
  addToTripsButton: {
    width: 155,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(203,184,140,0.18)',
    borderWidth: 1,
    borderColor: '#CBB88C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToTripsText: {
    fontSize: 15,
    fontWeight: '500', // Medium
    color: '#CBB88C', // Gold
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  planTripButton: {
    width: 155,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#CBB88C', // Gold background
    alignItems: 'center',
    justifyContent: 'center',
  },
  planTripText: {
    fontSize: 15,
    fontWeight: '600', // SemiBold
    color: '#0A0A0A', // Dark background color
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Discovery Section Styles
  discoveryContainer: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  discoveryHeader: {
    marginBottom: 16,
  },
  discoveryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  discoveryUnderline: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.25)',
  },
  discoveryScroll: {
    paddingRight: 24,
  },
  discoveryCard: {
    width: 200,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.2)',
  },
  firstDiscoveryCard: {
    marginLeft: 0,
  },
  discoveryCardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  discoveryCardImageStyle: {
    borderRadius: 16,
  },
  discoveryCardGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  discoveryCardBand: {
    backgroundColor: 'rgba(20,20,20,0.8)',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(203,184,140,0.15)',
  },
  discoveryCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  discoveryChipsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  discoveryChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(203,184,140,0.15)',
  },
  discoveryChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Highlights Pane
  highlightsPane: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 1px 1px 0 rgba(255,255,255,0.05)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  highlightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  highlightsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3F1E7',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  highlightsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9B958D',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  highlightsDivider: {
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.1)',
    marginBottom: 12,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  highlightThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
  },
  highlightThumbStyle: {
    borderRadius: 8,
  },
  highlightContent: {
    flex: 1,
  },
  highlightName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  highlightMeta: {
    fontSize: 11,
    fontWeight: '400',
    color: '#9B958D',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  highlightChips: {
    flexDirection: 'row',
    gap: 4,
  },
  highlightChip: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(203,184,140,0.12)',
  },
  highlightChipText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  highlightRowDivider: {
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.08)',
    marginVertical: 8,
  },
  
  // Simple Discovery Styles
  discoverySimple: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  discoveryTitleSimple: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 8,
  },
  discoverySubtext: {
    fontSize: 14,
    color: '#9B958D',
  },
  
  // Discovery Section Styles
  discoveryContainer: {
    marginBottom: 40,
  },
  discoveryHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  discoveryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 6,
  },
  discoveryUnderline: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.3)',
  },
  discoveryScroll: {
    paddingLeft: 20,
  },
  discoveryCard: {
    width: 280,
    height: 180,
    marginRight: 16,
    borderRadius: 22,
    overflow: 'hidden',
  },
  firstDiscoveryCard: {
    marginLeft: 0,
  },
  discoveryCardImage: {
    flex: 1,
  },
  discoveryCardImageStyle: {
    borderRadius: 22,
  },
  discoveryCardGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  discoveryCardBand: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(20,20,20,0.8)',
    padding: 16,
    justifyContent: 'space-between',
  },
  discoveryCardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  discoveryChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  discoveryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
  },
  discoveryChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F3F1E7',
  },
  
  // Highlights Pane
  highlightsPane: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'rgba(20,20,20,0.8)',
    borderRadius: 24,
    marginTop: 20,
    marginBottom: 28,
  },
  highlightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  highlightsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  highlightsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F3F1E7',
  },
  highlightsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9B958D',
  },
  highlightsDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  highlightThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
  },
  highlightThumbStyle: {
    borderRadius: 10,
  },
  highlightContent: {
    flex: 1,
    gap: 2,
  },
  highlightName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F3F1E7',
  },
  highlightMeta: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9B958D',
  },
  highlightChips: {
    flexDirection: 'row',
    gap: 6,
  },
  highlightChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 11,
  },
  highlightChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F3F1E7',
  },
  highlightRowDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 8,
  },

  // 3. Explore Section Styles
  exploreSection: {
    paddingHorizontal: 24,
    marginBottom: 24, // Reduced from 32 to 24 for tighter spacing
  },
  exploreHeader: {
    marginBottom: 24,
  },
  exploreTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F3F1E7',
    marginBottom: 8,
    letterSpacing: 0.5,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  exploreDivider: {
    width: 50,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.4)',
  },

  // Carousel Styles
  carouselContainer: {
    marginBottom: 24, // Reduced from 32 to 24 for elegant spacing
  },
  carouselHeader: {
    marginBottom: 16,
  },
  carouselTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  carouselSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#9B958D',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  carouselScroll: {
    paddingRight: 24,
  },

  // Experience Cards - 280×220pt
  experienceCard: {
    width: 280,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },
  firstCard: {
    marginLeft: 0,
  },
  experienceCardImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  experienceCardImageStyle: {
    borderRadius: 20,
  },
  experienceCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  experienceCardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  experienceCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  experienceCardSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Food & Culture specific styles
  foodCultureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  foodCultureIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  // 5. Local Insights - Luxury Collector's Card Styles
  localInsightsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  insightsCollectorCard: {
    backgroundColor: 'rgba(20,20,20,0.85)', // Frosted glass effect
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.25)', // Thin gold stroke
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
      },
    }),
  },
  insightsCardContent: {
    padding: 24,
  },
  
  // Title Bar
  insightsTitleBar: {
    marginBottom: 24,
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F3F1E7',
    letterSpacing: 1.5, // Wide tracking
    marginBottom: 12,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  insightsTitleDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.3)', // Soft gold
  },

  // 2×3 Grid Layout
  insightsGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  insightsColumn: {
    flex: 1,
    gap: 20,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightBronzeIcon: {
    marginTop: 2,
  },
  insightText: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F3F1E7',
    marginBottom: 2,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  insightDetail: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9B958D',
    lineHeight: 16,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Elegant Footer One-Liner
  insightsFooter: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(203,184,140,0.15)',
    alignItems: 'center',
  },
  insightsWhisper: {
    fontSize: 13,
    fontWeight: '400',
    color: '#CBB88C',
    fontStyle: 'italic',
    letterSpacing: 0.3,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      web: 'Georgia, "Times New Roman", serif',
    }),
  },

  // 6. Suggested Journeys - Refined Editorial Styles
  suggestedJourneysSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 32,
  },
  journeysHeader: {
    alignItems: 'center',
    marginBottom: 18, // Minimal breathing space
  },
  journeysTitle: {
    fontSize: 16,
    fontWeight: '600', // Semibold
    color: 'rgba(243,241,231,0.9)', // White 90%
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  journeysSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(203,184,140,0.7)', // Gold 70% opacity
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  journeysDivider: {
    width: 60,
    height: 1,
    backgroundColor: 'rgba(203,184,140,0.4)', // 40% opacity
  },

  // Journey Cards Container - Simplified
  journeysContainer: {
    gap: 17, // 16-18pt breathing space
  },
  journeyCard: {
    minHeight: 250, // 240-260px height
    borderRadius: 26, // 26pt corner radius
    padding: 20, // 20pt all around
    backgroundColor: 'rgba(10,10,10,0.3)', // Translucent onyx opacity 0.3
    borderWidth: 1,
    borderColor: 'rgba(203,184,140,0.15)', // Subtle gold edge glow
    ...Platform.select({
      web: {
        backdropFilter: 'blur(30px)', // Blur 30px
        boxShadow: '0 0 20px rgba(203,184,140,0.15)', // Gold glow
      },
      default: {
        shadowColor: '#CBB88C',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },

  // Top Row - Title + Meta
  journeyHeader: {
    marginBottom: 16,
  },
  journeyTitle: {
    fontSize: 20, // 20pt Playfair Display equivalent
    fontWeight: '600',
    color: '#CBB88C', // Gold
    marginBottom: 6,
    fontFamily: Platform.select({
      ios: 'Playfair Display', // Serif equivalent
      android: 'serif',
      web: 'Playfair Display, Georgia, "Times New Roman", serif',
    }),
  },
  journeyMeta: {
    fontSize: 14, // 14pt warm gray
    fontWeight: '400',
    color: 'rgba(229,229,229,0.7)', // Warm gray 70% opacity
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Middle - Description
  journeyDescription: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(203,184,140,0.85)',
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'left',
    lineHeight: 18,
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Bottom Row - Images + Arrow
  journeyBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  journeyThumbnails: {
    flexDirection: 'row',
    gap: 12, // Evenly spaced
  },
  journeyThumbnailContainer: {
    alignItems: 'center',
  },
  journeyThumbnail: {
    width: 58, // 56-60px diameter
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    borderWidth: 0.6, // 0.6px soft gold border
    borderColor: '#CBB88C',
    marginBottom: 6,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.25)', // Subtle drop shadow blur 8px
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  journeyThumbnailImage: {
    borderRadius: 29,
  },
  journeyThumbnailCaption: {
    fontSize: 11, // 11pt micro-caption
    fontWeight: '400',
    color: 'rgba(229,229,229,0.6)', // 60% opacity
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // Arrow Button - Far Right
  journeyArrowButton: {
    // No additional styling needed
  },
  journeyArrowCircle: {
    width: 36, // 36px diameter frosted circle
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(203,184,140,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(203,184,140,0.2)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(15px)',
      },
    }),
  },

  // Trip Canvas Card Styles
  tripCanvasCard: {
    width: 280,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
      },
    }),
  },
  tripCanvasCardBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  tripCanvasCardBgStyle: {
    borderRadius: 20,
  },
  tripCanvasCardGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  tripCanvasCardFrosted: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(20,20,20,0.8)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(203,184,140,0.15)',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(15px)',
      },
    }),
  },
  tripCanvasCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Neue Montreal',
      android: 'Neue Montreal',
      web: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },
  tripCanvasCardSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: '#CBB88C',
    fontFamily: Platform.select({
      ios: 'SF Pro Display',
      android: 'SF Pro Display',
      web: 'SF Pro Display, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }),
  },

  // EXACT Trip Canvas Experience Card Styles (from bookings.tsx)
  experienceImageCard: {
    width: 280,
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginRight: 16,
  },
  experienceImageCardBg: {
    flex: 1,
  },
  experienceImageCardBgStyle: {
    borderRadius: 24,
  },
  experienceImageCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  experienceImageCardFrosted: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 16,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 1px 1px 0 rgba(255,255,255,0.05)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  experienceCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
    fontFamily: Platform.select({
      ios: 'Playfair Display',
      android: 'serif',
      web: 'Playfair Display, Georgia, serif',
    }),
  },
  experienceCardDetails: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(181,155,115,0.9)',
    marginBottom: 4,
    fontFamily: Platform.select({
      ios: 'Inter',
      web: 'Inter, -apple-system, sans-serif',
    }),
  },

  // Trip Canvas Frosted Panes for Local Insights and Suggested Journeys
  // EXACT MATCH to Trip Canvas experienceImageCardFrosted style
  insightsTripCanvasPane: {
    marginHorizontal: 0,
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 1px 1px 0 rgba(255,255,255,0.05)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
  insightsPaneContent: {
    // Content wrapper
  },
  journeyTripCanvasCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(181,155,115,0.15)',
    padding: 24,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(25px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3), inset 1px 1px 0 rgba(255,255,255,0.05)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },

})

// End of Practical Beauty design