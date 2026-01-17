import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRefreshWallet } from '@/hooks/use-refresh-wallet';
import { useWallet } from '@/hooks/use-wallet';
import { RefreshCcw } from 'lucide-react';

interface RefreshWalletButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * Botón para actualizar manualmente la conexión del wallet
 * Útil cuando el usuario ha cambiado cuentas en su wallet y la app no se actualiza automáticamente
 */
export function RefreshWalletButton({
  variant = 'outline',
  size = 'icon',
  className = ''
}: RefreshWalletButtonProps) {
  const { isConnecting, address } = useWallet();
  const { triggerRefresh } = useRefreshWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (isRefreshing || isConnecting || !address) return;
    
    setIsRefreshing(true);
    try {
      await triggerRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!address) return null;

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleRefresh}
      disabled={isRefreshing || isConnecting}
      title="Actualizar conexión de wallet"
    >
      <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
      {size !== 'icon' && <span className="ml-2">Actualizar</span>}
    </Button>
  );
}