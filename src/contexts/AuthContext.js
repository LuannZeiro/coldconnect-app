import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const carregarToken = async () => {
      const tokenSalvo = await AsyncStorage.getItem('authToken');
      if (tokenSalvo) {
        setToken(tokenSalvo);
      }
    };
    carregarToken();
  }, []);

  const login = async (novoToken) => {
    setToken(novoToken);
    await AsyncStorage.setItem('authToken', novoToken);
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
