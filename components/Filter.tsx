import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { TransactionTypeEnum } from "../types/transactions";
import RNDateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native";

const BORDER_COLOR = "#ccc";

type FilterProps = {
  onFilter: (selected: string[]) => void;
};

const categories = ["Alimentação", "Transporte", "Saúde", "Lazer", "Outros"];

const Filter: React.FC<FilterProps> = ({ onFilter }) => {
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Transferência", value: TransactionTypeEnum.TRANSFER },
    { label: "Depósito", value: TransactionTypeEnum.DEPOSIT },
  ]);
  const [openCategory, setOpenCategory] = useState(false);
  const [categoryItems, setCategoryItems] = useState(
    categories.map((cat) => ({ label: cat, value: cat }))
  );

  const [initDate, setInitDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [openInitDate, setOpenInitDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  useEffect(() => {
    onFilter([
      transactionType || "",
      selectedCategory || "",
      initDate ? initDate.toISOString() : "",
      endDate ? endDate.toISOString() : "",
    ]);
  }, [transactionType, selectedCategory, initDate, endDate]);

  const onFilterClean = () => {
    setTransactionType(null);
    setSelectedCategory("");
    setInitDate(undefined);
    setEndDate(undefined);
  };

  const setDate = (event: DateTimePickerEvent, date: Date) => {
    const { type } = event;
    handleDateChange(
      type,
      date,
      openInitDate,
      openEndDate,
      setInitDate,
      setEndDate,
      setOpenInitDate,
      setOpenEndDate
    );
  };

  const handleDateChange = (
    type: string,
    date: Date,
    isInitDateOpen: boolean,
    isEndDateOpen: boolean,
    setInitDate: (date: Date) => void,
    setEndDate: (date: Date) => void,
    setOpenInitDate: (open: boolean) => void,
    setOpenEndDate: (open: boolean) => void
  ) => {
    if (type === "set") {
      if (isInitDateOpen) {
        setInitDate(date);
        setOpenInitDate(false);
      } else if (isEndDateOpen) {
        setEndDate(date);
        setOpenEndDate(false);
      }
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.sessionTitle}>Filtrar por periodo</Text>
        <Pressable onPress={() => setOpenInitDate(true)}>
          <View style={styles.dataContainer}>
            <Text style={styles.upText}>Data Inicial</Text>
            {initDate && (
              <Text style={styles.downText}>
                {initDate.toLocaleDateString("pt-BR")}
              </Text>
            )}
          </View>
        </Pressable>
        <Pressable onPress={() => setOpenEndDate(true)}>
          <View style={styles.dataContainer}>
            <Text style={styles.upText}>Data Final</Text>
            {endDate && (
              <Text style={styles.downText}>
                {endDate.toLocaleDateString("pt-BR")}
              </Text>
            )}
          </View>
        </Pressable>
        <View>
          {openInitDate && (
            <RNDateTimePicker
              locale="pt-BR"
              value={new Date()}
              onChange={setDate}
            />
          )}
          {openEndDate && (
            <RNDateTimePicker
              locale="pt-BR"
              value={new Date()}
              onChange={setDate}
            />
          )}
          <Text style={styles.sessionTitle}>Filtrar por opção</Text>
          <DropDownPicker
            open={open}
            value={transactionType}
            items={items}
            setOpen={setOpen}
            setValue={setTransactionType}
            setItems={setItems}
            style={styles.dropdown}
            dropDownContainerStyle={{ borderColor: BORDER_COLOR, zIndex: 5000 }}
            placeholder="Selecione o tipo de transação"
            onOpen={() => {
              setOpenCategory(false);
              setOpen(true);
            }}
            onChangeValue={(value) => setTransactionType(value || null)}
          />

          <DropDownPicker
            open={openCategory}
            value={selectedCategory}
            items={categoryItems}
            setOpen={setOpenCategory}
            setValue={setSelectedCategory}
            setItems={setCategoryItems}
            style={styles.dropdown}
            dropDownContainerStyle={{ borderColor: BORDER_COLOR }}
            placeholder="Selecione a categoria"
            onOpen={() => {
              setOpen(false);
              setOpenCategory(true);
            }}
            onChangeValue={(value) => setSelectedCategory(value || "")}
          />
        </View>
      </View>
      <Pressable style={{ height: 20 }} onPress={onFilterClean}>
        <Text style={{ textAlign: "center", color: "#888" }}>
          Limpar Filtros
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Filter;

const styles = StyleSheet.create({
  dataContainer: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  dropdown: { borderColor: BORDER_COLOR, borderRadius: 6, marginBottom: 15 },
  upText: { fontSize: 16, color: "#666", paddingLeft: 10 },
  upTextData: { fontSize: 12, color: "#666", paddingLeft: 10 },
  downText: { fontSize: 16, marginTop: 10, paddingLeft: 10 },
  sessionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});
