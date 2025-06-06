import React from 'react';
import TabNavigator from './src/navigation/TabNavigator';
import { AuthProvider } from './src/contexts/AuthContext'; // ajuste o caminho conforme necessário

export default function App() {
  return (
    <AuthProvider>
      <TabNavigator />
    </AuthProvider>
  );
}
