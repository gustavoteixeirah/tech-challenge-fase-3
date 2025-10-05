import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TransactionList } from "../components/TransactionList";

const TransactionsScreen = () => {
  return (
    <View style={styles.container}>
      <TransactionList></TransactionList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
});

export default TransactionsScreen;
