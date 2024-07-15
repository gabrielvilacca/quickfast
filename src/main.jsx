import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./contexts/AuthContext";
import { UserDocProvider } from "./contexts/UserDocContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthContextProvider>
    <UserDocProvider>
      <App />
    </UserDocProvider>
  </AuthContextProvider>
);
