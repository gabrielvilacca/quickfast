// hooks/useProjects.js

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import useClients from "./useClients"; // Corrigido para importação padrão

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const clients = useClients();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const projectsData = snapshot.docs.map((doc) => {
        const project = doc.data();
        const client = clients.find((client) => client.id === project.clientId);
        return {
          id: doc.id,
          ...project,
          clientName: client ? client.name : "Cliente desconhecido",
        };
      });
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, [clients]);

  return projects;
};
