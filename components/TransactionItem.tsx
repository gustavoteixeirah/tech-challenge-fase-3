import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Transaction, TransactionTypeEnum } from "../types/transactions";
import { IconPencil, IconTrash } from "../Icons/Icons/icons";

export const TransactionItem = ({
  transaction,
  onEdit,
  onDelete,
}: {
  transaction: Transaction;
  onEdit;
  onDelete: (id: string) => void;
}) => {
  function handleEdit(transaction: Transaction): void {
    onEdit(transaction);
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
  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      month: "2-digit",
      day: "2-digit",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", options);
  }

  return (
    <React.Fragment>
      <View style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.subtitle}>
            {transaction.type === TransactionTypeEnum.DEPOSIT
              ? "Depósito"
              : "Transferência"}
          </Text>
          <Text style={styles.title}>{transaction.description}</Text>
          <Text style={styles.amount}>{formatAmount(transaction.amount)}</Text>
        </View>
        <View style={styles.rightContainer}>
          <Text style={styles.date}>{formatDate(transaction.createdAt)}</Text>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.button}
              onPress={() => handleEdit(transaction)}
            >
              <IconPencil />
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={() => handleDelete(transaction.id)}
            >
              <IconTrash />
            </Pressable>
          </View>
        </View>
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
  date: { fontSize: 12, color: "#666" },
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
  rightContainer: { alignItems: "flex-end" },
  buttonContainer: { flexDirection: "row", marginTop: 8 },
});

export default TransactionItem;
