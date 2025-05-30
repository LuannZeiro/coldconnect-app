import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Voluntarios() {
  const [usuariosCadastrados, setUsuariosCadastrados] = useState([]);

  useEffect(() => {
    const carregarUsuarios = async () => {
      const dados = await AsyncStorage.getItem('usuarios');
      if (dados) {
        setUsuariosCadastrados(JSON.parse(dados));
      }
    };

    carregarUsuarios();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Voluntários Cadastrados</Text>
      <View style={styles.lista}>
        {usuariosCadastrados.length > 0 ? (
          usuariosCadastrados.map((u, index) => (
            <View key={index} style={styles.infoBox}>
              {u.foto && <Image source={{ uri: u.foto }} style={styles.foto} />}
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
    backgroundColor: '#f0f4f7',
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
