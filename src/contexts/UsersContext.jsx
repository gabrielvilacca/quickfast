import { createContext } from "react";
import { useCollection } from "@/hooks/useCollection";

export const UsersContext = createContext();

export function UsersProvider({ children, userDoc }) {
  const { documents: users } = useCollection("users", [
    "teamId",
    "==",
    userDoc.teamId,
  ]);

  return (
    <UsersContext.Provider value={{ users }}>{children}</UsersContext.Provider>
  );
}
