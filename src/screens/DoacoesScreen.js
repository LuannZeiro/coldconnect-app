import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function DoacoesScreen() {
  const [tipoRecurso, setTipoRecurso] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [abrigoId, setAbrigoId] = useState('');
  const [alertaId, setAlertaId] = useState('');
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      const dadosUsuario = await AsyncStorage.getItem('usuarioLogado');
      if (dadosUsuario) {
        const usuarioObj = JSON.parse(dadosUsuario);
        setUsuario(usuarioObj);
      }
    };
    carregarUsuario();
  }, []);

  const enviarSolicitacao = async () => {
    if (!usuario) {
      Alert.alert('Atenção', 'Você precisa estar logado para enviar uma solicitação.');
      return;
    }

    if (!tipoRecurso || !quantidade || !abrigoId || !alertaId) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const novaSolicitacao = {
      tipoRecurso: tipoRecurso,
      quantidade: parseInt(quantidade),
      abrigoId: parseInt(abrigoId),
      alertaId: parseInt(alertaId)
    };

    try {
      const response = await fetch('http://localhost:8080/solicitacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaSolicitacao)
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Solicitação enviada com sucesso!');
        setSolicitacoes([...solicitacoes, novaSolicitacao]);

        // Limpa os campos
        setTipoRecurso('');
        setQuantidade('');
        setAbrigoId('');
        setAlertaId('');
      } else {
        Alert.alert('Erro', 'Não foi possível enviar a solicitação.');
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao enviar a solicitação.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Solicitar Recursos</Text>

      {usuario && (
        <Text style={styles.bemVindo}>Bem-vindo, {usuario.nome}!</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Tipo de Recurso (ex: Cobertores)"
        value={tipoRecurso}
        onChangeText={setTipoRecurso}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantidade}
        onChangeText={setQuantidade}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Abrigo ID"
        value={abrigoId}
        onChangeText={setAbrigoId}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Alerta ID"
        value={alertaId}
        onChangeText={setAlertaId}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.botao, !usuario && styles.botaoDesativado]}
        onPress={enviarSolicitacao}
        disabled={!usuario}
      >
        <Text style={styles.textoBotao}>Enviar Solicitação</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Solicitações Enviadas</Text>

      <FlatList
        data={solicitacoes}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Text style={styles.item}>
            #{index + 1} - {item.tipoRecurso} ({item.quantidade}) - Abrigo {item.abrigoId}, Alerta {item.alertaId}
          </Text>
        )}
        ListEmptyComponent={<Text style={styles.semDados}>Nenhuma solicitação enviada ainda</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f4f7', 
    padding: 20 
  },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    textAlign: 'center', 
    color: '#333' 
  },
  bemVindo: { fontSize: 16, marginBottom: 10, color: '#555', textAlign: 'center' },
  item: { padding: 10, backgroundColor: '#fff', marginVertical: 5, borderRadius: 8, elevation: 2 },
  input: { backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, padding: 12, borderRadius: 10, marginTop: 10 },
  botao: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  botaoDesativado: { backgroundColor: '#aaa' },
  textoBotao: { color: 'white', fontWeight: 'bold' },
  semDados: { textAlign: 'center', marginTop: 20, color: '#999', fontStyle: 'italic' },
});
