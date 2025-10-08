// src/screens/TransactionScreen.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import CustomHeader from "../components/CustomHeader";
import Filter from "../components/Filter";
import { TransactionList } from "../components/TransactionList";
import { useNavigation } from "@react-navigation/native";

const TransactionsScreen = ({ route }) => {
  const [filters, setFilters] = React.useState<string[]>(["", "", "", ""]);
  const [showFilter, setShowFilter] = React.useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <CustomHeader title="Extrato" showUserInfo={true} showMenuButton={true} />
      <View style={styles.content}>

        {/* Ações no topo: Nova Transação + Mostrar/Esconder Filtro */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => (navigation as any).navigate("New")}
            style={[styles.primaryBtn, { flex: 1 }]}
          >
            <Text style={styles.primaryBtnText}>Nova Transação</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowFilter((s) => !s)}
            style={[styles.secondaryBtn, { marginLeft: 10 }]}
          >
            <Text style={styles.secondaryBtnText}>
              {showFilter ? "Esconder filtro" : "Mostrar filtro"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filtro (colapsável) */}
        {showFilter && (
          <View style={styles.filterWrapper}>
            <Filter onFilter={(selected) => setFilters(selected)} />
          </View>
        )}

        {/* Lista (com busca própria e filtros aplicados) */}
        <TransactionList
          route={route}
          hasAddButton={false}    
          hasSearchBar={true}      
          filters={filters}        
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 16 },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  primaryBtn: {
    backgroundColor: "#0F172A",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  secondaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: "#0F172A",
    fontWeight: "600",
  },

  filterWrapper: {
    marginBottom: 12,
    zIndex: 1000,     // garante dropdown acima da lista
    elevation: 10,    // Android
  },
});

export default TransactionsScreen;
