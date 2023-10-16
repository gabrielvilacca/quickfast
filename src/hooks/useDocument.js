import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useFirestore } from './useFirestore';

export const useDocument = (coll, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const { addDocument: logError } = useFirestore('errors');

  useEffect(() => {
    if (!coll || !id) return;

    const unsub = onSnapshot(doc(db, coll, id), (docSnapshot) => {
      if (docSnapshot.data()) {
        setDocument({ ...docSnapshot.data(), id: docSnapshot.id });
        setError(null);
      } else {
        setError('Dados não encontrados.');
        setDocument(undefined);
        console.log('Dados não encontrados');
      }
    }, (err) => {
      setError(err.message);
      console.log(err.message);
      logError({
        error: err.message,
        documentId: id,
        collection: coll,
        where: 'useDocument',
      });
    });

    return () => unsub();
  }, [coll, id]);

  return { document, error };
};
