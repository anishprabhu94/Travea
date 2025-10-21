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
  markAsBooked: (stayId: string, nights: number, dateRange: string) => void;
  markAsCanceled: (stayId: string) => void;
  getBookingStatus: (stayId: string) => 'none' | 'booked' | 'canceled';
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

  const markAsBooked = (stayId: string, nights: number, dateRange: string) => {
    setBookings(prev => {
      const newMap = new Map(prev);
      newMap.set(stayId, { stayId, status: 'booked', nights, dateRange });
      return newMap;
    });
  };

  const markAsCanceled = (stayId: string) => {
    setBookings(prev => {
      const newMap = new Map(prev);
      newMap.set(stayId, { stayId, status: 'canceled', nights: 0, dateRange: '' });
      return newMap;
    });
  };

  const getBookingStatus = (stayId: string): 'none' | 'booked' | 'canceled' => {
    const booking = bookings.get(stayId);
    return booking ? booking.status : 'none';
  };

  return (
    <StayBookingContext.Provider value={{ bookings, markAsBooked, markAsCanceled, getBookingStatus }}>
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
