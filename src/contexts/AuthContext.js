import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('authToken');
        const emailSalvo = await AsyncStorage.getItem('userEmail');
        if (tokenSalvo) {
          setToken(tokenSalvo);
          setUserEmail(emailSalvo);
        }
      } catch (error) {
        console.error('Erro ao carregar dados de autenticação:', error);
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, []);

  const login = async (novoToken, email) => {
    try {
      setToken(novoToken);
      setUserEmail(email);
      await AsyncStorage.setItem('authToken', novoToken);
      await AsyncStorage.setItem('userEmail', email);
    } catch (error) {
      console.error('Erro ao salvar dados de login:', error);
    }
  };

  const logout = async () => {
    try {
      setToken(null);
      setUserEmail(null);
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userEmail');
    } catch (error) {
      console.error('Erro ao remover dados de logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ token, userEmail, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
