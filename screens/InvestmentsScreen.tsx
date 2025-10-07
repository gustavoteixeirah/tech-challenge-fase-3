import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import CustomHeader from "../components/CustomHeader";
import { useAuth } from "../auth/AuthContext";
import { getUserInvestments, type InvestmentDoc } from "../services/investments";

const FALLBACK: InvestmentDoc[] = [
  { id: "1", userId: "demo", month: "Jan", year: 2024, value: 1000, createdAt: "2024-01-31T12:00:00Z", type: "Renda Fixa" },
  { id: "2", userId: "demo", month: "Feb", year: 2024, value: 1200, createdAt: "2024-02-29T12:00:00Z", type: "CDB" },
  { id: "3", userId: "demo", month: "Mar", year: 2024, value: 1500, createdAt: "2024-03-31T12:00:00Z", type: "Tesouro Direto" },
  { id: "4", userId: "demo", month: "Apr", year: 2024, value: 1700, createdAt: "2024-04-30T12:00:00Z", type: "Ações" },
  { id: "5", userId: "demo", month: "May", year: 2024, value: 2000, createdAt: "2024-05-31T12:00:00Z", type: "FII" },
  { id: "6", userId: "demo", month: "Jun", year: 2024, value: 2500, createdAt: "2024-06-30T12:00:00Z", type: "RV" },
];

export default function InvestmentsScreen() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [rows, setRows] = useState<InvestmentDoc[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!uid) return setRows(FALLBACK);
        const data = await getUserInvestments(uid);
        mounted && setRows(data.length ? data : FALLBACK);
      } catch {
        mounted && setRows(FALLBACK);
      }
    })();
    return () => { mounted = false; };
  }, [uid]);

  const chartData = useMemo(() => {
    const labels = (rows ?? []).map((i) => i.month);
    const values = (rows ?? []).map((i) => i.value);
    return {
      labels,
      datasets: [{ data: values, strokeWidth: 2 }],
    };
  }, [rows]);

  return (
    <View style={styles.container}>
      <CustomHeader title="Investimentos" showUserInfo={true} showMenuButton={true} />
      <View style={styles.content}>
        <Text style={styles.title}>Evolução</Text>

        {!rows ? (
          <ActivityIndicator />
        ) : (
          <>
            <LineChart
              data={chartData}
              width={Dimensions.get("window").width - 32}
              height={250}
              bezier
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (o = 1) => `rgba(216, 227, 115, ${o})`,
                labelColor: (o = 1) => `rgba(0, 0, 0, ${o})`,
                style: { borderRadius: 6 },
                propsForDots: { r: "3" },
              }}
              style={styles.chart}
            />

            <Text style={styles.tableTitle}>Tabela de Investimentos</Text>
            <FlatList
              data={rows}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.cellType}>{item.type}</Text>
                  <Text style={styles.cellMonth}>{item.month}/{item.year}</Text>
                  <Text style={styles.cell}>
                    {item.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </Text>
                </View>
              )}
              style={{ width: "100%" }}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },
  content: { flex: 1, padding: 16, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 24, color: "#000" },
  chart: { borderRadius: 16 },
  tableTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 32,
    marginBottom: 8,
    color: "#000",
    alignSelf: "flex-start",
  },
  tableRow: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    width: "100%",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  cellMonth: { flex: 1, fontSize: 16, paddingHorizontal: 4, fontWeight: "bold" },
  cellType: { flex: 1, fontSize: 12, paddingHorizontal: 4, fontWeight: "bold", color: "#666" },
  cell: { flex: 1, fontSize: 16, paddingHorizontal: 4, fontWeight: "bold" },
});
