import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
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
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: "600" }}>Entrar</Text>
      <TextInput
        placeholder="email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />
      <TextInput
        placeholder="senha"
        secureTextEntry
        value={pass}
        onChangeText={setPass}
        style={{ borderWidth: 1, padding: 10, borderRadius: 8 }}
      />
      <Button title={submitting ? "Entrando..." : "Entrar"} onPress={onSubmit} disabled={submitting} />
      <Text style={{ textDecorationLine: "underline" }} onPress={() => navigation.navigate("SignUp")}>
        Criar uma conta
      </Text>
    </View>
  );
}
