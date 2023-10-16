import { useSubscriptionContext } from "@/hooks/useSubscriptionContext";
import React from "react";

export default function Home() {
  const { subscriptionDoc } = useSubscriptionContext();

  console.log(subscriptionDoc);
  return (
    <div className="px-5 py-4 sm:p-8">
      <h1 className="text-xl font-medium">Home</h1>
    </div>
  );
}
