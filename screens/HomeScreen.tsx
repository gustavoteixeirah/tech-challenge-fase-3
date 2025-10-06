import React from "react";
import { View, Text, Button, Pressable } from "react-native";
import { useAuth } from "../auth/AuthContext";
import UserCard from "../components/UserCard";
import { TransactionList } from "../components/TransactionList";
import { IconCheck, IconFilter, IconSearch } from "../Icons/Icons/icons";
import { useNavigation } from "@react-navigation/native";
import { getTransactions } from "../services/transactions";
import { TransactionTypeEnum } from "../types/transactions";

export default function HomeScreen() {
  const { user, logOut } = useAuth();
  const display = user?.displayName?.trim() || user?.email || "Usuário";
  const navigation = useNavigation();
  const [balance, setBalance] = React.useState<number>(0);

  const getTotalBalance = async () => {
    const result = await getTransactions(user?.uid || "");
    const total = result.reduce((acc, transaction) => {
      return transaction.type === TransactionTypeEnum.DEPOSIT
        ? acc + transaction.amount
        : acc - transaction.amount;
    }, 0);
    return total;
  };

  React.useEffect(() => {
    getTotalBalance().then(setBalance);
  }, [user?.uid]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8,
      }}
    >
      <UserCard name={display} balance={balance} />

      <View
        style={{
          flex: 1,
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
          <Text
            style={{
              fontSize: 25,
              marginTop: 10,
              marginBottom: 10,
              fontWeight: "bold",
              flex: 1,
            }}
          >
            Extrato
          </Text>
          <Pressable onPress={() => navigation.navigate("Transactions")}>
            <IconFilter />
          </Pressable>
        </View>

        <TransactionList route={undefined} />
      </View>
      <Button title="Sair" onPress={logOut} />
    </View>
  );
}
