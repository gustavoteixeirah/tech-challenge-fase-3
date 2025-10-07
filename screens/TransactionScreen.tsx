import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { TransactionList } from "../components/TransactionList";
import CustomHeader from "../components/CustomHeader";

const TransactionsScreen = ({ route }) => {
  return (
    <View style={styles.container}>
      <CustomHeader title="Extrato" showUserInfo={true} showMenuButton={true} />
      <View style={styles.content}>
        <TransactionList
          route={route}
          hasAddButton={true}
          hasSearchBar={true}
          hasfilterButton={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default TransactionsScreen;
