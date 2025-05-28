import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import AbrigosScreen from '../screens/AbrigosScreen';
import DoacoesScreen from '../screens/DoacoesScreen';
import VoluntariadoScreen from '../screens/VoluntariadoScreen'
import PerfilScreen from '../screens/PerfilScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Abrigos':
                iconName = 'business';
                break;
              case 'Doações':
                iconName = 'heart';
                break;
              case 'Voluntários':
                iconName = 'people';
                break;
              case 'Perfil':
                iconName = 'person';
                break;
              default:
                iconName = 'ellipse';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1e90ff',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Abrigos" component={AbrigosScreen} />
        <Tab.Screen name="Doações" component={DoacoesScreen} />
        <Tab.Screen name="Voluntários" component={VoluntariadoScreen} />
        <Tab.Screen name="Perfil" component={PerfilScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
