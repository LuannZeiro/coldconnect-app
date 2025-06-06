import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createAbrigo, deleteAbrigo, getAbrigos } from '../services/abrigosService';
import { useAuth } from '../contexts/AuthContext';

export default function AbrigosScreen() {
  const [abrigos, setAbrigos] = useState([]);
  const [novoNome, setNovoNome] = useState('');
  const [novaLocalizacao, setNovaLocalizacao] = useState('');
  const [novaCapacidadeTotal, setNovaCapacidadeTotal] = useState('');
  const [novaCapacidadeAtual, setNovaCapacidadeAtual] = useState('');
  const [novoStatus, setNovoStatus] = useState('ATIVO');
  const [modalVisible, setModalVisible] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      carregarAbrigos();
    }
  }, [token]);

  const carregarAbrigos = async () => {
    try {
      const res = await getAbrigos(token);
      setAbrigos(res.data || []);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar abrigos');
    }
  };

  const adicionarAbrigo = async () => {
    if (!novoNome || !novaLocalizacao || !novaCapacidadeTotal || !novaCapacidadeAtual) {
      Alert.alert('Atenção', 'Preencha todas as informações.');
      return;
    }

    const novoAbrigo = {
      nome: novoNome,
      localizacao: novaLocalizacao,
      capacidadeTotal: parseInt(novaCapacidadeTotal),
      capacidadeAtual: parseInt(novaCapacidadeAtual),
      status: novoStatus
    };

    try {
      await createAbrigo(novoAbrigo, token);
      setNovoNome('');
      setNovaLocalizacao('');
      setNovaCapacidadeTotal('');
      setNovaCapacidadeAtual('');
      setNovoStatus('ATIVO');
      setModalVisible(false);
      carregarAbrigos();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar abrigo, esteja logado para adicionar um novo abrigo');
    }
  };

  const excluirAbrigo = async (id) => {
    try {
      await deleteAbrigo(id, token);
      carregarAbrigos();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao excluir abrigo');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Abrigos</Text>

      <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalVisible(true)}>
        <Text style={styles.botaoTexto}>Adicionar Novo Abrigo</Text>
      </TouchableOpacity>

      <FlatList
        data={abrigos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nomeAbrigo}>{item.nome}</Text>
            <Text style={styles.localizacao}>📍 {item.localizacao}</Text>
            <Text style={styles.info}>Capacidade Total: {item.capacidadeTotal}</Text>
            <Text style={styles.info}>Capacidade Atual: {item.capacidadeAtual}</Text>
            <Text style={styles.info}>Status: {item.status}</Text>
            <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirAbrigo(item.id)}>
              <Text style={styles.botaoTexto}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.semDados}>Nenhum abrigo cadastrado</Text>}
      />

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>Novo Abrigo</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={novoNome}
              onChangeText={setNovoNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Localização"
              value={novaLocalizacao}
              onChangeText={setNovaLocalizacao}
            />
            <TextInput
              style={styles.input}
              placeholder="Capacidade Total"
              keyboardType="numeric"
              value={novaCapacidadeTotal}
              onChangeText={setNovaCapacidadeTotal}
            />
            <TextInput
              style={styles.input}
              placeholder="Capacidade Atual"
              keyboardType="numeric"
              value={novaCapacidadeAtual}
              onChangeText={setNovaCapacidadeAtual}
            />

            <Text style={styles.label}>Status:</Text>
            <Picker
              selectedValue={novoStatus}
              onValueChange={(itemValue) => setNovoStatus(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="ATIVO" value="ATIVO" />
              <Picker.Item label="INATIVO" value="INATIVO" />
            </Picker>

            <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarAbrigo}>
              <Text style={styles.botaoTexto}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalVisible(false)}>
              <Text style={styles.botaoTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e3f2fd', padding: 20 },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  botaoAdicionar: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 10, marginBottom: 20 },
  botaoExcluir: { backgroundColor: '#e53935', padding: 10, borderRadius: 8, marginTop: 10 },
  botaoCancelar: { backgroundColor: '#999', padding: 10, borderRadius: 8, marginTop: 10 },
  botaoTexto: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 15, elevation: 3 },
  nomeAbrigo: { fontSize: 18, fontWeight: '500', color: '#333' },
  localizacao: { marginTop: 5, color: '#666' },
  info: { marginTop: 5, color: '#444', fontWeight: 'bold' },
  semDados: { textAlign: 'center', marginTop: 20, color: '#999', fontStyle: 'italic' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, padding: 12, borderRadius: 10, marginBottom: 10 },
  label: { fontSize: 16, fontWeight: '500', marginTop: 10, marginBottom: 5, color: '#333' },
  picker: { backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, borderRadius: 10, marginBottom: 10 }
});
