import React, { createContext, useContext, useState } from "react";

export interface SelectedVehicle {
  make: string;
  makeName: string;
  model: string;
  modelName: string;
  year: number;
}

interface GarageContextType {
  vehicle: SelectedVehicle | null;
  saveVehicle: (v: SelectedVehicle) => void;
  clearVehicle: () => void;
}

const GarageContext = createContext<GarageContextType | undefined>(undefined);
const GARAGE_STORAGE_KEY = "my_garage_vehicle";

export const GarageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicle, setVehicle] = useState<SelectedVehicle | null>(() => {
    try {
      const saved = localStorage.getItem(GARAGE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const saveVehicle = (v: SelectedVehicle) => {
    setVehicle(v);
    localStorage.setItem(GARAGE_STORAGE_KEY, JSON.stringify(v));
  };

  const clearVehicle = () => {
    setVehicle(null);
    localStorage.removeItem(GARAGE_STORAGE_KEY);
  };

  return (
    <GarageContext.Provider value={{ vehicle, saveVehicle, clearVehicle }}>
      {children}
    </GarageContext.Provider>
  );
};

export const useGarage = () => {
  const context = useContext(GarageContext);
  if (!context) {
    throw new Error("useGarage must be used within a GarageProvider");
  }
  return context;
};

