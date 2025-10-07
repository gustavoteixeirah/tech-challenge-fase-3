import React, { useEffect, useState, useMemo } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getTransactions, deleteTransaction } from "../services/transactions";
import { useAuth } from "../auth/AuthContext";
import { Transaction } from "../types/transactions";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  route?: any;
  hasAddButton?: boolean;
  onTransactionsChanged?: () => void;
  disableScroll?: boolean;   // quando true, NÃO usar FlatList (evita nested VirtualizedList)
  filters?: string[];        // mantido p/ compatibilidade (não aplicamos filtro aqui)
};

export function TransactionList({
  hasAddButton,
  onTransactionsChanged,
  disableScroll,
}: Props) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const sortTxs = (txs: Transaction[]) =>
    [...txs].sort((a, b) => {
      const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });

  async function load() {
    if (!user?.uid) return;
    setLoading(true);
    const txs = await getTransactions(user.uid);
    setTransactions(sortTxs(txs));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [user?.uid]);

  useFocusEffect(
    React.useCallback(() => {
      load();
      onTransactionsChanged?.(); // garante que a Home recalcule saldo ao voltar
    }, [user?.uid])
  );

  const handleDelete = async (id?: string) => {
    if (!user?.uid || !id) return;
    await deleteTransaction(user.uid, id);
    await load();
    onTransactionsChanged?.();
  };

  const ItemRow = ({ item }: { item: Transaction }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.type}>{item.description || String(item.type)}</Text>
        <Text style={styles.amount}>
          {Number(item.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </Text>
        {item.category ? <Text style={styles.category}>{item.category}</Text> : null}
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  if (disableScroll) {
    // Sem FlatList quando estiver dentro de ScrollView (Home) — evita o warning de aninhamento
    return (
      <View>
        {transactions.length === 0 ? (
          <Text style={styles.empty}>Sem transações no período.</Text>
        ) : (
          transactions.map((item, idx) => (
            <View key={item.id ?? String(idx)}>
              <ItemRow item={item} />
              {idx < transactions.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          ))
        )}

        {hasAddButton ? (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => (navigation as any).navigate("New")}
          >
            <Text style={styles.addText}>Adicionar Transação</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item, index) => item.id ?? String(index)}
      renderItem={({ item }) => <ItemRow item={item} />}
      refreshing={loading}
      onRefresh={load}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={<Text style={styles.empty}>Sem transações no período.</Text>}
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
  },
  separator: {
    height: 1,
    backgroundColor: "#eee",
  },
  type: {
    fontSize: 14,
    color: "#555",
  },
  category: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
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
  empty: {
    color: "#666",
    textAlign: "center",
    paddingVertical: 12,
  },
});
