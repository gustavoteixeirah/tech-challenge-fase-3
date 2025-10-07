import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { Transaction, TransactionTypeEnum } from "../../types/transactions";
import { Ionicons } from "@expo/vector-icons";

type Props = { transactions: Transaction[] };

const COLORS = {
  text: "#0F172A",
  subtext: "#475569",
  card: "#FFFFFF",
  line: "#E2E8F0",
  green: "#10B981",
  red: "#EF4444",
  lime: "#DDE576",
  limeDark: "#B9C941",
  extras: ["#A3B81F", "#7CA20E", "#4D7C0F", "#355E3B"],
};

const toBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function FinancialOverview({ transactions }: Props) {
  const [selected, setSelected] = useState<{ label: string; value: number } | null>(null);

  const { incomes, expenses, pieData, totalExpenses } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const catMap = new Map<string, number>();

    for (const t of transactions || []) {
      const val = Math.abs(Number(t?.amount ?? 0));
      const tType = (typeof t?.type === "string" ? t.type : `${t?.type}`)?.toUpperCase();
      const isDeposit = tType === TransactionTypeEnum.DEPOSIT || tType === "DEPOSIT";
      if (isDeposit) inc += val;
      else {
        exp += val;
        const cat = (t?.category as string) || "Outros";
        catMap.set(cat, (catMap.get(cat) || 0) + val);
      }
    }

    const entries = Array.from(catMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const colors = [COLORS.lime, COLORS.limeDark, ...COLORS.extras];
    const pieData = entries.map(([label, value], i) => ({
      value,
      text: label,
      color: colors[i % colors.length],
    }));

    return { incomes: inc, expenses: exp, pieData, totalExpenses: exp };
  }, [transactions]);

  const maxRaw = Math.max(incomes, expenses);
  let yMax = 10000;
  if (maxRaw > 10000 && maxRaw <= 50000) yMax = 50000;
  else if (maxRaw > 50000 && maxRaw <= 100000) yMax = 100000;
  else if (maxRaw > 100000) yMax = Math.ceil(maxRaw / 10000) * 10000;
  const sections = Math.max(1, Math.round(yMax / 10000));
  const yLabels = Array.from({ length: sections + 1 }, (_, i) => (i * 10000).toLocaleString("pt-BR"));

  const chartData = pieData.map((s) => ({
    ...s,
    onPress: () => setSelected({ label: String(s.text), value: Number(s.value) || 0 }),
    focused: selected ? String(s.text) === selected.label : false,
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>Entradas vs Saídas</Text>
        <Text style={styles.caption}>
          Entradas: <Text style={{ fontWeight: "700", color: COLORS.green }}>{toBRL(incomes)}</Text> ·{" "}
          Saídas: <Text style={{ fontWeight: "700", color: COLORS.red }}>{toBRL(expenses)}</Text>
        </Text>

        <BarChart
          data={[
            { label: "Entradas", value: incomes, frontColor: COLORS.green },
            { label: "Saídas", value: expenses, frontColor: COLORS.red },
          ]}
          height={180}
          barWidth={40}
          spacing={40}
          isAnimated
          animationDuration={650}
          yAxisThickness={0}
          xAxisThickness={0}
          noOfSections={sections}
          stepValue={10000}
          maxValue={yMax}
          yAxisLabelTexts={yLabels}
          yAxisLabelWidth={48}
          dashWidth={2}
          dashGap={4}
          rulesColor={COLORS.line}
          xAxisLabelTextStyle={{ color: COLORS.subtext, fontWeight: "600" }}
          renderTooltip={(item) => (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>
                {item.label}: {toBRL(Number(item.value) || 0)}
              </Text>
            </View>
          )}
        />
      </View>

      <View style={[styles.card, { overflow: "visible" }]}>
        <Text style={styles.title}>Gastos por categoria</Text>
        <Text style={styles.caption}>Somente saídas</Text>

        {pieData.length ? (
          <>
            <Pressable onPress={() => setSelected(null)}>
              <PieChart
                data={chartData}
                donut
                radius={90}
                innerRadius={60}
                showText={false}
                focusOnPress
                sectionAutoFocus={false}
                animationDuration={700}
                centerLabelComponent={() => {
                  if (selected) {
                    return (
                      <View style={{ alignItems: "center" }}>
                        <Text style={{ color: COLORS.subtext, fontSize: 12 }}>{selected.label}</Text>
                        <Text style={{ color: COLORS.text, fontWeight: "800" }}>{toBRL(selected.value)}</Text>
                      </View>
                    );
                  }
                  return (
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ color: COLORS.subtext, fontSize: 12 }}>Total</Text>
                      <Text style={{ color: COLORS.text, fontWeight: "800" }}>{toBRL(totalExpenses)}</Text>
                    </View>
                  );
                }}
              />
            </Pressable>

            <View style={styles.legend}>
              {pieData.map((s, i) => {
                const isActive = selected ? selected.label === String(s.text) : false;
                return (
                  <Pressable
                    key={String(s.text) + i}
                    style={[styles.legendRow, isActive && styles.legendRowActive]}
                    onPress={() => setSelected({ label: String(s.text), value: Number(s.value) || 0 })}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color={isActive ? COLORS.text : COLORS.subtext}
                    />
                    <View style={[styles.legendDot, { backgroundColor: s.color as string }]} />
                    <Text style={[styles.legendText, isActive && styles.legendTextActive]} numberOfLines={1}>
                      {s.text} · {toBRL(Number(s.value) || 0)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : (
          <Text style={styles.empty}>Sem gastos categorizados para exibir.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 16, paddingTop: 12 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.line,
  },
  title: { fontSize: 18, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  caption: { fontSize: 12, color: COLORS.subtext, marginBottom: 8 },
  empty: { textAlign: "center", color: COLORS.subtext, paddingVertical: 24 },
  legend: { marginTop: 10, gap: 8 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6, paddingHorizontal: 8, borderRadius: 8 },
  legendRowActive: { backgroundColor: "rgba(15, 23, 42, 0.05)" },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: COLORS.text, fontSize: 12, flexShrink: 1 },
  legendTextActive: { fontWeight: "800" },
  tooltip: { backgroundColor: "#0F172A", paddingHorizontal: 8, paddingVertical: 6, borderRadius: 6 },
  tooltipText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
