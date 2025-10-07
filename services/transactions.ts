import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  query,
  deleteDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Transaction } from "../types/transactions";

export async function addTransaction(
  uid: string,
  transactionData: Transaction
){

  // Remove valores undefined
  Object.keys(transactionData).forEach(
    (key) =>
      transactionData[key as keyof Transaction] === undefined &&
      delete transactionData[key as keyof Transaction]
  );

  const txRef = collection(db, "users", uid, "transactions"); //Caminho para a collection de transações
  const docRef = await setDoc(doc(txRef, transactionData.id), transactionData);

  return {
  ...transactionData,
  id: transactionData.id,
} as Transaction & { id: string };
}

export async function getTransactions(
  uid: string
): Promise<(Transaction & { id: string })[]> {
  const txRef = collection(db, "users", uid, "transactions");
  const snapshot = await getDocs(query(txRef));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })).sort((a)=> new Date(a.createdAt).getTime()) as (Transaction & { id: string })[];
}

export async function deleteTransaction(uid: string, transactionId: string) {
  try {
    const txDoc = doc(db, `users/${uid}/transactions`, transactionId);
    await deleteDoc(txDoc);
  } catch (error) {
    throw new Error(error);
  }
}

export async function updateTransaction(
  uid: string,
  transactionId: string,
  updatedData: Transaction
): Promise<Transaction> {
  if (!uid || !transactionId) throw new Error("Missing user ID or transaction ID");

  // Remove valores undefined
  Object.keys(updatedData).forEach(
    (key) =>
      updatedData[key as keyof Transaction] === undefined &&
      delete updatedData[key as keyof Transaction]
  );

  const txRef = doc(db, "users", uid, "transactions", transactionId);
  try {
    await setDoc(txRef, updatedData, { merge: true });

  }catch(error){
    console.log("setDoc: ", error)
  }

  const updatedDoc = await getDoc(txRef);
  return { id: transactionId, ...updatedDoc.data() } as Transaction & { id: string };
}

