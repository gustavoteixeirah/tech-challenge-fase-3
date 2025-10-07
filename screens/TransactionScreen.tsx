import React from "react";
import { View, StyleSheet } from "react-native";
import CustomHeader from "../components/CustomHeader";
import Filter from "../components/Filter";
import { TransactionList } from "../components/TransactionList";

const TransactionsScreen = ({ route }) => {
  const [filters, setFilters] = React.useState<string[]>(["", "", "", ""]);

  return (
    <View style={styles.container}>
      <CustomHeader title="Extrato" showUserInfo={true} showMenuButton={true} />
      <View style={styles.content}>
        <View style={styles.filterWrapper}>
          <Filter onFilter={(selected) => setFilters(selected)} />
        </View>

        <TransactionList
          route={route}
          hasAddButton={true}
          filters={filters}   // <- aplica os filtros na lista
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 16 },
  filterWrapper: {
    marginBottom: 12,
    zIndex: 1000,
    elevation: 10,
  },
});

export default TransactionsScreen;
