import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, SafeAreaView } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import RNDateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { TransactionTypeEnum } from "../types/transactions";

const BORDER_COLOR = "#ccc";
const categories = ["Alimentação", "Transporte", "Saúde", "Lazer", "Outros"];

type FilterProps = {
  onFilter: (selected: string[]) => void;
};

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

  const setDate = (event: DateTimePickerEvent, date?: Date) => {
    if (!date) return;
    handleDateChange(
      event.type,
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
    setInit: (date: Date) => void,
    setEnd: (date: Date) => void,
    setOpenInit: (open: boolean) => void,
    setOpenEnd: (open: boolean) => void
  ) => {
    if (type === "set") {
      if (isInitDateOpen) {
        setInit(date);
        setOpenInit(false);
      } else if (isEndDateOpen) {
        setEnd(date);
        setOpenEnd(false);
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
            {initDate ? (
              <Text style={styles.downText}>{initDate.toLocaleDateString("pt-BR")}</Text>
            ) : null}
          </View>
        </Pressable>

        <Pressable onPress={() => setOpenEndDate(true)}>
          <View style={styles.dataContainer}>
            <Text style={styles.upText}>Data Final</Text>
            {endDate ? (
              <Text style={styles.downText}>{endDate.toLocaleDateString("pt-BR")}</Text>
            ) : null}
          </View>
        </Pressable>

        {openInitDate && (
          <RNDateTimePicker locale="pt-BR" value={initDate || new Date()} onChange={setDate} />
        )}
        {openEndDate && (
          <RNDateTimePicker locale="pt-BR" value={endDate || new Date()} onChange={setDate} />
        )}

        <Text style={styles.sessionTitle}>Filtrar por opção</Text>

        <View style={{ zIndex: 2000 }}>
          <DropDownPicker
            open={open}
            value={transactionType}
            items={items}
            setOpen={setOpen}
            setValue={setTransactionType}
            setItems={setItems}
            style={styles.dropdown}
            dropDownContainerStyle={{ borderColor: BORDER_COLOR, zIndex: 2000 }}
            placeholder="Selecione o tipo de transação"
            onOpen={() => {
              setOpenCategory(false);
              setOpen(true);
            }}
            onChangeValue={(value) => setTransactionType(value || null)}
          />
        </View>

        <View style={{ zIndex: 1000, marginTop: 10 }}>
          <DropDownPicker
            open={openCategory}
            value={selectedCategory}
            items={categoryItems}
            setOpen={setOpenCategory}
            setValue={setSelectedCategory}
            setItems={setCategoryItems}
            style={styles.dropdown}
            dropDownContainerStyle={{ borderColor: BORDER_COLOR, zIndex: 1000 }}
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
        <Text style={styles.clearFilterButton}>Limpar Filtros</Text>
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
  downText: { fontSize: 16, marginTop: 10, paddingLeft: 10 },
  sessionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  clearFilterButton: {
    textAlign: "center",
    color: "#888",
  },
});
