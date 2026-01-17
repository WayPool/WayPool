// Definiciones de tipos para Ethereum y Web3
declare interface Window {
  ethereum: any;
  global?: any;
  process?: any;
  walletInstance?: {
    isCustodial?: boolean;
    address?: string;
    sessionToken?: string;
  };
}