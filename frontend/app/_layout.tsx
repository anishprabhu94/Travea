import { Stack } from 'expo-router'
import { BookmarkProvider } from '../contexts/BookmarkContext'
import { TripCanvasProvider } from '../contexts/TripCanvasContext'
import { TripsProvider } from '../contexts/TripsContext'
import { StayBookingProvider } from '../contexts/StayBookingContext'

export default function RootLayout() {
  return (
    <BookmarkProvider>
      <TripCanvasProvider>
        <TripsProvider>
          <StayBookingProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="landing" />
              <Stack.Screen name="trips" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="welcome" />
              <Stack.Screen name="home" />
            </Stack>
          </StayBookingProvider>
        </TripsProvider>
      </TripCanvasProvider>
    </BookmarkProvider>
  )
}