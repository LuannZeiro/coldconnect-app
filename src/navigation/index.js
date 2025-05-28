import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AbrigosScreen from '../screens/AbrigosScreen';
import DoacoesScreen from '../screens/DoacoesScreen';
import VoluntariadoScreen from '../screens/VoluntariadoScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Abrigos" component={AbrigosScreen} />
        <Stack.Screen name="Doações" component={DoacoesScreen} />
        <Stack.Screen name="Voluntariado" component={VoluntariadoScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
