// src/hooks/useClients.js
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

const useClients = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "clients"), (snapshot) => {
      const clientsData = snapshot.docs.map((doc) => {
        const client = doc.data();
        return {
          id: doc.id,
          ...client,
        };
      });
      setClients(clientsData);
    });

    return () => unsubscribe();
  }, []);

  return clients;
};

export default useClients;
