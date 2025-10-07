import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useAuth } from "../auth/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function SignUpScreen() {
  const { signUp } = useAuth();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!name || name.trim().length < 2) {
      return Alert.alert("Erro", "Digite um nome (mín. 2 caracteres).");
    }
    if (!email || !pass || pass.length < 6) {
      return Alert.alert("Erro", "Senha deve ter pelo menos 6 caracteres.");
    }
    try {
      setSubmitting(true);
      await signUp(email, pass, name.trim());
      Alert.alert("Sucesso", `Conta criada! Bem-vindo(a), ${name.trim()}.`);
    } catch (e: any) {
      Alert.alert("Falha no cadastro", e?.message ?? "Tente novamente");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Logo */}
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>💰</Text>
        </View>
        <Text style={styles.title}>Tech Challenge</Text>
        <Text style={styles.subtitle}>Fase 3 - Grupo 5</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Criar conta</Text>

        <TextInput
          placeholder="Como quer ser chamado(a)?"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

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
          placeholder="senha (≥6)"
          placeholderTextColor="#999"
          secureTextEntry
          value={pass}
          onChangeText={setPass}
          style={styles.input}
        />

        <Button
          title={submitting ? "Cadastrando..." : "Cadastrar"}
          onPress={onSubmit}
          disabled={submitting}
          color="#d8e373"
        />

        <Text
          style={styles.linkText}
          onPress={() => (navigation as any).navigate("SignIn")}
        >
          Já tem uma conta? Entrar
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(216, 227, 115, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#d8e373",
  },
  iconText: {
    fontSize: 40,
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#d8e373",
    fontWeight: "600",
  },
  formContainer: {
    padding: 16,
    gap: 12,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(216, 227, 115, 0.3)",
    color: "#FFFFFF",
  },
  linkText: {
    textDecorationLine: "underline",
    color: "#d8e373",
    textAlign: "center",
    marginTop: 16,
  },
});
