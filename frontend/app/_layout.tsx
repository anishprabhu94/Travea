import { Stack } from 'expo-router'
import { BookmarkProvider } from '../contexts/BookmarkContext'
import { TripCanvasProvider } from '../contexts/TripCanvasContext'
import { TripsProvider } from '../contexts/TripsContext'
import { StayBookingProvider } from '../contexts/StayBookingContext'
import { ExperienceBookingProvider } from '../contexts/ExperienceBookingContext'
import { RestaurantBookingProvider } from '../contexts/RestaurantBookingContext'

export default function RootLayout() {
  return (
    <BookmarkProvider>
      <TripCanvasProvider>
        <TripsProvider>
          <StayBookingProvider>
            <ExperienceBookingProvider>
              <RestaurantBookingProvider>
                <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="landing" />
              <Stack.Screen name="trips" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="welcome" />
              <Stack.Screen name="home" />
              <Stack.Screen name="destination" />
              <Stack.Screen name="bookings" />
              <Stack.Screen name="gallery" />
              <Stack.Screen name="multi-city-destination" />
              <Stack.Screen name="book-journey" />
              <Stack.Screen name="stay-browsing" />
              <Stack.Screen name="experience-browsing" />
              <Stack.Screen name="stay-info-compact" />
              <Stack.Screen name="train-info" />
              <Stack.Screen name="bus-info" />
              <Stack.Screen name="car-rental-info" />
              <Stack.Screen name="ferry-info" />
              <Stack.Screen name="experience-info" />
              <Stack.Screen name="restaurant-info" />
              <Stack.Screen name="concierge" />
                </Stack>
              </RestaurantBookingProvider>
            </ExperienceBookingProvider>
          </StayBookingProvider>
        </TripsProvider>
      </TripCanvasProvider>
    </BookmarkProvider>
  )
}