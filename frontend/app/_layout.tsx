import { Stack } from 'expo-router'
import { BookmarkProvider } from '../contexts/BookmarkContext'
import { TripCanvasProvider } from '../contexts/TripCanvasContext'
import { TripsProvider } from '../contexts/TripsContext'

export default function RootLayout() {
  return (
    <BookmarkProvider>
      <TripCanvasProvider>
        <TripsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="landing" />
            <Stack.Screen name="trips" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="home" />
          </Stack>
        </TripsProvider>
      </TripCanvasProvider>
    </BookmarkProvider>
  )
}