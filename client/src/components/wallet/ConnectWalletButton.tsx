import React from 'react';
import { Button } from '@/components/ui/button';
import { useWeb3React } from '@/hooks/use-web3-react';

// Icono básico de wallet para el botón
const WalletIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 12V8H6a2 2 0 0 1 0-4h12v4" />
    <path d="M20 12v4H6a2 2 0 0 0 0 4h12v-4" />
    <path d="M20 8v4h-2a2 2 0 1 1 0-4h2z" />
  </svg>
);
import { MobileWalletSelector } from './MobileWalletSelector';
import { isMobile } from '@/lib/utils';

interface ConnectWalletButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

/**
 * Botón inteligente para conectar wallet adaptado para móviles y desktop
 * Detecta automáticamente el dispositivo y muestra las opciones adecuadas
 */
export function ConnectWalletButton({ 
  className = "", 
  variant = "default",
  size = "default"
}: ConnectWalletButtonProps) {
  const { active, account, deactivate, setIsModalOpen } = useWeb3React();
  
  // Formato para mostrar dirección de wallet abreviada
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Si ya está conectado, mostramos la dirección y opción de desconectar
  if (active && account) {
    return (
      <Button
        variant="outline"
        className={`flex items-center ${className}`}
        onClick={deactivate}
        size={size}
      >
        <span className="mr-2">{formatAddress(account)}</span>
        <WalletIcon className="h-4 w-4" />
      </Button>
    );
  }
  
  // Si no está conectado, mostrar botón para abrir el modal
  return (
    <>
      <Button
        variant={variant}
        className={`${className}`}
        onClick={() => setIsModalOpen(true)}
        size={size}
      >
        {isMobile() ? 'Conectar Wallet' : 'Conectar Wallet'}
      </Button>
      
      {/* Modal de selección optimizado para móvil */}
      <MobileWalletSelector />
    </>
  );
}