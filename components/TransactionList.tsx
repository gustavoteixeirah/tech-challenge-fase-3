import React, { useEffect, useState } from "react";
import { Transaction, TransactionTypeEnum } from "../types/transactions";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import TransactionItem from "./TransactionItem";
import { getTransactions } from "../services/transactions";
import { useAuth } from "../auth/AuthContext";
import Filter from "./Filter";
const PAGE_SIZE = 10;

export const TransactionList = () => {
  const { user } = useAuth();
  const uid = user?.uid;

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const loadTransactions = async (nextPage = 0) => {
    if (loading || !hasMore) return;
    console.log("Loading transactions for page:", loading, hasMore);
    setLoading(true);

    const result = await fetchTransactions(nextPage);
    setTransactions((prev) =>
      nextPage === 0 ? result.data : [...prev, ...result.data]
    );
    if (nextPage === 0) {
      setAllTransactions(result.data); // Salva todas para busca
    } else {
      setAllTransactions((prev) => [...prev, ...result.data]);
    }

    setHasMore(result.hasMore);
    setLoading(false);
  };

  useEffect(() => {
    loadTransactions(0);
  }, []);

  const deleteTransaction = async (id: string): Promise<boolean> => {
    return true;
  };
  const handleEdit = (id: string) => {
    console.log("Editar", `Editar transação ${id}`);
  };

  const handleSearch = (text: string) => {
    console.log("Searching for:", text);
    if (text.trim() === "") {
      setTransactions(allTransactions); // Restaura todas
      return;
    }
    const filtered = transactions.filter((t) =>
      t.description.toLowerCase().includes(text.toLowerCase())
    );
    setTransactions(filtered);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteTransaction(id);
    if (success) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadTransactions(nextPage);
    }
  };

  const fetchTransactions = async (page: number) => {
    if (!uid) return { data: [], hasMore: false };
    const data = await getTransactions(uid);
    console.log("Fetched transactions:", data);
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const paginatedData = data.slice(start, end);
    return { data: paginatedData, hasMore: end < data.length };
  };

  function onFilterSelected(selected: string[]): void {
    console.log("Selected filters:", selected);

    const [typeFilter, categoryFilter, initDateFilter, endDateFilter] =
      selected;
    let filtered = allTransactions;

    if (typeFilter) {
      filtered = filtered.filter(
        (t) => t.type === (typeFilter as TransactionTypeEnum)
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter((t) => t.category === categoryFilter);
    }

    if (initDateFilter && endDateFilter) {
      filtered = filtered.filter((t) => {
        const createdAt = new Date(t.createdAt);
        return (
          createdAt >= new Date(initDateFilter) &&
          createdAt <= new Date(endDateFilter)
        );
      });
    }

    setTransactions(filtered);

    setPage(0);
    setHasMore(false);
    setLoading(false);
  }

  return (
    <>
      <TextInput
        placeholder="Buscar transações"
        style={styles.searchInput}
        onChangeText={(text) => {
          handleSearch(text);
        }}
      />
      <Pressable
        onPress={() => setIsFilterVisible(!isFilterVisible)}
        style={{
          backgroundColor: "#DDD",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <Text>Selecionar Filtros</Text>
      </Pressable>
      {isFilterVisible && <Filter onFilter={onFilterSelected} />}
      {transactions.length === 0 && !loading ? (
        <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              transaction={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loading ? <ActivityIndicator size="small" color="#000" /> : null
          }
        />
      )}
    </>
  );
};
const styles = StyleSheet.create({
  emptyText: {
    textAlign: "center",
    marginTop: 20,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});
