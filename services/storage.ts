import AsyncStorage from "@react-native-async-storage/async-storage";
import { Transaction } from "./transactions";

const STORAGE_KEY = "transactions";

export async function getTransactions(): Promise<Transaction> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.error("Error loading transactions", error);
    return [];
  }
}

export async function saveTransactions(transactions: Transaction): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error("Error saving transactions", error);
  }
}