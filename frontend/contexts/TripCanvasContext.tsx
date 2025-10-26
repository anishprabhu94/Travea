import React, { createContext, useContext, useState, ReactNode } from 'react';

type CityDates = {
  [key: string]: {
    startMonth: string;
    startDay: number;
    endMonth: string;
    endDay: number;
  };
};

type TripCanvasContextType = {
  editableTripName: string;
  setEditableTripName: (name: string) => void;
  tripStartMonth: string;
  setTripStartMonth: (month: string) => void;
  tripStartDay: number;
  setTripStartDay: (day: number) => void;
  tripEndMonth: string;
  setTripEndMonth: (month: string) => void;
  tripEndDay: number;
  setTripEndDay: (day: number) => void;
  editableTravelers: number;
  setEditableTravelers: (count: number) => void;
  editableCities: string[];
  setEditableCities: (cities: string[]) => void;
  cityDates: CityDates;
  setCityDates: (dates: CityDates) => void;
  hasUsedAssignAll: boolean;
  setHasUsedAssignAll: (used: boolean) => void;
};

const TripCanvasContext = createContext<TripCanvasContextType | undefined>(undefined);

export const TripCanvasProvider = ({ children }: { children: ReactNode }) => {
  const [editableTripName, setEditableTripName] = useState('Summer in Italy');
  const [tripStartMonth, setTripStartMonth] = useState('June');
  const [tripStartDay, setTripStartDay] = useState(8);
  const [tripEndMonth, setTripEndMonth] = useState('June');
  const [tripEndDay, setTripEndDay] = useState(15);
  const [editableTravelers, setEditableTravelers] = useState(2);
  const [editableCities, setEditableCities] = useState(['FLR', 'ROM', 'VCE', 'AML']);
  const [cityDates, setCityDates] = useState<CityDates>({});
  const [hasUsedAssignAll, setHasUsedAssignAll] = useState(false);

  return (
    <TripCanvasContext.Provider
      value={{
        editableTripName,
        setEditableTripName,
        tripStartMonth,
        setTripStartMonth,
        tripStartDay,
        setTripStartDay,
        tripEndMonth,
        setTripEndMonth,
        tripEndDay,
        setTripEndDay,
        editableTravelers,
        setEditableTravelers,
        editableCities,
        setEditableCities,
        cityDates,
        setCityDates,
        hasUsedAssignAll,
        setHasUsedAssignAll,
      }}
    >
      {children}
    </TripCanvasContext.Provider>
  );
};

export const useTripCanvas = () => {
  const context = useContext(TripCanvasContext);
  if (!context) {
    throw new Error('useTripCanvas must be used within TripCanvasProvider');
  }
  return context;
};
