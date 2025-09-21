import React from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../auth/AuthContext";

export default function HomeScreen() {
  const { user, logOut } = useAuth();
  const display = user?.displayName?.trim() || user?.email || "Usuário";

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 8 }}>
      <Text style={{ fontSize: 18 }}>Bem-vindo(a), {display}!</Text>
      <Button title="Sair" onPress={logOut} />
    </View>
  );
}
