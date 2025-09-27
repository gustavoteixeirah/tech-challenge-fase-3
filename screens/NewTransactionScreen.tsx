import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  addTransaction,
  getTransactions,
  deleteTransaction,
} from "../services/transactions";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { useAuth } from "../auth/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import {
  TransactionTypeEnum,
  TransactionCategoryEnum,
  categoryKeywords,
  Transaction,
} from "../types/transactions";

export default function NewTransactionScreen() {
  const { user } = useAuth();
  const uid = user?.uid;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionType, setTransactionType] = useState<TransactionTypeEnum>(
    TransactionTypeEnum.TRANSFER
  );
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<TransactionCategoryEnum | "">("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Transferência", value: TransactionTypeEnum.TRANSFER },
    { label: "Depósito", value: TransactionTypeEnum.DEPOSIT },
  ]);
  const [receipt, setReceipt] = useState<ImagePicker.Asset | null>(null);

  // Carregar transações do usuário
  useEffect(() => {
    if (!uid) return;
    async function load() {
      const data = await getTransactions(uid);
      setTransactions(data);
    }
    load();
  }, [uid]);

  const normalizeAmount = (value: string) => value.replace(",", ".");

  // Teste de upload
  //   async function pickReceipt() {
  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images, // ou use mediaTypes: ImagePicker.MediaType.Images se sua versão suportar
  //       quality: 0.7,
  //     });
  //     if (!result.canceled) {
  //       setReceipt(result.assets[0]);
  //     }
  //   }

  //  <Button title="Selecionar Comprovante" onPress={pickReceipt} />
  //   {receipt && (
  //     <View
  //       style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
  //     >
  //       <Image source={{ uri: receipt.uri }} style={styles.imagePicker} />
  //       <TouchableOpacity
  //         onPress={() => setReceipt(null)}
  //         style={{ marginLeft: 10 }}
  //       >
  //         <Ionicons name="trash" size={28} color="red" />
  //       </TouchableOpacity>
  //     </View>
  //   )} */
  //     <FlatList
  //     data={transactions}
  //     keyExtractor={(item) => item.id!}
  //     renderItem={({ item }) => (
  //       <View style={styles.transaction}>
  //         <Text style={styles.txTitle}>{item.description || item.type}</Text>
  //         <Text style={styles.txAmount}>${item.amount}</Text>
  //         <TouchableOpacity
  //           onPress={() => handleDelete(item.id)}
  //           style={{ marginLeft: 10 }}
  //         >
  //           <Ionicons name="trash" size={28} color="red" />
  //         </TouchableOpacity>
  //       </View>
  //     )}
  //   />

  async function handleSave() {
    if (!uid) {
      Alert.alert("Erro", "Usuário não autenticado");
      return;
    }
    if (!amount) {
      Alert.alert("Erro", "Preencha o valor da transação");
      return;
    }

    try {
      const newTx: Transaction = {
        type: transactionType,
        amount: Number(normalizeAmount(amount)),
        createdAt: new Date().toISOString(),
        id: uuid.v4() as string,
        userId: uid,
        fileUrl: receipt?.uri,
        category: category || undefined,
        description: description || undefined,
      };

      const saved = await addTransaction(uid, newTx, receipt);

      setTransactions([saved, ...transactions]);
      setAmount("");
      setDescription("");
      setCategory("");
      setTransactionType(TransactionTypeEnum.TRANSFER);
      setReceipt(null);
      Alert.alert("Sucesso", "Transação adicionada!");
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  function handleDescriptionChange(text: string) {
    setDescription(text);

    // Detecta categoria automaticamente
    const lowerText = text.toLowerCase();
    const matchedCategory = Object.entries(categoryKeywords).find(
      ([category, keywords]) =>
        keywords.some((kw) => lowerText.includes(kw.toLowerCase()))
    );

    if (matchedCategory) {
      setCategory(matchedCategory[0] as TransactionCategoryEnum);
    }
  }

  async function handleDelete(transactionId: string) {
    if (!uid) return;

    try {
      await deleteTransaction(uid, transactionId);
      //   Alert.alert("Success", "Transação deletada!");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de Transação*</Text>
      <DropDownPicker
        open={open}
        value={transactionType}
        items={items}
        setOpen={setOpen}
        setValue={setTransactionType}
        setItems={setItems}
        style={styles.dropdown}
        dropDownContainerStyle={{ borderColor: "#ccc" }}
      />

      <Text style={styles.label}>Valor*</Text>
      <TextInput
        style={styles.input}
        placeholder="0,0"
        placeholderTextColor="gray"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Uber, Salário..."
        placeholderTextColor="gray"
        value={description}
        onChangeText={handleDescriptionChange}
      />

      <Text style={styles.label}>Categoria</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Lazer, Transporte..."
        placeholderTextColor="gray"
        value={category}
        onChangeText={(text) => {
          setCategory(text as TransactionCategoryEnum);
        }}
      />

      <TouchableOpacity onPress={handleSave}>
        <View style={styles.button}>
          <Text style={{ color: "white" }}>Concluir Transação</Text>
        </View>
      </TouchableOpacity>

      <View style={{ height: 10 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    paddingTop: 40,
    gap: 8,
    backgroundColor: "#fff",
  },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  listTitle: { fontSize: 18, fontWeight: "bold", marginVertical: 15 },
  button: {
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 15,
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  txTitle: { fontSize: 16 },
  txAmount: { fontSize: 16, fontWeight: "600" },
  dropdown: { borderColor: "#ccc", borderRadius: 6, marginBottom: 15 },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 6,
    borderColor: "#ccc",
  },
});
