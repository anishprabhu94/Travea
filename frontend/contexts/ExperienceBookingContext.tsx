import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExperienceBooking {
  experienceId: string;
  status: 'booked' | 'canceled';
  people: number;
  date: string;
  experienceName?: string;
  experienceImage?: string;
  pricePerPerson?: number;
  city?: string;
  cityCode?: string;
  tripId?: string;
}

interface ExperienceBookingContextType {
  bookings: Map<string, ExperienceBooking>;
  markAsBooked: (experienceId: string, people: number, date: string, experienceName?: string, experienceImage?: string, pricePerPerson?: number, city?: string, cityCode?: string, tripId?: string) => void;
  markAsCanceled: (experienceId: string, tripId?: string) => void;
  getBookingStatus: (experienceId: string, tripId?: string) => 'none' | 'booked' | 'canceled';
  getBooking: (experienceId: string, tripId?: string) => ExperienceBooking | undefined;
  getBookingsByTrip: (tripId: string) => ExperienceBooking[];
}

const ExperienceBookingContext = createContext<ExperienceBookingContextType | undefined>(undefined);

export const ExperienceBookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Map<string, ExperienceBooking>>(new Map());

  // Load bookings from AsyncStorage
  useEffect(() => {
    loadBookings();
  }, []);

  // Save bookings to AsyncStorage whenever they change
  useEffect(() => {
    saveBookings();
  }, [bookings]);

  const loadBookings = async () => {
    try {
      const stored = await AsyncStorage.getItem('experienceBookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        const map = new Map<string, ExperienceBooking>(Object.entries(parsed));
        setBookings(map);
        console.log('Experience bookings loaded:', map.size);
      }
    } catch (error) {
      console.error('Error loading experience bookings:', error);
    }
  };

  const saveBookings = async () => {
    try {
      const obj = Object.fromEntries(bookings);
      await AsyncStorage.setItem('experienceBookings', JSON.stringify(obj));
      console.log('Experience bookings saved:', bookings.size);
    } catch (error) {
      console.error('Error saving experience bookings:', error);
    }
  };

  const markAsBooked = (experienceId: string, people: number, date: string, experienceName?: string, experienceImage?: string, pricePerPerson?: number, city?: string, cityCode?: string, tripId?: string) => {
    setBookings(prev => {
      const newMap = new Map(prev);
      const key = tripId ? `${tripId}-${experienceId}` : experienceId; // Trip-specific key
      newMap.set(key, { 
        experienceId, 
        status: 'booked', 
        people, 
        date,
        experienceName,
        experienceImage,
        pricePerPerson,
        city,
        cityCode,
        tripId
      });
      return newMap;
    });
  };

  const markAsCanceled = (experienceId: string, tripId?: string) => {
    setBookings(prev => {
      const newMap = new Map(prev);
      const key = tripId ? `${tripId}-${experienceId}` : experienceId;
      const existing = prev.get(key);
      if (existing) {
        newMap.set(key, { ...existing, status: 'canceled' });
      }
      return newMap;
    });
  };

  const getBookingStatus = (experienceId: string, tripId?: string): 'none' | 'booked' | 'canceled' => {
    const key = tripId ? `${tripId}-${experienceId}` : experienceId;
    const booking = bookings.get(key);
    return booking ? booking.status : 'none';
  };

  const getBooking = (experienceId: string, tripId?: string): ExperienceBooking | undefined => {
    const key = tripId ? `${tripId}-${experienceId}` : experienceId;
    return bookings.get(key);
  };

  const getBookingsByTrip = (tripId: string): ExperienceBooking[] => {
    return Array.from(bookings.values()).filter(booking => 
      booking.tripId === tripId && booking.status === 'booked'
    );
  };

  return (
    <ExperienceBookingContext.Provider value={{ 
      bookings, 
      markAsBooked, 
      markAsCanceled, 
      getBookingStatus,
      getBooking,
      getBookingsByTrip
    }}>
      {children}
    </ExperienceBookingContext.Provider>
  );
};

export const useExperienceBooking = () => {
  const context = useContext(ExperienceBookingContext);
  if (!context) {
    throw new Error('useExperienceBooking must be used within ExperienceBookingProvider');
  }
  return context;
};
