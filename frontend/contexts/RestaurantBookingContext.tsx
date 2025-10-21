import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RestaurantBooking {
  restaurantId: string;
  status: 'booked' | 'canceled';
  people: number;
  date: string;
  restaurantName?: string;
  restaurantImage?: string;
  pricePerPerson?: number;
  city?: string;
  cityCode?: string;
  tripId?: string;
}

interface RestaurantBookingContextType {
  bookings: Map<string, RestaurantBooking>;
  markAsBooked: (restaurantId: string, people: number, date: string, restaurantName?: string, restaurantImage?: string, pricePerPerson?: number, city?: string, cityCode?: string, tripId?: string) => void;
  markAsCanceled: (restaurantId: string, tripId?: string) => void;
  getBookingStatus: (restaurantId: string, tripId?: string) => 'none' | 'booked' | 'canceled';
  getBooking: (restaurantId: string, tripId?: string) => RestaurantBooking | undefined;
  getBookingsByTrip: (tripId: string) => RestaurantBooking[];
}

const RestaurantBookingContext = createContext<RestaurantBookingContextType | undefined>(undefined);

export const RestaurantBookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Map<string, RestaurantBooking>>(new Map());

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
      const stored = await AsyncStorage.getItem('restaurantBookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        const map = new Map<string, RestaurantBooking>(Object.entries(parsed));
        setBookings(map);
        console.log('Restaurant bookings loaded:', map.size);
      }
    } catch (error) {
      console.error('Error loading restaurant bookings:', error);
    }
  };

  const saveBookings = async () => {
    try {
      const obj = Object.fromEntries(bookings);
      await AsyncStorage.setItem('restaurantBookings', JSON.stringify(obj));
      console.log('Restaurant bookings saved:', bookings.size);
    } catch (error) {
      console.error('Error saving restaurant bookings:', error);
    }
  };

  const markAsBooked = (restaurantId: string, people: number, date: string, restaurantName?: string, restaurantImage?: string, pricePerPerson?: number, city?: string, cityCode?: string, tripId?: string) => {
    setBookings(prev => {
      const newMap = new Map(prev);
      const key = tripId ? `${tripId}-${restaurantId}` : restaurantId; // Trip-specific key
      newMap.set(key, { 
        restaurantId, 
        status: 'booked', 
        people, 
        date,
        restaurantName,
        restaurantImage,
        pricePerPerson,
        city,
        cityCode,
        tripId
      });
      return newMap;
    });
  };

  const markAsCanceled = (restaurantId: string, tripId?: string) => {
    setBookings(prev => {
      const newMap = new Map(prev);
      const key = tripId ? `${tripId}-${restaurantId}` : restaurantId;
      const existing = prev.get(key);
      if (existing) {
        newMap.set(key, { ...existing, status: 'canceled' });
      }
      return newMap;
    });
  };

  const getBookingStatus = (restaurantId: string, tripId?: string): 'none' | 'booked' | 'canceled' => {
    const key = tripId ? `${tripId}-${restaurantId}` : restaurantId;
    const booking = bookings.get(key);
    return booking ? booking.status : 'none';
  };

  const getBooking = (restaurantId: string, tripId?: string): RestaurantBooking | undefined => {
    const key = tripId ? `${tripId}-${restaurantId}` : restaurantId;
    return bookings.get(key);
  };

  const getBookingsByTrip = (tripId: string): RestaurantBooking[] => {
    return Array.from(bookings.values()).filter(booking => 
      booking.tripId === tripId && booking.status === 'booked'
    );
  };

  return (
    <RestaurantBookingContext.Provider value={{ 
      bookings, 
      markAsBooked, 
      markAsCanceled, 
      getBookingStatus,
      getBooking,
      getBookingsByTrip
    }}>
      {children}
    </RestaurantBookingContext.Provider>
  );
};

export const useRestaurantBooking = () => {
  const context = useContext(RestaurantBookingContext);
  if (!context) {
    throw new Error('useRestaurantBooking must be used within RestaurantBookingProvider');
  }
  return context;
};
