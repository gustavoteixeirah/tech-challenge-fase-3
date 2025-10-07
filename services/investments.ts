import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export type InvestmentDoc = {
  id: string;
  userId: string;
  month: string;   // "Jan", "Feb", etc.
  year: number;    // 2024
  value: number;   // número
  createdAt: string;
  type: string;
};

export async function getUserInvestments(userId: string): Promise<InvestmentDoc[]> {
  const col = collection(db, "investments");
  const q = query(col, where("userId", "==", userId), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}
