import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getTransactions, deleteTransaction } from "../services/transactions";
import { useAuth } from "../auth/AuthContext";
import { Transaction } from "../types/transactions";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  route?: any;
  hasAddButton?: boolean;
  onTransactionsChanged?: () => void;
  disableScroll?: boolean;
};

export function TransactionList({ hasAddButton, onTransactionsChanged, disableScroll }: Props) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!user?.uid) return;
    setLoading(true);
    const txs = await getTransactions(user.uid);
    setTransactions(txs);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [user?.uid]);

  const handleDelete = async (id: string) => {
    if (!user?.uid) return;
    await deleteTransaction(user.uid, id);
    load();
    onTransactionsChanged?.();
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.type}>{item.description || item.type}</Text>
        <Text style={styles.amount}>
          {item.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      refreshing={loading}
      onRefresh={load}
      scrollEnabled={!disableScroll}
      nestedScrollEnabled={false}
      removeClippedSubviews={false}
      ListFooterComponent={
        hasAddButton ? (
         <TouchableOpacity
  style={styles.addButton}
  onPress={() => (navigation as any).navigate("New")}
>
  <Text style={styles.addText}>Adicionar Transação</Text>
</TouchableOpacity>

        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  type: {
    fontSize: 14,
    color: "#555",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  addText: {
    color: "white",
    fontWeight: "bold",
  },
});
