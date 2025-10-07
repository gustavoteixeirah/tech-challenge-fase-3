import React from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useAuth } from "../auth/AuthContext";
import UserCard from "../components/UserCard";
import { TransactionList } from "../components/TransactionList";
import { IconFilter } from "../Icons/Icons/icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getTransactions } from "../services/transactions";
import { TransactionTypeEnum, Transaction } from "../types/transactions";
import CustomHeader from "../components/CustomHeader";
import FinancialOverview from "../src/analytics/FinancialOverview";

export default function HomeScreen() {
  const { user } = useAuth();
  const display = user?.displayName?.trim() || user?.email || "Usuário";
  const navigation = useNavigation();
  const [balance, setBalance] = React.useState<number>(0);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  const getTotalBalance = async () => {
    const result = await getTransactions(user?.uid || "");
    const total = result.reduce((acc, transaction) => {
      return transaction.type === TransactionTypeEnum.DEPOSIT
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);
    return total;
  };

  const refreshData = async () => {
    const txs = await getTransactions(user?.uid || "");
    setTransactions(txs);
    const total = txs.reduce((acc, t) => {
      return t.type === TransactionTypeEnum.DEPOSIT ? acc + t.amount : acc - t.amount;
    }, 0);
    setBalance(total);
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshData();
    }, [user?.uid])
  );

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title="Dashboard" showUserInfo={true} showMenuButton={true} />
      <ScrollView
        contentContainerStyle={{ alignItems: "center", paddingTop: 16, paddingBottom: 24, gap: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <UserCard name={display} balance={balance} />
        <View
          style={{
            width: "90%",
            borderRadius: 12,
            backgroundColor: "#FFF",
            padding: 20,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              gap: 12,
            }}
          >
            <Text style={{ fontSize: 25, marginTop: 10, marginBottom: 10, fontWeight: "bold", flex: 1 }}>
              Extrato
            </Text>
            <Pressable onPress={() => (navigation as any).navigate("Transactions")}>
              <IconFilter />
            </Pressable>
          </View>
          <TransactionList
            route={undefined}
            onTransactionsChanged={refreshData}
            hasAddButton={true}
            disableScroll
          />
        </View>
       <View style={{ width: "90%", marginTop: 12 }}>
  <FinancialOverview transactions={transactions} />
</View>

      </ScrollView>
    </View>
  );
}
