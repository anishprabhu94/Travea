import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StayBooking {
  stayId: string;
  status: 'booked' | 'canceled';
  nights: number;
  dateRange: string;
  stayName?: string;
  stayImage?: string;
  pricePerNight?: number;
  city?: string;
  cityCode?: string;
  tripId?: string;
}

interface StayBookingContextType {
  bookings: Map<string, StayBooking>;
  markAsBooked: (stayId: string, nights: number, dateRange: string, stayName?: string, stayImage?: string, pricePerNight?: number, city?: string, cityCode?: string, tripId?: string) => void;
  markAsCanceled: (stayId: string) => void;
  getBookingStatus: (stayId: string) => 'none' | 'booked' | 'canceled';
  getBooking: (stayId: string) => StayBooking | undefined;
  getBookingsByTrip: (tripId: string) => StayBooking[];
}

const StayBookingContext = createContext<StayBookingContextType | undefined>(undefined);

export const StayBookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Map<string, StayBooking>>(new Map());

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
      const stored = await AsyncStorage.getItem('stayBookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        const map = new Map<string, StayBooking>(Object.entries(parsed));
        setBookings(map);
        console.log('Stay bookings loaded:', map.size);
      }
    } catch (error) {
      console.error('Error loading stay bookings:', error);
    }
  };

  const saveBookings = async () => {
    try {
      const obj = Object.fromEntries(bookings);
      await AsyncStorage.setItem('stayBookings', JSON.stringify(obj));
      console.log('Stay bookings saved:', bookings.size);
    } catch (error) {
      console.error('Error saving stay bookings:', error);
    }
  };

  const markAsBooked = (stayId: string, nights: number, dateRange: string, stayName?: string, stayImage?: string, pricePerNight?: number, city?: string, cityCode?: string, tripId?: string) => {
    setBookings(prev => {
      const newMap = new Map(prev);
      const key = tripId ? `${tripId}-${stayId}` : stayId; // Trip-specific key
      newMap.set(key, { 
        stayId, 
        status: 'booked', 
        nights, 
        dateRange,
        stayName,
        stayImage,
        pricePerNight,
        city,
        cityCode,
        tripId
      });
      return newMap;
    });
  };

  const markAsCanceled = (stayId: string, tripId?: string) => {
    setBookings(prev => {
      const newMap = new Map(prev);
      const key = tripId ? `${tripId}-${stayId}` : stayId;
      const existing = prev.get(key);
      if (existing) {
        newMap.set(key, { ...existing, status: 'canceled' });
      }
      return newMap;
    });
  };

  const getBookingStatus = (stayId: string, tripId?: string): 'none' | 'booked' | 'canceled' => {
    const key = tripId ? `${tripId}-${stayId}` : stayId;
    const booking = bookings.get(key);
    return booking ? booking.status : 'none';
  };

  const getBooking = (stayId: string, tripId?: string): StayBooking | undefined => {
    const key = tripId ? `${tripId}-${stayId}` : stayId;
    return bookings.get(key);
  };

  const getBookingsByTrip = (tripId: string): StayBooking[] => {
    return Array.from(bookings.values()).filter(booking => 
      booking.tripId === tripId && booking.status === 'booked'
    );
  };

  return (
    <StayBookingContext.Provider value={{ 
      bookings, 
      markAsBooked, 
      markAsCanceled, 
      getBookingStatus,
      getBooking,
      getBookingsByTrip
    }}>
      {children}
    </StayBookingContext.Provider>
  );
};

export const useStayBooking = () => {
  const context = useContext(StayBookingContext);
  if (!context) {
    throw new Error('useStayBooking must be used within StayBookingProvider');
  }
  return context;
};
