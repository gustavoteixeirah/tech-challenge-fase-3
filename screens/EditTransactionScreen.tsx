import React from "react";
import { View, StyleSheet } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useAuth } from "../auth/AuthContext";
import { updateTransaction } from "../services/transactions";
import { TransactionForm } from "../components/TransactionForm";
import { Transaction } from "../types/transactions";
import CustomHeader from "../components/CustomHeader";
import { useTransaction } from "../context/TransactionContext";
import { useEffect } from "react";

export default function EditTransactionScreen() {
  const { transaction, setTransaction } = useTransaction();
  const navigation = useNavigation();
  const { user } = useAuth();
  const uid = user?.uid;

  useEffect(() => {
    if (!transaction) {
      navigation.goBack();}
  }, [transaction, navigation]);

  // Limpar contexto de transação no unmount
  useEffect(() => {
    return () => {
      setTransaction(null);
    };
  }, [setTransaction]);

  if (!transaction) {
    (navigation as any).navigate("Home");
  }

  async function handleEdit(updatedTransaction: Transaction ) {
    if (!uid) {
      return Toast.show({ type: "error", text1: "Usuário não autenticado" });
    }

    console.log("Updated", updatedTransaction)

    try {
      await updateTransaction(uid, updatedTransaction.id, updatedTransaction);

      Toast.show({ type: "success", text1: "Transação atualizada!" });
      navigation.goBack();
    } catch (error: any) {
      Toast.show({ type: "error", text1: error.message || "Erro ao atualizar transação" });
    }
  }


  return (
    <View style={styles.container}>
      <CustomHeader
              title="Editar Transação"
              showUserInfo={false}
              showBackButton={true}
              onBackPress={() => navigation.goBack()}
      />
      <TransactionForm
        key={transaction?.id}
        onClick={handleEdit}
        buttonLabel="Salvar Alterações"
        defaultValues={transaction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
