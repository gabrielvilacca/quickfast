import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, timestamp } from "../firebase/config";
import { useAuthContext } from "./useAuthContext";
import { useQuery } from "./useQuery";

export const useSignup = () => {
  const query = useQuery();
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, phone, name) => {
    setError(null);
    setIsPending(true);

    try {
      // Sign up user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      if (!res || !res.user) {
        setIsPending(false);
        throw new Error("Não foi possível realizar o cadastro.");
      }

      // // Add display name to user
      await updateProfile(res.user, { displayName: name });

      // Create a user document
      const createdAt = timestamp;

      await setDoc(doc(db, "users", res.user.uid), {
        id: res.user.uid,
        online: true,
        createdAt,
        email: email,
        name: name,
        phone: phone,
        user_agent: navigator.userAgent,
        origin: window.location.href.split("?")[0],
        fbp: getCookie("_fbp"),
        fbc: getCookie("_fbc"),
        utm: {
          source: query.get("utm_source") || getCookie("utm_source"),
          medium: query.get("utm_medium") || getCookie("utm_medium"),
          campaign: query.get("utm_campaign") || getCookie("utm_campaign"),
          term: query.get("utm_term") || getCookie("utm_term"),
          content: query.get("utm_content") || getCookie("utm_content"),
        },
        sck: query.get("sck") || getCookie("sck"),
      });

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: res.user });

      // Update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => () => setIsCancelled(true), []);

  return { error, isPending, signup };
};
