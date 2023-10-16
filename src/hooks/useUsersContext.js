import { useContext } from "react";
import { UsersContext } from "../contexts/UsersContext";

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw Error("useUsersContext must be inside an UsersProvider.");
  }

  return context;
};
