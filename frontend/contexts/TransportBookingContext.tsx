import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TransportBooking {
  transportId: string;
  status: 'booked' | 'canceled';
  people: number;
  date: string;
  transportName?: string;
  transportImage?: string;
  pricePerPerson?: number;
  city?: string;
  cityCode?: string;
  tripId?: string;
}

interface TransportBookingContextType {
  bookings: Map<string, TransportBooking>;
  markAsBooked: (transportId: string, people: number, date: string, transportName?: string, transportImage?: string, pricePerPerson?: number, city?: string, cityCode?: string, tripId?: string) => void;
  markAsCanceled: (transportId: string, tripId?: string) => void;
  getBookingStatus: (transportId: string, tripId?: string) => 'none' | 'booked' | 'canceled';
  getBooking: (transportId: string, tripId?: string) => TransportBooking | undefined;
  getBookingsByTrip: (tripId: string) => TransportBooking[];
}

const TransportBookingContext = createContext<TransportBookingContextType | undefined>(undefined);

export const TransportBookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Map<string, TransportBooking>>(new Map());

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
      const stored = await AsyncStorage.getItem('transportBookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        const map = new Map<string, TransportBooking>(Object.entries(parsed));
        setBookings(map);
        console.log('Transport bookings loaded:', map.size);
      }
    } catch (error) {
      console.error('Error loading transport bookings:', error);
    }
  };

  const saveBookings = async () => {
    try {
      const obj = Object.fromEntries(bookings);
      await AsyncStorage.setItem('transportBookings', JSON.stringify(obj));
      console.log('Transport bookings saved:', bookings.size);
    } catch (error) {
      console.error('Error saving transport bookings:', error);
    }
  };

  const markAsBooked = (transportId: string, people: number, date: string, transportName?: string, transportImage?: string, pricePerPerson?: number, city?: string, cityCode?: string, tripId?: string) => {
    setBookings(prev => {
      const newMap = new Map(prev);
      const key = tripId ? `${tripId}-${transportId}` : transportId; // Trip-specific key
      newMap.set(key, { 
        transportId, 
        status: 'booked', 
        people, 
        date,
        transportName,
        transportImage,
        pricePerPerson,
        city,
        cityCode,
        tripId
      });
      return newMap;
    });
  };

  const markAsCanceled = (transportId: string, tripId?: string) => {
    setBookings(prev => {
      const newMap = new Map(prev);
      const key = tripId ? `${tripId}-${transportId}` : transportId;
      const existing = prev.get(key);
      if (existing) {
        newMap.set(key, { ...existing, status: 'canceled' });
      }
      return newMap;
    });
  };

  const getBookingStatus = (transportId: string, tripId?: string): 'none' | 'booked' | 'canceled' => {
    const key = tripId ? `${tripId}-${transportId}` : transportId;
    const booking = bookings.get(key);
    return booking ? booking.status : 'none';
  };

  const getBooking = (transportId: string, tripId?: string): TransportBooking | undefined => {
    const key = tripId ? `${tripId}-${transportId}` : transportId;
    return bookings.get(key);
  };

  const getBookingsByTrip = (tripId: string): TransportBooking[] => {
    return Array.from(bookings.values()).filter(booking => 
      booking.tripId === tripId && booking.status === 'booked'
    );
  };

  return (
    <TransportBookingContext.Provider value={{ 
      bookings, 
      markAsBooked, 
      markAsCanceled, 
      getBookingStatus,
      getBooking,
      getBookingsByTrip
    }}>
      {children}
    </TransportBookingContext.Provider>
  );
};

export const useTransportBooking = () => {
  const context = useContext(TransportBookingContext);
  if (!context) {
    throw new Error('useTransportBooking must be used within TransportBookingProvider');
  }
  return context;
};
