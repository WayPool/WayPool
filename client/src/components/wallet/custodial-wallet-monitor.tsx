import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/use-wallet';
import CustodialWalletSession from './custodial-wallet-session';
import { detectWalletType } from '@/lib/wallet-detector';
import { APP_NAME } from '@/utils/app-config';

/**
 * Componente para monitorear el estado de la wallet custodiada
 * Este componente detecta si el tipo de wallet actual es una wallet custodiada
 * y aplica el componente de gestión de sesión correspondiente
 */
export default function CustodialWalletMonitor() {
  const { address } = useWallet();
  const [walletType, setWalletType] = useState<string>('');
  
  // Detectar el tipo de wallet cuando cambia la dirección
  useEffect(() => {
    if (address) {
      const type = detectWalletType();
      console.log('[CustodialWalletMonitor] Tipo de wallet detectado:', type);
      setWalletType(type);
      
      // Si es una billetera custodiada, también almacenamos esta información
      if (type === `${APP_NAME} Wallet`) {
        localStorage.setItem('isCustodialWallet', 'true');
      } else {
        localStorage.removeItem('isCustodialWallet');
      }
    } else {
      setWalletType('');
    }
  }, [address]);
  
  // Almacenamos la dirección en localStorage para que pueda ser usada por el proveedor de consultas
  useEffect(() => {
    if (address) {
      localStorage.setItem('walletAddress', address);
    } else {
      localStorage.removeItem('walletAddress');
    }
  }, [address]);
  
  // No renderizamos nada visible, solo monitoreamos la wallet
  return (
    <CustodialWalletSession 
      walletAddress={address} 
      walletType={walletType}
    />
  );
}