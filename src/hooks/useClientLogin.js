// src/hooks/useClientLogin.js
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const useClientLogin = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const auth = getAuth();

  const login = async (email, password) => {
    setIsPending(true);
    setError(null);

    try {
      // Autenticar o usuário com Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userData = userCredential.user;

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

  return { login, isPending, error, user };
};

export default useClientLogin;
