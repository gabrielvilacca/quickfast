import React from "react";
import Settings from "@/assets/Settings.gif";

export default function Reports() {
  return (
    <div className="flex items-center justify-center h-[700px]">
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-3xl">Em breve..</h1>
        <img src={Settings} alt="Settings" />
      </div>
    </div>
  );
}
