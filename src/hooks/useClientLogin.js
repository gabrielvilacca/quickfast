// src/hooks/useClientLogin.js
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const useClientLogin = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [claims, setClaims] = useState(null); // Armazena os claims do usuário

  const auth = getAuth();

  const login = async (email, password) => {
    setIsPending(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = userCredential.user;

      // Obtém os claims do token do usuário
      const idTokenResult = await userData.getIdTokenResult();
      setClaims(idTokenResult.claims); // Armazena os claims

      // Definir o usuário autenticado
      setUser({
        email: userData.email,
        uid: userData.uid,
        // Inclua outros campos que você deseja armazenar
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { login, isPending, error, user, claims };
};

export default useClientLogin;
