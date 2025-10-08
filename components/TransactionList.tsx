import React, { useCallback, useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getTransactions, deleteTransaction } from "../services/transactions";
import { useAuth } from "../auth/AuthContext";
import { Transaction, TransactionTypeEnum } from "../types/transactions";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import Filter from "./Filter";

type Props = {
  route?: any;
  hasfilterButton?: boolean;
  hasAddButton?: boolean;
  hasSearchBar?: boolean;
  onTransactionsChanged?: () => void;
  disableScroll?: boolean;
  filters?: string[]; // [type, category, initISO, endISO]
};

export const TransactionList: React.FC<Props> = ({
  route,
  hasfilterButton = false,
  hasAddButton = false,
  hasSearchBar = false,
  onTransactionsChanged,
  disableScroll = false,
  filters, // opcional: quando vindo da TransactionsScreen
}) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const uid = user?.uid;

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(hasfilterButton); // se a tela pedir botão, inicia visível

  const sortTxs = (txs: Transaction[]) =>
    [...txs].sort((a, b) => {
      const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });

  const showToast = (message: string, type: "success" | "error" = "error") => {
    Toast.show({
      type,
      text1: message,
      position: "top",
      visibilityTime: 3000,
      autoHide: true,
    });
  };

  const load = async () => {
    if (!uid) return;
    setLoading(true);
    const txs = await getTransactions(uid);
    const sorted = sortTxs(txs);
    setAllTransactions(sorted);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [uid]);

  useFocusEffect(
    useCallback(() => {
      load();
      onTransactionsChanged?.();
    }, [uid])
  );

  // Aplica filtros vindo de fora (TransactionsScreen) se existir
  const filteredByProps = useMemo(() => {
    if (!filters || filters.length < 4) return allTransactions;
    const [typeSel, catSel, initISO, endISO] = filters;

    let list = [...allTransactions];

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
  }, [allTransactions, filters]);

  // Busca por descrição
  const finalList = useMemo(() => {
    const base = filteredByProps;
    if (!hasSearchBar || !search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter((t) => (t.description || "").toLowerCase().includes(q));
  }, [filteredByProps, hasSearchBar, search]);

  const handleDelete = async (id?: string) => {
    if (!uid || !id) return;
    try {
      await deleteTransaction(uid, id);
      showToast("Transação deletada!", "success");
      await load();
      onTransactionsChanged?.();
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleEdit = (tx: Transaction) => {
    (navigation as any).navigate("New", { transaction: tx });
  };

  const handleAdd = () => {
    (navigation as any).navigate("New");
  };

  // Filtro interno opcional (quando o componente deseja exibir <Filter/> por si)
  const onFilterSelected = (selected: string[]) => {
    // Se você usar o Filter dentro do TransactionList (hasfilterButton = true),
    // aplicamos os filtros localmente sobre allTransactions
    const [typeSel, catSel, initISO, endISO] = selected;
    const localFilters: string[] = [
      typeSel || "",
      catSel || "",
      initISO || "",
      endISO || "",
    ];
    // Simula a prop 'filters' passando pelo mesmo pipeline:
    const tmp = (() => {
      let list = [...allTransactions];
      if (localFilters[0]) {
        const tSel = String(localFilters[0]).toUpperCase();
        list = list.filter((t) => String(t.type).toUpperCase() === tSel);
      }
      if (localFilters[1]) {
        const cSel = String(localFilters[1]).toUpperCase();
        list = list.filter((t) => String(t.category || "").toUpperCase() === cSel);
      }
      if (localFilters[2]) {
        const init = new Date(localFilters[2]);
        list = list.filter((t) => t.createdAt && new Date(t.createdAt) >= init);
      }
      if (localFilters[3]) {
        const end = new Date(localFilters[3]);
        list = list.filter((t) => t.createdAt && new Date(t.createdAt) <= end);
      }
      return list;
    })();
    // Aplica resultado local (independente de prop filters)
    setTransactions(tmp);
  };

  useEffect(() => {
    // Quando usamos apenas filters via props, controlamos por finalList
    // Se onFilterSelected setou 'transactions' localmente, preferimos ele
    // Caso contrário, sincronizamos transactions = finalList
    if (!hasfilterButton) {
      setTransactions(finalList);
    } else if (!showFilter) {
      // quando esconde filtro interno, volte ao pipeline finalList/props
      setTransactions(finalList);
    }
  }, [finalList, hasfilterButton, showFilter]);

  const Amount = ({ item }: { item: Transaction }) => {
    const isOut = item.type !== TransactionTypeEnum.DEPOSIT;
    const valueAbs = Math.abs(Number(item.amount) || 0);
    return (
      <Text style={[styles.amount, isOut ? styles.amountOut : styles.amountIn]}>
        {(isOut ? "-" : "+") +
          " " +
          valueAbs.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </Text>
    );
  };

  const ItemRow = ({ item }: { item: Transaction }) => (
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.type}>{item.description || String(item.type)}</Text>
        {item.category ? <Text style={styles.category}>{item.category}</Text> : null}
      </View>

      <Amount item={item} />

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionBtn}>
          <Ionicons name="pencil" size={20} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.actionBtn}>
          <Ionicons name="trash" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {hasfilterButton && (
        <>
          <TouchableOpacity
            onPress={() => setShowFilter((s) => !s)}
            style={styles.filterToggle}
          >
            <Text style={styles.filterToggleText}>
              {showFilter ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Text>
          </TouchableOpacity>

          {showFilter && (
            <View style={styles.filterWrapper}>
              <Filter onFilter={onFilterSelected} />
            </View>
          )}
        </>
      )}

      {hasAddButton && (
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addText}>+ Nova Transação</Text>
        </TouchableOpacity>
      )}

      {hasSearchBar && (
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Buscar transação..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>
      )}

      <FlatList
        data={transactions}
        keyExtractor={(item, index) => item.id ?? String(index)}
        renderItem={ItemRow}
        refreshing={loading}
        onRefresh={load}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>Sem transações no período.</Text>}
        scrollEnabled={!disableScroll}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
    minWidth: 140,
    textAlign: "right",
  },
  amountIn: { color: "#0A7E07" },
  amountOut: { color: "#B00020" },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionBtn: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  addButton: {
    backgroundColor: "black",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
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
  filterToggle: {
    backgroundColor: "#f2f2f2",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterToggleText: {
    textAlign: "center",
    color: "#333",
    fontWeight: "600",
  },
  filterWrapper: {
    marginBottom: 12,
    zIndex: 1000,
    elevation: 10,
  },
  searchBox: {
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
