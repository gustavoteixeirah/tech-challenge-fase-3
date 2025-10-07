import React from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Investment, InvestmentBR, TipoInvestimentoBR } from "../types/investments";


const investments: InvestmentBR[] = [
  { id: "1", userId: "user123", month: "Jan", year: 2024, value: 1000, createdAt: "2024-01-31T12:00:00Z", type: TipoInvestimentoBR.RENDA_FIXA },
  { id: "2", userId: "user123", month: "Feb", year: 2024, value: 1200, createdAt: "2024-02-29T12:00:00Z", type: TipoInvestimentoBR.CDB },
  { id: "3", userId: "user123", month: "Mar", year: 2024, value: 1500, createdAt: "2024-03-31T12:00:00Z", type: TipoInvestimentoBR.TESOURO_DIRETO },
  { id: "4", userId: "user123", month: "Apr", year: 2024, value: 1700, createdAt: "2024-04-30T12:00:00Z", type: TipoInvestimentoBR.ACOES },
  { id: "5", userId: "user123", month: "May", year: 2024, value: 2000, createdAt: "2024-05-31T12:00:00Z", type: TipoInvestimentoBR.FUNDO_IMOBILIARIO },
  { id: "6", userId: "user123", month: "Jun", year: 2024, value: 2500, createdAt: "2024-06-30T12:00:00Z", type: TipoInvestimentoBR.RENDA_VARIAVEL },
];

const investmentData = {
  labels: investments.map((i) => i.month),
  datasets: [
    {
      data: investments.map((i) => i.value),
      strokeWidth: 2,
    },
  ],
};

export default function InvestmentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Evolução</Text>
      <LineChart
        data={investmentData}
        width={Dimensions.get("window").width - 32}
        height={250}
        chartConfig={{
          backgroundColor: "#f5f5f5",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(216, 227, 115, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 6 },
        }}
        style={styles.chart}
      />
      <Text style={styles.tableTitle}>Tabela de Investimentos</Text>
      <FlatList
        data={investments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tableRow}>
            <Text style={styles.cellType}>{item.type}</Text>
            <Text style={styles.cellMonth}>{item.month}/{item.year}</Text>
            <Text style={styles.cell}>
              {item.value.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
        )}
        style={{ width: "100%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fafafa",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#000",
  },
  chart: {
    borderRadius: 16,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 8,
    color: "#000",
    alignSelf: "flex-start",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 4,
    marginBottom: 4,
    width: "100%",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  cellMonth: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 4,
    fontWeight: "bold",
  
  },
  cellType: {
    flex: 1,
    fontSize: 12,
    paddingHorizontal: 4,
    fontWeight: "bold",
    color: "#666",
  },
  cell: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 4,
    fontWeight: "bold",
  },
  headerCell: {
    fontWeight: "bold",
    color: "#000",
  },
});
