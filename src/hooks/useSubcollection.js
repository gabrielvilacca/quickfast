import { useEffect, useState, useRef } from "react";
import {
  query,
  onSnapshot,
  where,
  orderBy,
  limit,
  collection,
} from "firebase/firestore";
import { db } from "../firebase/config";

export const useSubcollection = (
  coll,
  docId,
  subcoll,
  _query,
  _orderBy,
  _limit
) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  const q = useRef(_query).current;
  const ob = useRef(_orderBy).current;

  useEffect(() => {
    // Create a reference to the subcollection
    let ref = collection(db, `${coll}/${docId}/${subcoll}`);

    if (q) {
      ref = query(ref, where(...q));
    }

    if (ob) {
      ref = query(ref, orderBy(...ob));
    }

    if (_limit) {
      ref = query(ref, limit(_limit));
    }

    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        const results = [];
        snapshot.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log("Erro na subcoleção ", subcoll);
        console.log(error);
        setError("Could not fetch the documents.");
      }
    );

    // Cleanup
    return () => unsub();
  }, [coll, docId, subcoll, q, ob, _limit]);

  return { documents, error };
};
