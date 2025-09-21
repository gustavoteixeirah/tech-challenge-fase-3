import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useAuth } from "../auth/AuthContext";

export default function SignUpScreen() {
  const { signUp } = useAuth();
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
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Criar conta</Text>

      <TextInput
        placeholder="Como quer ser chamado(a)?"
        value={name}
        onChangeText={setName}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="senha (≥6)"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />

      <Button title={submitting ? "Cadastrando..." : "Cadastrar"} onPress={onSubmit} disabled={submitting} />
    </View>
  );
}
