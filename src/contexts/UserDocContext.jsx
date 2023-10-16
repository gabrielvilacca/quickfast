import { createContext } from "react";
import { useDocument } from "@/hooks/useDocument";

export const UserDocContext = createContext();

export function UserDocProvider({ children, user }) {
  const { document: userDoc } = useDocument("users", user.uid);

  return (
    <UserDocContext.Provider value={{ userDoc }}>
      {children}
    </UserDocContext.Provider>
  );
}
