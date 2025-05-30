import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    const carregarToken = async () => {
      const tokenSalvo = await AsyncStorage.getItem('token');
      if (tokenSalvo) {
        setToken(tokenSalvo);
        setIsLogin(false);
      }
    };
    carregarToken();
  }, []);

  const handleRegister = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Usuário registrado!');
        setIsLogin(true);
        limparCampos();
      } else {
        const erro = await response.text();
        Alert.alert('Erro', erro);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar.');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha email e senha.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        await AsyncStorage.setItem('token', data.token);
        setToken(data.token);
        setIsLogin(false);
        limparCampos();
      } else {
        const erro = await response.text();
        Alert.alert('Erro', erro);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer login.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setIsLogin(true);
  };

  const limparCampos = () => {
    setEmail('');
    setSenha('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {token && !isLogin ? (
        <View style={styles.perfil}>
          <Text style={styles.titulo}>Bem-vindo!</Text>
          <Text style={styles.infoTexto}>Token: {token.substring(0, 20)}...</Text>
          <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
            <Text style={styles.botaoTexto}>Sair</Text>
          </TouchableOpacity>
        </View>
      ) : isLogin ? (
        <View style={styles.form}>
          <Text style={styles.titulo}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity style={styles.botao} onPress={handleRegister}>
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
  perfil: { alignItems: 'center' },
  form: { backgroundColor: 'white', padding: 20, borderRadius: 15, elevation: 5 },
  infoTexto: { fontSize: 16, marginBottom: 5, color: '#555' },
});
