import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Transaction } from "../types/transactions";

export async function addTransaction(
  uid: string,
  transaction: Transaction,
  receiptFile?: { uri: string; fileName?: string }
): Promise<Transaction & { id: string }> {
  let receiptUrl: string | undefined;

  if (receiptFile?.uri) {
    const fileName = receiptFile.fileName ?? `${Date.now()}.jpg`;
    const storageRef = ref(storage, `receipts/${uid}/${fileName}`);
    const response = await fetch(receiptFile.uri);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);
    receiptUrl = await getDownloadURL(storageRef);
  }

  // Só inclui valores definidos
  const transactionData: Partial<Transaction> = { ...transaction };
  if (receiptUrl) transactionData.receiptUrl = receiptUrl;

  // Remove valores undefined
  Object.keys(transactionData).forEach(
    (key) =>
      transactionData[key as keyof Transaction] === undefined &&
      delete transactionData[key as keyof Transaction]
  );

  const txRef = collection(db, "users", uid, "transactions"); //Caminho para a collection de transações
  const docRef = await setDoc(doc(txRef, transaction.id), transactionData);

  return transactionData;
}

export async function getTransactions(uid: string): Promise<(Transaction & { id: string })[]> {
  const txRef = collection(db, "users", uid, "transactions");
  const snapshot = await getDocs(query(txRef));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as (Transaction & { id: string })[];
}

export async function deleteTransaction(uid: string, transactionId: string) {
    try {
        const txDoc = doc(db, `users/${uid}/transactions`, transactionId);
        await deleteDoc(txDoc);
        console.log("Documento deletado");
    } catch (error){
        throw new Error(error);
    }
}
