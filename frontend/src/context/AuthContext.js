import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.16:3000';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const loadAuthor = async () => {
      try {
        const storedAuthor = await AsyncStorage.getItem('author');
        if (storedAuthor) {
          setAuthor(JSON.parse(storedAuthor));
        }
      } catch (error) {
        console.error('Error loading stored author:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthor();
  }, []);

  const login = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, { email });
      const authorData = response.data;
      
      // Save author data
      setAuthor(authorData);
      await AsyncStorage.setItem('author', JSON.stringify(authorData));
      
      return authorData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('author');
      setAuthor(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    author,
    loading,
    login,
    logout,
    isLoggedIn: !!author,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 