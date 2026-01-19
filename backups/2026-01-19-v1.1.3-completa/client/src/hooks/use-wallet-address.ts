import { useWallet, WAYBANK_WALLET_ADDRESS_KEY } from "@/hooks/use-wallet";

export function useWalletAddress() {
  const { account, getCurrentWalletAddress } = useWallet();
  
  // Obtener la dirección de wallet, con prioridad:
  // 1. De account (dirección actual conectada)
  // 2. De la función getCurrentWalletAddress (que consulta localStorage)
  const walletAddress = account || getCurrentWalletAddress();
  
  return { walletAddress };
}