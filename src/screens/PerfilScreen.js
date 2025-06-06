import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Perfil() {
  const { token, userEmail, login, logout } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

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
      const response = await fetch('http://10.0.2.2:8080/auth/register', {
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
        await login(data.token, email);
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
    await logout();
    Alert.alert('Sucesso', 'Logout realizado!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {token ? (
        <View style={styles.perfilCard}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=8' }}
            style={styles.avatar}
          />
          <Text style={styles.boasVindas}>Olá!</Text>
          <Text style={styles.infoTexto}>{userEmail}</Text>
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
  container: {
    flexGrow: 1,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    marginVertical: 5,
  },
  botaoSecundario: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  botaoLogout: {
    backgroundColor: '#e53935',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
    width: '100%',
  },
  botaoTexto: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  perfilCard: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    elevation: 6,
    alignItems: 'center',
  },
  boasVindas: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#1976d2',
  },
  infoTexto: {
    fontSize: 18,
    marginTop: 5,
    color: '#555',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#2196F3',
  },
});
