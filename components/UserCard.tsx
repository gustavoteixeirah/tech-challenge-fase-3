import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { IconEye, IconEyeOff } from "../Icons/Icons/icons";


type UserCardProps = {
  name: string;
  balance: number;
};

const formatCurrency = (value: number): string => {
  const formattedValue = Math.abs(value).toLocaleString("pt-BR", { 
    style: "currency", 
    currency: "BRL" 
  });
  
  return value >= 0 ? formattedValue : `- ${formattedValue}`;
};

const getToday = () => {
  const today = new Date();
  return Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(today);
};

const UserCard: React.FC<UserCardProps> = ({ name, balance }) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.name}>Olá {name}! :)</Text>
        <Text style={styles.date}>{getToday()}</Text>
        <View>
          <View style={styles.balanceFirstRow}>
            <Text style={styles.balanceLabel}>Saldo</Text>
            <TouchableOpacity onPress={() => setShowBalance((prev) => !prev)}>
              <Text style={styles.toggle}>
                {showBalance ? <IconEye /> : <IconEyeOff />}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.accountName}>Conta Corrente</Text>
          <Text style={styles.balanceValue}>
            {showBalance ? formatCurrency(balance) : "••••••"}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: "#000",
    borderRadius: 12,
    padding: 50,
    margin: 16,
    elevation: 3,
    shadowColor: "#FFF",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FFF",
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
    color: "#FFF",
  },
  balanceFirstRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderBottomColor: "#FFF",
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingBottom: 10,
  },
  balanceLabel: {
    fontSize: 25,
    color: "#FFF",
    fontWeight: "500",
  },
  balanceValue: {
    fontSize: 31,
    marginRight: 12,
    color: "#FFF",
  },
  toggle: {
    fontSize: 14,
    color: "#007AFF",
  },
  accountName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
  },
});

export default UserCard;
