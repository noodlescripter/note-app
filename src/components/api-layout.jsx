import { APIKeyProvider } from "./provider/apikey-provider";

export const APIkeyLayout = ({ children }) => {
  return <APIKeyProvider>{children}</APIKeyProvider>;
};
