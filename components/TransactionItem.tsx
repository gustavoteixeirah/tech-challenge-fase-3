import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Transaction, TransactionTypeEnum } from "../types/transactions";
import { IconPencil, IconTrash } from "../Icons/Icons/icons";

export const TransactionItem = ({ transaction, onEdit, onDelete }: { transaction: Transaction, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
  function handleEdit(id: any): void {
    onEdit(id);
  }

  function handleDelete(id: any): void {
    onDelete(id);
  }

  function formatAmount(amount: number): string {
  const formatted = amount.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
  return transaction.type === TransactionTypeEnum.DEPOSIT
    ? `${formatted}`
    : `- ${formatted} `;
}

  return (
    <React.Fragment>
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.subtitle}>{transaction.type === TransactionTypeEnum.DEPOSIT ? "Depósito" : "Transferência"}</Text>
          <Text style={styles.title}>{transaction.description}</Text>
          <Text style={styles.amount}>{formatAmount(transaction.amount)}</Text>
        </View>
        <Pressable
          style={styles.button}
          onPress={() => handleEdit(transaction.id)}
        >
          <IconPencil/>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => handleDelete(transaction.id)}
        >
          <IconTrash />
      
        </Pressable>
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
   item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 16 },
  subtitle: { fontSize: 12, color: "#666" },
  amount: { fontSize: 16, fontWeight: "bold" },
  button: {
    backgroundColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default TransactionItem;
