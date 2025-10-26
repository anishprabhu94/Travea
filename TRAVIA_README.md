# Travia.ai - Minimalist Luxury Travel App

## ✅ MVP Complete

A beautiful mobile login/sign-up screen for an AI-powered travel app with minimalist luxury aesthetics.

## 🎨 Design Features Implemented

### Login/Sign-up Screen
- **Full-screen lifestyle background** with high-quality beach sunrise imagery
- **Warm beige overlay** (#F6F3EF, 70% opacity) for readability
- **Elegant typography**:
  - Playfair Display (semibold) for "Travia.ai" logo
  - Inter Regular for all UI elements
- **Frosted glass card** with blur effect
- **Tab toggle** between Sign In and Sign Up modes
- **Minimalist input fields** with elegant underlines
- **Sea-mist accent button** (#B9C8C2) for primary actions
- **Coral-glow highlights** (#FF7A5A) for links
- **OAuth integration buttons**:
  - Google (white with Google branding)
  - Apple (black with white logo)
- **Skip option** - "Browse without signing in"

### Color Palette
- Background: #F6F3EF (warm beige)
- Text: #2E2E2E (charcoal)
- Accent: #B9C8C2 (sea-mist)
- Highlight: #FF7A5A (coral-glow)
- Muted Taupe: #A89F91

### Typography
- **Headings**: Playfair Display 600 Semibold
- **Body**: Inter 400 Regular

## 📱 Screens

1. **Index (/)** - Login/Sign-up Screen
2. **Home (/home)** - Dashboard placeholder

## 🚀 Getting Started

### Prerequisites
- Expo development environment
- Node.js & Yarn

### Running the App

```bash
cd /app/frontend
yarn install
yarn start
```

### Testing on Mobile
- Scan the QR code with Expo Go app (iOS/Android)
- Or access the web preview at http://localhost:3000

## 📁 Project Structure

```
frontend/
├── app/
│   ├── index.tsx        # Login/Sign-up screen
│   └── home.tsx         # Home dashboard
├── assets/              # Images and resources
├── app.json            # Expo configuration
└── package.json        # Dependencies
```

## 🎯 Features

- ✅ Beautiful minimalist luxury design
- ✅ Mobile-first responsive layout
- ✅ Smooth tab toggle animation
- ✅ Keyboard-aware scrolling
- ✅ Safe area handling
- ✅ Cross-platform support (iOS, Android, Web)
- ✅ Custom Google Fonts integration
- ✅ Blur effects with expo-blur
- ✅ Navigation with expo-router

## 🔧 Tech Stack

- **Framework**: Expo SDK 54
- **Navigation**: Expo Router
- **UI Components**: React Native
- **Fonts**: Google Fonts (Playfair Display, Inter)
- **Effects**: Expo Blur, Linear Gradient
- **Icons**: Expo Vector Icons

## 📝 Notes

- The app is currently in **mock mode** - no actual authentication
- All buttons navigate to the home screen as placeholders
- Backend integration ready but not implemented (FastAPI + MongoDB available)
- Home screen is a basic placeholder for future development

## 🎨 Design Philosophy

**Minimalist Luxury** - Inspired by:
- Apple's clean, spacious design
- Aman Resorts' serene aesthetics  
- Airbnb Luxe's aspirational travel imagery

The design creates a calm, editorial feel perfect for Gen Z and Millennials seeking beautiful travel experiences.

## 🌟 Next Steps for Full App

1. Implement actual authentication (JWT or OAuth)
2. Connect to backend API
3. Build out travel discovery features
4. Add AI-powered trip planning
5. Implement user profiles and saved trips
6. Add booking integrations

---

**Built with ❤️ using Expo + React Native**
