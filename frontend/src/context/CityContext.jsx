import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config';

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('rentease_city') || 'Bangalore');
  const [cities, setCities] = useState(['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Chennai']);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cities`);
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          const cityNames = data.data.map(c => c.name);
          setCities(cityNames);
        }
      } catch (error) {
        console.error('Error fetching service cities:', error);
      }
    };

    fetchCities();
  }, []);

  const changeCity = (cityName) => {
    setSelectedCity(cityName);
    localStorage.setItem('rentease_city', cityName);
  };

  return (
    <CityContext.Provider value={{ selectedCity, cities, changeCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
