import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function DoacoesScreen() {
  const [tipoRecurso, setTipoRecurso] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [abrigoId, setAbrigoId] = useState('');
  const [solicitacoes, setSolicitacoes] = useState([]);

  const { token } = useAuth();
  const alertaId = 1; // fixo e não editável

  const carregarSolicitacoes = async () => {
    try {
      const resposta = await fetch('http://10.0.2.2:8080/solicitacoes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (resposta.ok) {
        const dados = await resposta.json();
        setSolicitacoes(dados);
      } else {
        console.log('Erro ao buscar solicitações');
      }
    } catch (error) {
      console.error('Erro na requisição GET:', error);
    }
  };

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const enviarSolicitacao = async () => {
    if (!tipoRecurso || !quantidade || !abrigoId) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const resposta = await fetch('http://10.0.2.2:8080/solicitacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tipoRecurso,
          quantidade: parseInt(quantidade),
          abrigoId: parseInt(abrigoId),
          alertaId, // envia fixo
        }),
      });

      if (resposta.ok) {
        Alert.alert('Sucesso', 'Solicitação enviada com sucesso!');
        setTipoRecurso('');
        setQuantidade('');
        setAbrigoId('');
        carregarSolicitacoes();
      } else {
        const erro = await resposta.json();
        Alert.alert('Erro', erro.message || 'Erro ao enviar solicitação.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro de conexão com o servidor.');
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Solicitação de Doações</Text>

        <TextInput
          style={styles.input}
          placeholder="Tipo de Recurso (ex: Cobertores)"
          value={tipoRecurso}
          onChangeText={setTipoRecurso}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          keyboardType="numeric"
          value={quantidade}
          onChangeText={setQuantidade}
        />
        <TextInput
          style={styles.input}
          placeholder="ID do Abrigo"
          keyboardType="numeric"
          value={abrigoId}
          onChangeText={setAbrigoId}
        />

        <TouchableOpacity style={styles.botao} onPress={enviarSolicitacao}>
          <Text style={styles.botaoTexto}>Enviar Solicitação</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitulo}>Solicitações Realizadas</Text>
      {solicitacoes.length === 0 ? (
        <Text style={styles.semSolicitacoes}>Nenhuma solicitação ainda.</Text>
      ) : (
        <FlatList
          data={solicitacoes}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemSolicitacao}>
              <Text style={styles.itemTexto}>
                • {item.tipoRecurso} - {item.quantidade} unidades
              </Text>
              <Text style={styles.itemInfo}>
                Abrigo #{item.abrigoId} | Alerta #{item.alertaId}
              </Text>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e3f2fd',
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    elevation: 6,
    marginBottom: 25,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1976d2',
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  itemSolicitacao: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  itemTexto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemInfo: {
    fontSize: 14,
    color: '#555',
  },
  semSolicitacoes: {
    fontStyle: 'italic',
    color: '#777',
  },
});
