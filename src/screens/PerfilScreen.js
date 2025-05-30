import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [nome, setNome] = useState('');
  const [rm, setRm] = useState('');
  const [senha, setSenha] = useState('');
  const [foto, setFoto] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [senhaLogin, setSenhaLogin] = useState('');

  useEffect(() => {
    const carregarUsuario = async () => {
      const dados = await AsyncStorage.getItem('usuarioLogado');
      if (dados) {
        setUsuario(JSON.parse(dados));
        setIsLogin(false);
      }
    };
    carregarUsuario();
  }, [isLogin]);

  const escolherFoto = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const salvarUsuario = async () => {
    if (!nome.trim() || !rm.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    const usuarioObj = { nome, rm, senha, foto };
    const dados = await AsyncStorage.getItem('usuarios');
    const usuarios = dados ? JSON.parse(dados) : [];

    const jaExiste = usuarios.some(u => u.rm === rm);
    if (jaExiste) {
      Alert.alert('Erro', 'Este RM já está cadastrado.');
      return;
    }

    usuarios.push(usuarioObj);
    await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));
    Alert.alert('Sucesso', 'Usuário cadastrado!');
    limparCampos();
    setIsLogin(true);
  };

  const handleLogin = async () => {
    if (!rm.trim() || !senhaLogin.trim()) {
      Alert.alert('Erro', 'Preencha RM e senha.');
      return;
    }

    const dados = await AsyncStorage.getItem('usuarios');
    if (dados) {
      const usuarios = JSON.parse(dados);
      const usuarioEncontrado = usuarios.find(
        u => u.rm === rm && u.senha === senhaLogin
      );

      if (usuarioEncontrado) {
        setUsuario(usuarioEncontrado);
        await AsyncStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
        setIsLogin(false);
        limparCampos();
      } else {
        Alert.alert('Erro', 'RM ou senha incorretos.');
      }
    } else {
      Alert.alert('Erro', 'Nenhum usuário cadastrado.');
    }
  };

  const limparCampos = () => {
    setNome('');
    setRm('');
    setSenha('');
    setFoto(null);
    setSenhaLogin('');
  };

  const handleLogout = async () => {
    setUsuario(null);
    await AsyncStorage.removeItem('usuarioLogado');
    setIsLogin(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {usuario && !isLogin ? (
        <View style={styles.perfil}>
          <Text style={styles.titulo}>Meu Perfil</Text>
          {usuario.foto && <Image source={{ uri: usuario.foto }} style={styles.foto} />}
          <Text style={styles.infoTexto}>
            <Text style={styles.infoLabel}>Nome:</Text> {usuario.nome}
          </Text>
          <Text style={styles.infoTexto}>
            <Text style={styles.infoLabel}>RM:</Text> {usuario.rm}
          </Text>

          <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
            <Text style={styles.botaoTexto}>Sair</Text>
          </TouchableOpacity>
        </View>
      ) : isLogin ? (
        <View style={styles.form}>
          <Text style={styles.titulo}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="RM"
            value={rm}
            onChangeText={setRm}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senhaLogin}
            onChangeText={setSenhaLogin}
          />
          <TouchableOpacity style={styles.botao} onPress={handleLogin}>
            <Text style={styles.botaoTexto}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoSecundario} onPress={() => setIsLogin(false)}>
            <Text style={styles.botaoTexto}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.titulo}>Cadastro</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="RM"
            value={rm}
            onChangeText={setRm}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity style={styles.botao} onPress={escolherFoto}>
            <Text style={styles.botaoTexto}>Escolher Foto</Text>
          </TouchableOpacity>
          {foto && <Image source={{ uri: foto }} style={styles.foto} />}
          <TouchableOpacity style={styles.botao} onPress={salvarUsuario}>
            <Text style={styles.botaoTexto}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoSecundario} onPress={() => setIsLogin(true)}>
            <Text style={styles.botaoTexto}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f0f4f7', justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', backgroundColor: 'white', padding: 12, borderRadius: 10, marginBottom: 15 },
  botao: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, marginVertical: 5 },
  botaoSecundario: { backgroundColor: '#2196F3', padding: 15, borderRadius: 10, marginVertical: 5 },
  botaoLogout: { backgroundColor: '#e53935', padding: 15, borderRadius: 10, marginTop: 20 },
  botaoTexto: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  foto: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginVertical: 10 },
  perfil: { alignItems: 'center' },
  form: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 5 },
  infoTexto: { fontSize: 16, marginBottom: 5, color: '#555' },
  infoLabel: { fontWeight: 'bold', color: '#333' },
});
