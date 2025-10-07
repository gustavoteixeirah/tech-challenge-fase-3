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
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";

function showToast(message: string, type: "success" | "error" = "error") {
  Toast.show({
    type,
    text1: message,
    position: "top",
    visibilityTime: 3000,
    autoHide: true,
  });
}

export default function NewTransactionScreen({ route }) {
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

  const navigation = useNavigation();
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

  async function pickReceipt() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setReceipt({
        ...result.assets[0],
        base64: result.assets[0].base64,
      });
    }
  }

  async function handleSave() {
    // Itens obrigatórios
    if (!uid) {
      showToast("Usuário não autenticado.");
      return;
    }
    if (!amount) {
      showToast("Preencha o valor da transação.");
      return;
    }

    const normalizedAmount = Number(normalizeAmount(amount));

    // Valida valor
    if (isNaN(normalizedAmount) || normalizedAmount <= 0) {
      showToast("Valor da transação inválido.");
      return;
    }

    // Checa valor máximo (R$1,000,000)
    if (normalizedAmount > 1000000) {
      showToast("Valor da transação muito alto.");
      return;
    }

    // Checa formato do recibo
    if (receipt && !["image/jpeg", "image/png"].includes(receipt.type || "")) {
      showToast("Formato de comprovante inválido.");
      return;
    }

    // Checa tamanho do recibo (5MB)
    if (
      receipt &&
      receipt.base64 &&
      receipt.base64.length * (3 / 4) > 5 * 1024 * 1024
    ) {
      showToast("Comprovante muito grande (máx 5MB).");
      return;
    }

    try {
      const newTx: Transaction = {
        type: transactionType,
        amount: normalizedAmount,
        createdAt: new Date().toISOString(),
        id: uuid.v4() as string,
        userId: uid,
        category: category || undefined,
        description: description || undefined,
      };

      const saved = await addTransaction(
        uid,
        newTx,
        receipt ? { base64: receipt.base64! } : undefined
      );

      setTransactions([saved, ...transactions]);
      setAmount("");
      setDescription("");
      setCategory("");
      setTransactionType(TransactionTypeEnum.TRANSFER);
      setReceipt(null);
      showToast("Transação adicionada!", "success");
      navigation.navigate("Home" as never);
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
      <CustomHeader 
        title="Nova Transação" 
        showUserInfo={false}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Text style={{ color: "#8d8d8dff" }}>*Itens Obrigatórios</Text>
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
      <Button title="Selecionar Comprovante" onPress={pickReceipt} />
      {receipt && (
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          <Image source={{ uri: receipt.uri }} style={styles.imagePicker} />
          <TouchableOpacity
            onPress={() => setReceipt(null)}
            style={{ marginLeft: 10 }}
          >
            <Ionicons name="trash" size={28} color="red" />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity onPress={handleSave}>
        <View style={styles.button}>
          <Text style={{ color: "white" }}>Concluir Transação</Text>
        </View>
      </TouchableOpacity>
      <View style={{ height: 10 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 50,
    paddingTop: 20,
    gap: 8,
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
