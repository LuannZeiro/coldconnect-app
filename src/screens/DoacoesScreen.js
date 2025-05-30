import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DoacoesScreen() {
  const [valor, setValor] = useState('');
  const [doacoes, setDoacoes] = useState([]);
  const [totalDoado, setTotalDoado] = useState(0);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      const dadosUsuario = await AsyncStorage.getItem('usuarioLogado');
      if (dadosUsuario) {
        const usuarioObj = JSON.parse(dadosUsuario);
        console.log('Usuário logado:', usuarioObj);
        setUsuario(usuarioObj);
      }

      const dadosDoacoes = await AsyncStorage.getItem('doacoes');
      if (dadosDoacoes) {
        setDoacoes(JSON.parse(dadosDoacoes));
      }

      const total = await AsyncStorage.getItem('totalDoado');
      if (total) {
        setTotalDoado(parseFloat(total));
      }
    };

    carregarDados();
  }, []);

  // Sempre que as doações mudarem, salva no AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem('doacoes', JSON.stringify(doacoes));
    AsyncStorage.setItem('totalDoado', totalDoado.toString());
  }, [doacoes, totalDoado]);

  const doar = () => {
    if (!usuario) {
      Alert.alert('Atenção', 'Você precisa estar logado para doar.');
      return;
    }

    const numero = parseFloat(valor);
    if (isNaN(numero) || numero <= 0) {
      Alert.alert('Valor inválido', 'Digite um valor válido para doar.');
      return;
    }

    const novaDoacao = { nome: usuario.nome, valor: numero };
    const novaLista = [...doacoes, novaDoacao];
    setDoacoes(novaLista);
    setTotalDoado(totalDoado + numero);
    setValor('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Doações</Text>
      <Text style={styles.total}>Total Doado: R$ {totalDoado.toFixed(2)}</Text>

      {usuario && (
        <Text style={styles.bemVindo}>Bem-vindo, {usuario.nome}! Obrigado por doar.</Text>
      )}

      <FlatList
        data={doacoes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Text style={styles.item}>
            #{index + 1} - {item.nome}: R$ {item.valor.toFixed(2)}
          </Text>
        )}
        ListEmptyComponent={<Text style={styles.semDados}>Nenhuma doação ainda</Text>}
      />

      <TextInput
        style={styles.input}
        placeholder="Digite o valor da doação"
        value={valor}
        onChangeText={setValor}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={[styles.botao, !usuario && styles.botaoDesativado]}
        onPress={doar}
        disabled={!usuario}
      >
        <Text style={styles.textoBotao}>Doar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f7', padding: 20 },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#333' },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#4CAF50' },
  bemVindo: { fontSize: 16, marginBottom: 10, color: '#555', textAlign: 'center' },
  item: { padding: 10, backgroundColor: '#fff', marginVertical: 5, borderRadius: 8, elevation: 2 },
  input: { backgroundColor: '#fff', borderColor: '#ccc', borderWidth: 1, padding: 12, borderRadius: 10, marginTop: 20, marginBottom: 10 },
  botao: { backgroundColor: '#4CAF50', padding: 12, borderRadius: 10, alignItems: 'center' },
  botaoDesativado: { backgroundColor: '#aaa' },
  textoBotao: { color: 'white', fontWeight: 'bold' },
  semDados: { textAlign: 'center', marginTop: 20, color: '#999', fontStyle: 'italic' },
});
