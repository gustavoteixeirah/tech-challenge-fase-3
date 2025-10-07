import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import { useAuth } from "../auth/AuthContext";
import {
  TransactionTypeEnum,
  TransactionCategoryEnum,
  categoryKeywords,
  Transaction,
} from "../types/transactions";
import Toast from "react-native-toast-message";
import * as DocumentPicker from "expo-document-picker";

type TransactionFormProps = {
  onClick: (transaction: Transaction) => void;
  buttonLabel: string;
  defaultValues?: Transaction;
};

function showToast(message: string, type: "success" | "error" = "error") {
  Toast.show({
    type,
    text1: message,
    position: "top",
    visibilityTime: 3000,
  });
}

export function TransactionForm({
  onClick,
  buttonLabel,
  defaultValues,
}: TransactionFormProps) {
  const { user } = useAuth();
  const uid = user?.uid;

  const [transactionType, setTransactionType] = useState<TransactionTypeEnum>(
    defaultValues?.type ?? TransactionTypeEnum.TRANSFER
  );
  const [amount, setAmount] = useState(defaultValues?.amount?.toString() ?? "");
  const [description, setDescription] = useState(
    defaultValues?.description ?? ""
  );
  const [category, setCategory] = useState(defaultValues?.category ?? "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Transferência", value: TransactionTypeEnum.TRANSFER },
    { label: "Depósito", value: TransactionTypeEnum.DEPOSIT },
  ]);
  const [existingReceipt, setExistingReceipt] = useState<string | undefined>(
    defaultValues?.receiptBase64
  );
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

  function handleDescriptionChange(text: string) {
    setDescription(text);
    const lowerText = text.toLowerCase();
    const matchedCategory = Object.entries(categoryKeywords).find(
      ([category, keywords]) =>
        keywords.some((kw) => lowerText.includes(kw.toLowerCase()))
    );
    if (matchedCategory) {
      setCategory(matchedCategory[0] as TransactionCategoryEnum);
    }
  }

  function handleOnClick() {
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

    if (receipt) {
      const uri = receipt.uri.toLowerCase();
      if (
        !uri.endsWith(".jpg") &&
        !uri.endsWith(".jpeg") &&
        !uri.endsWith(".png")
      ) {
        showToast("Formato de comprovante inválido.");
        return;
      }

      // Check size (5MB)
      if (receipt.base64 && receipt.base64.length * (3 / 4) > 5 * 1024 * 1024) {
        showToast("Comprovante muito grande (máx 5MB).");
        return;
      }
    }

    const transaction = {
      type: transactionType,
      amount: normalizedAmount,
      createdAt: defaultValues?.createdAt ?? new Date().toISOString(),
      id: defaultValues?.id ?? uuid.v4(), // mantem o id se for edição
      category: category || undefined,
      description: description || undefined,
      receiptBase64: receipt?.base64 || existingReceipt || undefined,
    };

    onClick(transaction);

    if (!defaultValues?.id) {
      setAmount("");
      setDescription("");
      setCategory("");
      setReceipt(null);
    }
  }

  return (
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
      <TouchableOpacity onPress={pickReceipt}>
        <View style={styles.receiptButton}>
          <Text style={{ color: "#000000" }}>Selecionar comprovante</Text>
        </View>
      </TouchableOpacity>
      {(receipt || existingReceipt) && (
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
        >
          <Image
            source={{
              uri:
                receipt?.uri ||
                (existingReceipt?.startsWith("data:image")
                  ? existingReceipt
                  : `data:image/jpeg;base64,${existingReceipt}`),
            }}
            style={styles.imagePicker}
          />
          <TouchableOpacity
            onPress={() => {
              setReceipt(null);
              setExistingReceipt(undefined);
            }}
            style={{ marginLeft: 10 }}
          >
            <Ionicons name="trash" size={28} color="red" />
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={handleOnClick}>
        <View style={styles.button}>
          <Text style={{ color: "white" }}>{buttonLabel}</Text>
        </View>
      </TouchableOpacity>
      <View style={{ height: 10 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", gap: 8 },
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
  button: {
    backgroundColor: "#0F172A",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    padding: 15,
  },
  receiptButton: {
    backgroundColor: "#d8e373",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    padding: 15,
  },
  transaction: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdown: { borderColor: "#ccc", borderRadius: 6, marginBottom: 15 },
  imagePicker: {
    width: 100,
    height: 100,
    borderRadius: 6,
    borderColor: "#000000",
  },
});
