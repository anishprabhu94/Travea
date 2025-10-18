import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TripStatus = 'Planning' | 'Upcoming' | 'Ongoing' | 'Completed';
export type SectionStatus = 'Booked' | 'Pending' | 'N/A';
export type CityStatus = 'Booked' | 'Pending' | 'In Progress';

export interface BookingSection {
  flights: SectionStatus;
  stays: SectionStatus;
  transport: SectionStatus;
}

export interface CityInTrip {
  code: string;
  name: string;
  startMonth: string;
  startDay: number;
  endMonth: string;
  endDay: number;
  status: CityStatus;
  bookings: BookingSection;
}

export interface Trip {
  id: string;
  title: string;
  startMonth: string;
  startDay: number;
  endMonth: string;
  endDay: number;
  travelers: number;
  cities: CityInTrip[];
  status: TripStatus;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  isMultiCity?: boolean;
  circuitTitle?: string;
}

interface TripsContextType {
  trips: Trip[];
  createTrip: (title: string, startMonth: string, startDay: number, endMonth: string, endDay: number, travelers: number, cityCode?: string, isMultiCity?: boolean, circuitTitle?: string, allCities?: string[]) => string;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  getTripById: (id: string) => Trip | undefined;
  getFilteredTrips: (status: TripStatus) => Trip[];
  updateCityBooking: (tripId: string, cityCode: string, section: keyof BookingSection, status: SectionStatus) => void;
  refreshTripStatuses: () => void;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export const TripsProvider = ({ children }: { children: ReactNode }) => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load trips from AsyncStorage on mount
  useEffect(() => {
    loadTrips();
  }, []);

  // Save trips to AsyncStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveTrips();
    }
  }, [trips, isLoaded]);

  const loadTrips = async () => {
    try {
      const storedTrips = await AsyncStorage.getItem('@travea_trips');
      if (storedTrips) {
        const parsedTrips = JSON.parse(storedTrips);
        // Convert date strings back to Date objects
        const tripsWithDates = parsedTrips.map((trip: any) => ({
          ...trip,
          createdAt: new Date(trip.createdAt),
          updatedAt: new Date(trip.updatedAt)
        }));
        setTrips(tripsWithDates);
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveTrips = async () => {
    try {
      await AsyncStorage.setItem('@travea_trips', JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips:', error);
    }
  };

  // Calculate trip status based on dates and bookings
  const calculateTripStatus = (trip: Trip): TripStatus => {
    const today = new Date();
    const currentMonth = today.toLocaleString('en-US', { month: 'long' });
    const currentDay = today.getDate();

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const tripStartIdx = months.indexOf(trip.startMonth) * 31 + trip.startDay;
    const tripEndIdx = months.indexOf(trip.endMonth) * 31 + trip.endDay;
    const todayIdx = months.indexOf(currentMonth) * 31 + currentDay;

    // If all cities are booked, move to Upcoming
    const allCitiesBooked = trip.cities.length > 0 && trip.cities.every(city => city.status === 'Booked');
    
    if (todayIdx > tripEndIdx) {
      return 'Completed';
    } else if (todayIdx >= tripStartIdx && todayIdx <= tripEndIdx) {
      return 'Ongoing';
    } else if (allCitiesBooked && todayIdx < tripStartIdx) {
      return 'Upcoming';
    } else {
      return 'Planning';
    }
  };

  // Calculate city status based on bookings
  const calculateCityStatus = (city: CityInTrip): CityStatus => {
    const { flights, stays, transport } = city.bookings;
    
    const bookedCount = [flights, stays, transport].filter(s => s === 'Booked').length;
    const totalRequired = [flights, stays, transport].filter(s => s !== 'N/A').length;
    
    if (bookedCount === totalRequired && totalRequired > 0) {
      return 'Booked';
    } else if (bookedCount > 0) {
      return 'In Progress';
    } else {
      return 'Pending';
    }
  };

  // Calculate trip progress (0-100)
  const calculateProgress = (trip: Trip): number => {
    if (trip.cities.length === 0) return 0;
    
    const bookedCities = trip.cities.filter(city => city.status === 'Booked').length;
    return Math.round((bookedCities / trip.cities.length) * 100);
  };

  // Refresh all trip statuses (called on app open)
  const refreshTripStatuses = () => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        const updatedCities = trip.cities.map(city => ({
          ...city,
          status: calculateCityStatus(city)
        }));
        
        const updatedTrip = {
          ...trip,
          cities: updatedCities,
          progress: calculateProgress({ ...trip, cities: updatedCities })
        };
        
        return {
          ...updatedTrip,
          status: calculateTripStatus(updatedTrip)
        };
      });
    });
  };

  // Refresh statuses on mount
  useEffect(() => {
    refreshTripStatuses();
  }, []);

  const createTrip = (
    title: string, 
    startMonth: string, 
    startDay: number, 
    endMonth: string, 
    endDay: number, 
    travelers: number,
    cityCode?: string,
    isMultiCity?: boolean,
    circuitTitle?: string,
    allCities?: string[]
  ): string => {
    // Create cities array based on whether it's multi-city or not
    let citiesArray: CityInTrip[] = [];
    
    if (isMultiCity && allCities && allCities.length > 0) {
      // For multi-city, create an entry for each city
      citiesArray = allCities.map(cityName => ({
        code: cityName.substring(0, 3).toUpperCase(),
        name: cityName,
        startMonth: '',
        startDay: 0,
        endMonth: '',
        endDay: 0,
        status: 'Pending' as CityStatus,
        bookings: {
          flights: 'Pending' as SectionStatus,
          stays: 'Pending' as SectionStatus,
          transport: 'Pending' as SectionStatus
        }
      }));
    } else if (cityCode) {
      // For single city, extract full name from title (e.g., "Positano Trip" -> "Positano")
      const cityName = title.replace(' Trip', '').trim();
      const code = cityName.substring(0, 3).toUpperCase();
      
      citiesArray = [{
        code: code,
        name: cityName,
        startMonth,
        startDay,
        endMonth,
        endDay,
        status: 'Pending' as CityStatus,
        bookings: {
          flights: 'Pending' as SectionStatus,
          stays: 'Pending' as SectionStatus,
          transport: 'N/A' as SectionStatus
        }
      }];
    }
    
    const newTrip: Trip = {
      id: Date.now().toString(),
      title: circuitTitle || title,
      startMonth,
      startDay,
      endMonth,
      endDay,
      travelers,
      cities: citiesArray,
      status: 'Planning',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      isMultiCity: isMultiCity || false,
      circuitTitle: circuitTitle
    };

    setTrips(prev => [newTrip, ...prev]);
    return newTrip.id;
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id === id) {
          const updatedTrip = {
            ...trip,
            ...updates,
            updatedAt: new Date()
          };
          
          // Recalculate progress and status
          updatedTrip.progress = calculateProgress(updatedTrip);
          updatedTrip.status = calculateTripStatus(updatedTrip);
          
          return updatedTrip;
        }
        return trip;
      });
    });
  };

  const deleteTrip = (id: string) => {
    setTrips(prevTrips => prevTrips.filter(trip => trip.id !== id));
  };

  const getTripById = (id: string): Trip | undefined => {
    return trips.find(trip => trip.id === id);
  };

  const getFilteredTrips = (status: TripStatus): Trip[] => {
    return trips.filter(trip => trip.status === status);
  };

  const updateCityBooking = (
    tripId: string, 
    cityCode: string, 
    section: keyof BookingSection, 
    status: SectionStatus
  ) => {
    setTrips(prevTrips => {
      return prevTrips.map(trip => {
        if (trip.id === tripId) {
          const updatedCities = trip.cities.map(city => {
            if (city.code === cityCode) {
              const updatedBookings = {
                ...city.bookings,
                [section]: status
              };
              
              return {
                ...city,
                bookings: updatedBookings,
                status: calculateCityStatus({ ...city, bookings: updatedBookings })
              };
            }
            return city;
          });
          
          const updatedTrip = {
            ...trip,
            cities: updatedCities,
            updatedAt: new Date()
          };
          
          updatedTrip.progress = calculateProgress(updatedTrip);
          updatedTrip.status = calculateTripStatus(updatedTrip);
          
          return updatedTrip;
        }
        return trip;
      });
    });
  };

  // Helper function to get city name from code
  const getCityName = (code: string): string => {
    const cityMap: { [key: string]: string } = {
      'FLR': 'Florence',
      'ROM': 'Rome',
      'VCE': 'Venice',
      'AML': 'Amalfi Coast',
      'MIL': 'Milan',
      'NAP': 'Naples',
      'SIC': 'Sicily',
      'TUS': 'Tuscany'
    };
    return cityMap[code] || code;
  };

  return (
    <TripsContext.Provider
      value={{
        trips,
        createTrip,
        updateTrip,
        deleteTrip,
        getTripById,
        getFilteredTrips,
        updateCityBooking,
        refreshTripStatuses
      }}
    >
      {children}
    </TripsContext.Provider>
  );
};

export const useTrips = () => {
  const context = useContext(TripsContext);
  if (!context) {
    throw new Error('useTrips must be used within TripsProvider');
  }
  return context;
};
