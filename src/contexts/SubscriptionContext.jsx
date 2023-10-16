import { createContext } from "react";
import { useDocument } from "@/hooks/useDocument";

export const SubscriptionContext = createContext();

export function SubscriptionProvider({ children, user }) {
  const { document: subscriptionDoc } = useDocument("subscriptions", user.uid);

  return (
    <SubscriptionContext.Provider value={{ subscriptionDoc }}>
      {children}
    </SubscriptionContext.Provider>
  );
}
