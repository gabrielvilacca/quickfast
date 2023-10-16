import { useContext } from "react";
import { SubscriptionContext } from "@/contexts/SubscriptionContext";

export const useSubscriptionContext = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw Error(
      "useSubscriptionContext must be inside an SubscriptionProvider."
    );
  }

  return context;
};
