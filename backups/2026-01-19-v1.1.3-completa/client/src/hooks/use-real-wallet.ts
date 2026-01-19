import { useContext } from "react";
import { WalletContext } from "@/lib/new-wallet-provider";

export function useRealWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useRealWallet debe ser usado dentro de un WalletProvider");
  }
  return context;
}