import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  addTransaction,
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
  const navigation = useNavigation();

  const editingTx = route?.params?.transaction as Transaction | undefined;

  const [transactionType, setTransactionType] = useState<TransactionTypeEnum>(
    editingTx?.type ?? TransactionTypeEnum.TRANSFER
  );
  const [amount, setAmount] = useState(editingTx ? String(editingTx.amount) : "");
  const [description, setDescription] = useState(editingTx?.description ?? "");
  // categoria como string; validamos contra o enum ao salvar
  const [category, setCategory] = useState<string>(editingTx?.category ?? "");

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Transferência", value: TransactionTypeEnum.TRANSFER },
    { label: "Depósito", value: TransactionTypeEnum.DEPOSIT },
  ]);
  const [receipt, setReceipt] = useState<ImagePicker.Asset | null>(null);

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
    if (!uid) {
      showToast("Usuário não autenticado.");
      return;
    }
    if (!amount) {
      showToast("Preencha o valor da transação.");
      return;
    }

    const normalizedAmount = Number(normalizeAmount(amount));
    if (isNaN(normalizedAmount) || normalizedAmount <= 0) {
      showToast("Valor da transação inválido.");
      return;
    }
    if (normalizedAmount > 1000000) {
      showToast("Valor da transação muito alto.");
      return;
    }
    if (receipt && !["image/jpeg", "image/png"].includes(receipt.type || "")) {
      showToast("Formato de comprovante inválido.");
      return;
    }
    if (receipt && receipt.base64 && receipt.base64.length * (3 / 4) > 5 * 1024 * 1024) {
      showToast("Comprovante muito grande (máx 5MB).");
      return;
    }

    // validação da categoria: só aceita se estiver no enum
    const catEnum = Object.values(TransactionCategoryEnum).includes(
      category as TransactionCategoryEnum
    )
      ? (category as TransactionCategoryEnum)
      : undefined;

    try {
      const tx: Transaction = {
        type: transactionType,
        amount: normalizedAmount,
        createdAt: editingTx?.createdAt ?? new Date().toISOString(),
        id: editingTx?.id ?? (uuid.v4() as string),
        userId: uid,
        category: catEnum,
        description: description || undefined,
      };

      // upsert por id
      await addTransaction(
        uid,
        tx,
        receipt ? { base64: receipt.base64! } : undefined
      );

      showToast(editingTx ? "Transação atualizada!" : "Transação adicionada!", "success");
      navigation.navigate("Home" as never);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  function handleDescriptionChange(text: string) {
    setDescription(text);

    const lowerText = text.toLowerCase();
    const matchedCategory = Object.entries(categoryKeywords).find(
      ([cat, keywords]) =>
        keywords.some((kw) => lowerText.includes(kw.toLowerCase()))
    );

    if (matchedCategory) {
      setCategory(matchedCategory[0]);
    }
  }

  async function handleDeleteTx() {
    if (!uid || !editingTx?.id) return;
    try {
      await deleteTransaction(uid, editingTx.id);
      showToast("Transação deletada!", "success");
      navigation.navigate("Home" as never);
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <CustomHeader
        title={editingTx ? "Editar Transação" : "Nova Transação"}
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
          onChangeText={setCategory}
        />

        <Button title="Selecionar Comprovante" onPress={pickReceipt} />
        {receipt && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
            <Image source={{ uri: receipt.uri }} style={styles.imagePicker} />
            <TouchableOpacity onPress={() => setReceipt(null)} style={{ marginLeft: 10 }}>
              <Ionicons name="trash" size={28} color="red" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={handleSave}>
          <View style={styles.button}>
            <Text style={{ color: "white" }}>
              {editingTx ? "Salvar Alterações" : "Concluir Transação"}
            </Text>
          </View>
        </TouchableOpacity>

        {editingTx ? (
          <TouchableOpacity onPress={handleDeleteTx}>
            <View style={[styles.button, { backgroundColor: "red", marginTop: 10 }]}>
              <Text style={{ color: "white" }}>Excluir Transação</Text>
            </View>
          </TouchableOpacity>
        ) : null}

        <View style={{ height: 10 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, padding: 50, paddingTop: 20, gap: 8 },
  label: { fontSize: 16, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 15,
  },
  dropdown: { borderColor: "#ccc", borderRadius: 6, marginBottom: 15 },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 6,
    borderColor: "#ccc",
  },
});
