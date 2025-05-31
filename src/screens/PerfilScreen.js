import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Perfil() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const carregarToken = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem('token');
        if (tokenSalvo) {
          setToken(tokenSalvo);
          setUsuario({ email: 'Usuário Autenticado' });
          setIsLogin(false);
        }
      } catch (error) {
        console.error('Erro ao carregar token:', error);
      }
    };
    carregarToken();
  }, []);

  const salvarToken = async (novoToken) => {
    try {
      await AsyncStorage.setItem('token', novoToken);
      setToken(novoToken);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  };

  const limparCampos = () => {
    setEmail('');
    setSenha('');
  };

  const registrarUsuario = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8080/auth/register', { // ip do emulador android studio
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Usuário registrado!');
        limparCampos();
        setIsLogin(true);
      } else {
        const erro = await response.text();
        Alert.alert('Erro', `Falha no registro: ${erro}`);
      }
    } catch (error) {
      Alert.alert('Erro', `Erro na requisição: ${error.message}`);
    }
  };

  const realizarLogin = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Erro', 'Preencha email e senha.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        await salvarToken(data.token);
        setUsuario({ email });
        setIsLogin(false);
        limparCampos();
        Alert.alert('Sucesso', 'Login realizado!');
      } else {
        const erro = await response.text();
        Alert.alert('Erro', `Falha no login: ${erro}`);
      }
    } catch (error) {
      Alert.alert('Erro', `Erro na requisição: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken('');
      setUsuario(null);
      setIsLogin(true);
      Alert.alert('Sucesso', 'Logout realizado!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {usuario && !isLogin ? (
        <View style={styles.perfil}>
          <Text style={styles.titulo}>Bem-vindo!</Text>
          <Text style={styles.infoTexto}>Email: {usuario.email}</Text>
          <TouchableOpacity style={styles.botaoLogout} onPress={handleLogout}>
            <Text style={styles.botaoTexto}>Sair</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.titulo}>{isLogin ? 'Login' : 'Cadastro'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity style={styles.botao} onPress={isLogin ? realizarLogin : registrarUsuario}>
            <Text style={styles.botaoTexto}>{isLogin ? 'Entrar' : 'Registrar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botaoSecundario} onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.botaoTexto}>{isLogin ? 'Cadastrar' : 'Voltar ao Login'}</Text>
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
