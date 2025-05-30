import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Snowflake, ThermometerSnowflake, AlertTriangle } from 'lucide-react-native';

export default function DashboardScreen() {
  // Dados fake
  const dadosClima = {
    regiao: 'Centro-Oeste',
    temperatura: 6,
    grauAlerta: 'GRAVE',
    acoes: ['Abrigos abertos', 'Solicitar doações', 'Alerta geral emitido']
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Dashboard Climático</Text>

      <View style={styles.card}>
        <Snowflake color="#0077b6" size={32} />
        <Text style={styles.cardTitulo}>Região: {dadosClima.regiao}</Text>
        <Text style={styles.cardTexto}>Temperatura Atual: {dadosClima.temperatura}°C</Text>
        <Text style={styles.cardTexto}>Grau de Alerta: {dadosClima.grauAlerta}</Text>
      </View>

      <View style={styles.card}>
        <ThermometerSnowflake color="#0077b6" size={32} />
        <Text style={styles.cardTitulo}>Ações Emergenciais:</Text>
        {dadosClima.acoes.map((acao, index) => (
          <Text key={index} style={styles.cardTexto}>• {acao}</Text>
        ))}
      </View>

      <View style={styles.alertaBox}>
        <AlertTriangle color="#e63946" size={28} />
        <Text style={styles.alertaTexto}>
          Atenção: Temperaturas extremamente baixas! Redobre os cuidados com a população vulnerável.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077b6',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    gap: 10,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#023e8a',
  },
  cardTexto: {
    fontSize: 16,
    color: '#333',
  },
  alertaBox: {
    backgroundColor: '#ffe5ec',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  alertaTexto: {
    color: '#e63946',
    fontWeight: '600',
    flex: 1,
  },
});
