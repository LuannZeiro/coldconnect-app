import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View>
      <Text>Bem-vindo ao ColdConnect!</Text>
      <Button title="Abrigos" onPress={() => navigation.navigate('Abrigos')} />
      <Button title="Doações" onPress={() => navigation.navigate('Doações')} />
      <Button title="Voluntariado" onPress={() => navigation.navigate('Voluntariado')} />
      <Button title="Perfil" onPress={() => navigation.navigate('Perfil')} />
    </View>
  );
}
