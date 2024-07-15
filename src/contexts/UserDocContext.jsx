import { createContext, useContext } from "react";
import { useDocument } from "@/hooks/useDocument";
import { AuthContext } from "./AuthContext";

export const UserDocContext = createContext();

export function UserDocProvider({ children }) {
  const { user } = useContext(AuthContext);
  const { document: userDoc } = useDocument("users", user?.uid);

  return (
    <UserDocContext.Provider value={{ userDoc }}>
      {children}
    </UserDocContext.Provider>
  );
}
