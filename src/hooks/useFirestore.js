import { useReducer, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, timestamp } from "../firebase/config";

const initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case "IS_PENDING":
      return {
        isPending: true,
        document: null,
        success: false,
        error: null,
      };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "SET_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return {
        isPending: false,
        document: null,
        success: true,
        error: null,
      };
    case "UPDATED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    default:
      return { ...state, isPending: false };
  }
};

export const useFirestore = (coll) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);

  // Collection ref
  const ref = collection(db, coll);

  // Only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action);
    }
  };

  // Add a document
  const addDocument = async (doc) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const createdAt = timestamp;
      const addedDocument = await addDoc(ref, { ...doc, createdAt });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
      return { type: "SUCCESS", payload: addedDocument.id };
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      return { type: "ERROR", payload: err.message };
    }
  };

  // Set a document
  const createDocument = async (id, data) => {
    try {
      const createdAt = timestamp;

      const documentSet = await setDoc(doc(db, coll, id), {
        ...data,
        createdAt,
      });

      dispatchIfNotCancelled({
        type: "SET_DOCUMENT",
        payload: documentSet,
      });
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      return { type: "ERROR", payload: err.message };
    }
  };

  // Update a document
  const updateDocument = async (id, updates) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const docRef = doc(db, coll, id);
      console.log("id", " => ", id);
      const updatedDocument = await updateDoc(docRef, {
        ...updates,
        lastEdited: timestamp,
      });
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedDocument,
      });
      return { type: "SUCCESS", payload: updatedDocument };
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      console.log(err);
      console.log(updates);
      return { type: "ERROR", payload: err.message };
    }
  };

  // Remove a document
  const deleteDocument = async (id) => {
    dispatch({ type: "IS_PENDING" });

    try {
      await deleteDoc(doc(ref, id));
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
      return { type: "SUCCESS", payload: "" };
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      return { type: "ERROR", payload: err.message };
    }
  };

  const addSubDocument = async (docId, subcoll, data) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const createdAt = timestamp;
      const subcollRef = collection(db, `${coll}/${docId}/${subcoll}`);
      const addedSubDocument = await addDoc(subcollRef, { ...data, createdAt });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedSubDocument,
      });
      return { type: "SUCCESS", payload: addedSubDocument.id };
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      return { type: "ERROR", payload: err.message };
    }
  };

  // Remove a subdocument
  const deleteSubDocument = async (docId, subcoll, subDocId) => {
    dispatch({ type: "IS_PENDING" });

    try {
      const subDocRef = doc(db, `${coll}/${docId}/${subcoll}`, subDocId);
      await deleteDoc(subDocRef);
      dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
      return { type: "SUCCESS", payload: "" };
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      return { type: "ERROR", payload: err.message };
    }
  };

  const updateSubDocument = async (docId, subcoll, subDocId, updates) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const subDocRef = doc(db, `${coll}/${docId}/${subcoll}`, subDocId);
      const updatedSubDocument = await updateDoc(subDocRef, {
        ...updates,
        lastEdited: timestamp,
      });
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedSubDocument,
      });
      return { type: "SUCCESS", payload: updatedSubDocument };
    } catch (err) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      console.log(err);
      return { type: "ERROR", payload: err.message };
    }
  };

  useEffect(() => () => setIsCancelled(true), []);

  return {
    addDocument,
    deleteDocument,
    createDocument,
    updateDocument,
    addSubDocument,
    updateSubDocument,
    deleteSubDocument,
    response,
    serverTimestamp,
  };
};
