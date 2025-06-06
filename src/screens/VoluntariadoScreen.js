import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LuannFoto from '../components/img/LuannFoto.jpg';
import HenzoFoto from '../components/img/HenzoFoto.jpg';

const imagensLocais = {
  'Luann Mariano': LuannFoto,
  'Henzo Puchetti': HenzoFoto,
};

export default function Voluntarios() {
  const [usuariosCadastrados, setUsuariosCadastrados] = useState([]);

  const voluntariosFakes = [
    {
      nome: 'Luann Mariano',
      rm: '558548',
      foto: 'local',
    },
    {
      nome: 'Henzo Puchetti',
      rm: '555179',
      foto: 'local',
    },
    {
      nome: 'Fernanda Souza',
      rm: '345678',
      foto: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    {
      nome: 'Lucas Oliveira',
      rm: '456789',
      foto: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
  ];

  useEffect(() => {
    const carregarUsuarios = async () => {
      // Descomente para limpar dados antigos:
      await AsyncStorage.removeItem('usuarios');

      await AsyncStorage.setItem('usuarios', JSON.stringify(voluntariosFakes));
      setUsuariosCadastrados(voluntariosFakes);
    };

    carregarUsuarios();
  }, []);

  const obterImagem = (nome, foto) => {
    if (foto === 'local' && imagensLocais[nome]) {
      return imagensLocais[nome];
    }
    return { uri: foto };
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Voluntários Cadastrados</Text>
      <View style={styles.lista}>
        {usuariosCadastrados.length > 0 ? (
          usuariosCadastrados.map((u, index) => (
            <View key={index} style={styles.infoBox}>
              <Image source={obterImagem(u.nome, u.foto)} style={styles.foto} />
              <Text style={styles.infoTexto}>
                <Text style={styles.infoLabel}>Nome:</Text> {u.nome}
              </Text>
              <Text style={styles.infoTexto}>
                <Text style={styles.infoLabel}>RM:</Text> {u.rm}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.infoTexto}>Nenhum voluntário cadastrado.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e3f2fd',
    padding: 20,
    alignItems: 'center',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    width: '48%',
    elevation: 3,
    alignItems: 'center',
  },
  foto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  infoTexto: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
    textAlign: 'center',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
});
