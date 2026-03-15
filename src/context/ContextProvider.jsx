import React from "react";
import { AuthProvider } from "./AuthContext";
import { AppProvider } from "./AppContext";

export function ContextProvider({ children }) {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthProvider>
  );
}

export default ContextProvider;
