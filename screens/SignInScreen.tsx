import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StatusBar, StyleSheet } from "react-native";
import { useAuth } from "../auth/AuthContext";

export default function SignInScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email || !pass) return Alert.alert("Erro", "Preencha e-mail e senha.");
    try {
      setSubmitting(true);
      await signIn(email, pass);
    } catch (e: any) {
      Alert.alert("Falha no login", e?.message ?? "Tente novamente");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      

      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>💰</Text>
        </View>
        <Text style={styles.title}>Tech Challenge</Text>
        <Text style={styles.subtitle}>Fase 3</Text>
      </View>


      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Entrar</Text>
        <TextInput
          placeholder="email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
          style={styles.input}
        />
        <Button 
          title={submitting ? "Entrando..." : "Entrar"} 
          onPress={onSubmit} 
          disabled={submitting}
          color="#d8e373"
        />
        <Text 
          style={styles.linkText} 
          onPress={() => navigation.navigate("SignUp")}
        >
          Criar uma conta
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    padding: 20
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(216, 227, 115, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#d8e373'
  },
  iconText: {
    fontSize: 40,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: '#d8e373',
    fontWeight: '600'
  },
  formContainer: {
    padding: 16,
    gap: 12
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: '#FFFFFF',
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(216, 227, 115, 0.3)',
    color: '#FFFFFF'
  },
  linkText: {
    textDecorationLine: "underline",
    color: '#d8e373',
    textAlign: 'center',
    marginTop: 16
  }
});
