import React, { useState } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { useAuth } from "../auth/AuthContext";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import { addTransaction } from "../services/transactions";
import { TransactionForm } from "../components/TransactionForm";
import { Transaction } from "../types/transactions";

function showToast(message: string, type: "success" | "error" = "error") {
  Toast.show({
    type,
    text1: message,
    position: "top",
    visibilityTime: 3000,
  });
}

export default function NewTransactionScreen() {
  const { user } = useAuth();
  const uid = user?.uid;
  const navigation = useNavigation();

  async function handleCreateTransaction(transaction) {
    if (!uid) return showToast("Usuário não autenticado");

    try {
      await addTransaction(uid, transaction);
      showToast("Transação adicionada!", "success");
      navigation.navigate("Home" as never);
    } catch (error: any) {
      showToast(error.message || "Erro ao adicionar transação");
    }
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title="Nova Transação"
        showUserInfo={false}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <TransactionForm
        onClick={handleCreateTransaction}
        buttonLabel="Criar Transação"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 50,
    paddingTop: 20,
    gap: 8,
  },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  listTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
  button: {
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 15,
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  txTitle: { fontSize: 16 },
  txAmount: { fontSize: 16, fontWeight: "600" },
  dropdown: { borderColor: "#ccc", borderRadius: 6, marginBottom: 15 },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 6,
    borderColor: "#ccc",
  },
});
