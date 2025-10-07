import React, { useEffect, useMemo, useState } from "react";
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
  disableScroll?: boolean;      // Home usa true para evitar VirtualizedList dentro de ScrollView
  filters?: string[];            // [type, category, initISO, endISO]
};

export function TransactionList({
  hasAddButton = false,
  onTransactionsChanged,
  disableScroll = false,
  filters,
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
      onTransactionsChanged?.();
    }, [user?.uid])
  );

  const handleDelete = async (id?: string) => {
    if (!user?.uid || !id) return;
    await deleteTransaction(user.uid, id);
    await load();
    onTransactionsChanged?.();
  };

  const filtered = useMemo(() => {
    if (!filters || filters.length < 4) return transactions;
    const [typeSel, catSel, initISO, endISO] = filters;

    let list = [...transactions];

    if (typeSel) {
      const tSel = String(typeSel).toUpperCase();
      list = list.filter((t) => String(t.type).toUpperCase() === tSel);
    }
    if (catSel) {
      const cSel = String(catSel).toUpperCase();
      list = list.filter((t) => String(t.category || "").toUpperCase() === cSel);
    }
    if (initISO) {
      const init = new Date(initISO);
      list = list.filter((t) => t.createdAt && new Date(t.createdAt) >= init);
    }
    if (endISO) {
      const end = new Date(endISO);
      list = list.filter((t) => t.createdAt && new Date(t.createdAt) <= end);
    }

    return list;
  }, [transactions, filters]);

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
    return (
      <View>
        {filtered.length === 0 ? (
          <Text style={styles.empty}>Sem transações no período.</Text>
        ) : (
          filtered.map((item, idx) => (
            <View key={item.id ?? String(idx)}>
              <ItemRow item={item} />
              {idx < filtered.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          ))
        )}

        {hasAddButton ? (
          <TouchableOpacity style={styles.addButton} onPress={() => (navigation as any).navigate("New")}>
            <Text style={styles.addText}>Adicionar Transação</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item, index) => item.id ?? String(index)}
      renderItem={({ item }) => <ItemRow item={item} />}
      refreshing={loading}
      onRefresh={load}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={<Text style={styles.empty}>Sem transações no período.</Text>}
      ListFooterComponent={
        hasAddButton ? (
          <TouchableOpacity style={styles.addButton} onPress={() => (navigation as any).navigate("New")}>
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
