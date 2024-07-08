// hooks/useExpenses.js
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/config";

export const useExpenses = (projectId) => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (!projectId) return;

    const expensesRef = collection(db, "projects", projectId, "expenses");
    const q = query(expensesRef, where("deleted", "==", false));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expensesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(expensesData);
    });

    return () => unsubscribe();
  }, [projectId]);

  return expenses;
};
