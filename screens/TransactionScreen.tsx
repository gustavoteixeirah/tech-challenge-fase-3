import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Transaction, TransactionTypeEnum } from "../types/transactions";

// Mock
const PAGE_SIZE = 5;

const mockData: Transaction[] = [
  {
    id: "1",
    type: TransactionTypeEnum.DEPOSIT,
    amount: 100,
    createdAt: "2024-01-01",
    description: "Salário",
  },
  {
    id: "2",
    type: TransactionTypeEnum.DEPOSIT,
    amount: 50,
    createdAt: "2024-01-02",
    description: "Supermercado",
  },
  {
    id: "3",
    type: TransactionTypeEnum.TRANSFER,
    amount: 200,
    createdAt: "2024-01-03",
    description: "Transferência para João",
  },
  {
    id: "4",
    type: TransactionTypeEnum.DEPOSIT,
    amount: 150,
    createdAt: "2024-01-04",
    description: "Venda de produto",
  },
  {
    id: "5",
    type: TransactionTypeEnum.TRANSFER,
    amount: 75,
    createdAt: "2024-01-05",
    description: "Pagamento de conta",
  },
  {
    id: "6",
    type: TransactionTypeEnum.TRANSFER,
    amount: 300,
    createdAt: "2024-01-06",
    description: "Transferência para Maria",
  },
  {
    id: "7",
    type: TransactionTypeEnum.DEPOSIT,
    amount: 120,
    createdAt: "2024-01-07",
    description: "Salário",
  },
  {
    id: "8",
    type: TransactionTypeEnum.TRANSFER,
    amount: 60,
    createdAt: "2024-01-08",
    description: "Supermercado",
  },
  {
    id: "9",
    type: TransactionTypeEnum.TRANSFER,
    amount: 250,
    createdAt: "2024-01-09",
    description: "Transferência para Pedro",
  },
  {
    id: "10",
    type: TransactionTypeEnum.DEPOSIT,
    amount: 180,
    createdAt: "2024-01-10",
    description: "Venda de produto",
  },
  {
    id: "11",
    type: TransactionTypeEnum.TRANSFER,
    amount: 90,
    createdAt: "2024-01-11",
    description: "Pagamento de conta",
  },
  {
    id: "12",
    type: TransactionTypeEnum.TRANSFER,
    amount: 350,
    createdAt: "2024-01-12",
    description: "Transferência para Ana",
  },
  {
    id: "13",
    type: TransactionTypeEnum.DEPOSIT,
    amount: 130,
    createdAt: "2024-01-13",
    description: "Salário",
  },
  {
    id: "14",
    type: TransactionTypeEnum.TRANSFER,
    amount: 70,
    createdAt: "2024-01-14",
    description: "Supermercado",
  },
  {
    id: "15",
    type: TransactionTypeEnum.TRANSFER,
    amount: 400,
    createdAt: "2024-01-15",
    description: "Transferência para Lucas",
  },
];

const fetchTransactions = async (
  page: number,
  pageSize: number = PAGE_SIZE
): Promise<{ data: Transaction[]; hasMore: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const start = page * pageSize;
  const end = start + pageSize;
  const data = mockData.slice(start, end);
  const hasMore = end < mockData.length;
  return { data, hasMore };
};

const deleteTransaction = async (id: string): Promise<boolean> => {
  return true;
};

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadTransactions = async (nextPage = 0) => {
    if (loading || !hasMore) return;
    setLoading(true);
    const result = await fetchTransactions(nextPage);
    setTransactions((prev) =>
      nextPage === 0 ? result.data : [...prev, ...result.data]
    );
    setHasMore(result.hasMore);
    setLoading(false);
  };

  useEffect(() => {
    loadTransactions(0);
  }, []);

  const handleEdit = (id: string) => {
    console.log("Editar", `Editar transação ${id}`);
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

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.description}</Text>
              <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleEdit(item.id)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.buttonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading ? <ActivityIndicator size="small" color="#007bff" /> : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 16 },
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

export default Transactions;
