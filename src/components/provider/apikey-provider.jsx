"use client"
import { useContext, createContext, useState } from "react";

const APIKeyContext = createContext();

export function APIKeyProvider({ children }) {
  const [apiKey, setApiKey] = useState({
    key: "",
    promot: ""
  });
  return (
    <APIKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </APIKeyContext.Provider>
  );
}

export const useAPIKey = () => useContext(APIKeyContext);
