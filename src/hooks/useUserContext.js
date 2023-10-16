import { useContext } from "react";
import { UserDocContext } from "../contexts/UserDocContext";

export const useUserContext = () => {
  const context = useContext(UserDocContext);
  if (!context) {
    throw Error("useUserContext must be inside an UserDocProvider.");
  }

  return context;
};
