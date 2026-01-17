import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '@/hooks/use-wallet';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

// Direcciones de USDC en diferentes redes
const USDC_ADDRESSES = {
  // Ethereum
  '1': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  // Polygon - Actualizado para usar USDC nativo en lugar de USDC.e
  '137': '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', // USDC Nativo en Polygon
  // Base
  '8453': '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  // Optimism
  '10': '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
  // Arbitrum
  '42161': '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
};

// ABI mínimo para transferir tokens ERC20 (implementación más robusta)
const TOKEN_ABI = [
  "function transfer(address to, uint amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function balanceOf(address owner) view returns (uint256)"
];

interface UsdcTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount?: string;
  onSuccess?: (txHash: string) => void;
}

export default function UsdcTransferDialog({ 
  open, 
  onOpenChange, 
  amount = '', 
  onSuccess 
}: UsdcTransferDialogProps) {
  const { toast } = useToast();
  const { provider, chainId, address, signer } = useWallet();
  
  const [transferAmount, setTransferAmount] = useState(amount);
  const [isProcessing, setIsProcessing] = useState(false);
  const [balance, setBalance] = useState('0.00');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState<'1' | '137'>('137'); // Default to Polygon

  // Obtener el balance de USDC del usuario
  const fetchUsdcBalance = useCallback(async () => {
    if (!address) return;
    
    // Usar la red seleccionada por el usuario en lugar de la red actual de la wallet
    const networkId = selectedNetwork;
    const usdcAddress = USDC_ADDRESSES[networkId];
    
    if (!usdcAddress) {
      setErrorMessage(`USDC no disponible en la red seleccionada`);
      return;
    }
    
    setBalance('Cargando...');
    setErrorMessage('');
    
    try {
      // Usar la API del servidor para obtener el balance
      console.log(`FETCH BALANCE: Consultando balance USDC vía API para ${address} en red ${networkId === '1' ? 'Ethereum' : 'Polygon'}`);
      
      let response;
      let endpoint = '';
      
      if (networkId === '137') {
        // Para Polygon, usar el endpoint especializado
        endpoint = `/api/token-balance/usdc-polygon/${address}`;
        console.log(`FETCH BALANCE: Usando endpoint especializado para Polygon: ${endpoint}`);
        response = await fetch(endpoint);
      } else {
        // Para Ethereum, usar el endpoint estándar
        endpoint = `/api/token-balance/usdc/${address}?network=${networkId}`;
        console.log(`FETCH BALANCE: Usando endpoint estándar para Ethereum: ${endpoint}`);
        response = await fetch(endpoint);
      }
      
      console.log(`FETCH BALANCE: Respuesta obtenida, status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`FETCH BALANCE: Error en la respuesta: ${errorText}`);
        throw new Error(`Error al obtener balance USDC: ${errorText}`);
      }
      
      const data = await response.json();
      
      console.log(`FETCH BALANCE: Balance USDC obtenido vía API:`, data);
      
      // Manejar tanto el formato para USDC regular como para USDC en Polygon
      let formattedBalance;
      
      if (networkId === '137') {
        // Para Polygon, el balance está en data.balance
        formattedBalance = data.balance;
        console.log(`FETCH BALANCE: Balance formateado para Polygon: ${formattedBalance} (${data.nativeBalance} nativo + ${data.bridgedBalance} bridged)`);
      } else {
        // Para Ethereum, el balance está en data.balance
        formattedBalance = data.balance;
        console.log(`FETCH BALANCE: Balance formateado para Ethereum: ${formattedBalance}`);
      }
      
      console.log(`FETCH BALANCE: Actualizando estado del balance a: ${formattedBalance}`);
      setBalance(formattedBalance);
      
      // Limpiar cualquier mensaje de error previo
      setErrorMessage('');
    } catch (error: any) {
      console.error('Error al obtener el balance de USDC:', error);
      setErrorMessage('No se pudo obtener el balance de USDC en la red seleccionada. Intenta cambiar de red.');
    }
  }, [address, selectedNetwork]);

  // Este efecto maneja el cambio del prop amount
  useEffect(() => {
    if (amount) {
      setTransferAmount(amount);
      console.log("Actualizando monto a transferir:", amount);
    }
  }, [amount]);
  
  // Este efecto maneja la apertura del diálogo y los cambios de red
  useEffect(() => {
    // Si el diálogo está abierto, iniciamos la carga de datos necesarios
    if (open) {
      console.log("Diálogo abierto: Cargando datos necesarios");
      
      // Obtener la dirección de destino desde el servidor
      const fetchDestinationAddress = async () => {
        try {
          console.log("Obteniendo dirección de destino del banco...");
          const response = await fetch('/api/admin/bank-wallet-address');
          if (response.ok) {
            const data = await response.json();
            console.log("Dirección de banco obtenida:", data.address);
            setDestinationAddress(data.address);
          } else {
            console.error('Error al obtener la dirección de destino:', await response.text());
            setErrorMessage('No se pudo obtener la dirección de destino para la transferencia.');
          }
        } catch (error) {
          console.error('Error al obtener la dirección de destino:', error);
          setErrorMessage('Error de conexión al servidor.');
        }
      };
      
      // Ejecutar las funciones de carga
      fetchDestinationAddress();
      
      if (address && provider) {
        console.log("Wallet conectada, obteniendo balance USDC...");
        fetchUsdcBalance();
      } else {
        console.log("No hay wallet conectada o proveedor disponible");
      }
    } else {
      console.log("Diálogo cerrado, no se obtienen datos");
    }
  }, [open, selectedNetwork, provider, address, fetchUsdcBalance]);

  // Función para enviar la transferencia de USDC
  const handleTransfer = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      setErrorMessage('Por favor, ingresa un monto válido mayor a 0 USDC.');
      return;
    }

    if (!destinationAddress) {
      setErrorMessage('No se ha podido obtener la dirección de destino.');
      return;
    }

    if (!address || !signer) {
      setErrorMessage('No hay una wallet conectada o no hay acceso al firmante.');
      return;
    }
    
    // Usar la red seleccionada por el usuario
    const networkId = selectedNetwork;
    const usdcAddress = USDC_ADDRESSES[networkId];
    
    if (!usdcAddress) {
      setErrorMessage(`USDC no disponible en la red seleccionada`);
      return;
    }
    
    // Verificar si la red seleccionada coincide con la red actual de la wallet
    console.log(`Verificando red: chainId=${chainId} (${typeof chainId}), networkId=${networkId}`);
    
    // Verificamos si estamos en la red correcta
    let isOnCorrectNetwork = false;
    if (chainId) {
      if (networkId === '137') {
        // Para Polygon, verificamos varios formatos de chain ID
        const chainIdStr = chainId.toString();
        isOnCorrectNetwork = 
          chainIdStr === '137' || 
          chainIdStr === '0x89' || 
          chainIdStr.toLowerCase() === '0x89';
      } else if (networkId === '1') {
        // Para Ethereum
        isOnCorrectNetwork = chainId.toString() === '1' || chainId.toString() === '0x1';
      }
    }
    
    if (!isOnCorrectNetwork) {
      // En este punto sabemos que la red de la wallet no coincide con la seleccionada
      console.log(`Red incorrecta: ChainId=${chainId}, necesitamos ${networkId}`);
      
      // Intentar cambiar automáticamente a la red correcta
      try {
        // Convertir networkId a número
        const targetChainId = parseInt(networkId);
        
        // Cambiar red usando window.ethereum directamente (MetaMask API)
        if (window.ethereum) {
          console.log(`Intentando cambiar automáticamente a la red: ${networkId}`);
          
          try {
            // Intentar cambiar a la red solicitada
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${targetChainId.toString(16)}` }],
            });
            
            console.log(`Cambio de red solicitado a: ${networkId}`);
            
            // Mostramos un mensaje optimista y esperamos que el cambio de red se complete
            setErrorMessage(`Cambiando a la red ${networkId === '1' ? 'Ethereum' : 'Polygon'}. Por favor, confirma la solicitud en tu wallet.`);
            
            // Esperamos un momento para dar tiempo a que el cambio de red se complete
            setTimeout(() => fetchUsdcBalance(), 2000);
            return;
          } catch (switchError: any) {
            // Si la red no está configurada en MetaMask, ofrecer añadirla
            if (switchError.code === 4902) {
              try {
                if (targetChainId === 137) { // Polygon
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: `0x${targetChainId.toString(16)}`,
                        chainName: 'Polygon Mainnet',
                        nativeCurrency: {
                          name: 'MATIC',
                          symbol: 'MATIC',
                          decimals: 18,
                        },
                        rpcUrls: ['https://polygon-rpc.com/'],
                        blockExplorerUrls: ['https://polygonscan.com/'],
                      },
                    ],
                  });
                  
                  setErrorMessage("Red Polygon agregada. Inténtalo de nuevo.");
                  setTimeout(() => fetchUsdcBalance(), 2000);
                  return;
                }
                
                throw new Error("No se pudo añadir la red automáticamente");
              } catch (addError) {
                console.error("Error al añadir la red:", addError);
                throw addError;
              }
            }
            
            throw switchError;
          }
        }
      } catch (error) {
        console.error("Error al intentar cambiar la red:", error);
      }
      
      // Si llegamos aquí, no se pudo cambiar automáticamente
      setErrorMessage(`IMPORTANTE: Para continuar necesitas estar conectado a la red ${networkId === '1' ? 'Ethereum' : 'Polygon'}. Por favor, cambia la red en tu wallet manualmente.`);
      return;
    } else {
      console.log(`Verificación de red exitosa: Estamos en ${networkId === '1' ? 'Ethereum' : 'Polygon'}`);
    }

    // Verificar balance antes de intentar transferir
    // Convertir los valores a números para comparar
    const numericBalance = parseFloat(balance);
    const numericTransferAmount = parseFloat(transferAmount);
    
    if (numericBalance < numericTransferAmount) {
      setErrorMessage(`Fondos insuficientes. Tu balance (${numericBalance} USDC) es menor que el monto a transferir (${numericTransferAmount} USDC).`);
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      // Asegurarse de tener un signer válido para la transacción
      if (!signer) {
        throw new Error('No se pudo acceder al firmante de la wallet');
      }
      
      // Forzar el uso de la dirección de USDC correcta para la red seleccionada
      // Esto asegura que usemos el contrato correcto sin importar los problemas de detección de red
      console.log(`TRANSFERENCIA: Usando contrato USDC para red ${networkId}: ${usdcAddress}`);
      
      // Crear una instancia del contrato del token con el ABI adecuado
      const usdcContract = new ethers.Contract(usdcAddress, TOKEN_ABI, signer);
      
      // Validar que tenemos acceso al contrato
      console.log(`Validando acceso al contrato USDC en ${usdcAddress}...`);
      
      // Intentar obtener los decimales del token (esto también valida que el contrato es accesible)
      let decimals;
      try {
        decimals = await usdcContract.decimals();
        console.log(`Decimales del token USDC: ${decimals}`);
      } catch (error) {
        console.error("Error al obtener decimales:", error);
        throw new Error("No se pudo acceder al contrato USDC. Verifica la conexión a la red seleccionada.");
      }
      
      // Verificar el balance real en el contrato antes de transferir
      let balanceInContract;
      try {
        balanceInContract = await usdcContract.balanceOf(address);
        const formattedBalance = ethers.formatUnits(balanceInContract, decimals);
        console.log(`Balance USDC en contrato: ${formattedBalance}`);
        
        // Validar que el balance en el contrato es suficiente
        if (parseFloat(formattedBalance) < numericTransferAmount) {
          throw new Error(`Fondos insuficientes en el contrato. Tu balance real (${formattedBalance} USDC) es menor que el monto a transferir (${numericTransferAmount} USDC).`);
        }
      } catch (error: any) {
        console.error("Error al verificar balance:", error);
        if (error.message && error.message.includes("Fondos insuficientes")) {
          throw error;
        }
        throw new Error("No se pudo verificar el balance en el contrato USDC.");
      }
      
      // Convertir el monto a la unidad más pequeña del token (con los decimales correctos)
      const amountInSmallestUnit = ethers.parseUnits(transferAmount, decimals);
      
      console.log(`Iniciando transferencia de ${transferAmount} USDC (${amountInSmallestUnit.toString()} unidades) a ${destinationAddress}`);
      
      // Ejecutar la transacción de transferencia
      const tx = await usdcContract.transfer(destinationAddress, amountInSmallestUnit);
      
      console.log(`Transacción enviada, hash: ${tx.hash}`);
      
      // Esperar a que la transacción sea minada
      console.log('Esperando confirmación de la transacción...');
      const receipt = await tx.wait();
      console.log(`Transacción confirmada en el bloque ${receipt.blockNumber}!`);
      
      // Actualizar el balance después de la transferencia
      fetchUsdcBalance();
      
      // Transacción exitosa
      toast({
        title: "Transferencia exitosa",
        description: `Se han transferido ${transferAmount} USDC correctamente.`,
      });
      
      if (onSuccess) {
        onSuccess(tx.hash);
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error en la transferencia de USDC:', error);
      
      let errorMsg = 'Error en la transferencia. Inténtalo de nuevo.';
      
      if (error.reason) {
        errorMsg = `Error: ${error.reason}`;
      } else if (error.message) {
        // Usar el mensaje de error directamente si ya está personalizado
        if (error.message.includes('Fondos insuficientes')) {
          errorMsg = error.message;
        }
        // Extraer mensajes de error comunes
        else if (error.message.includes('insufficient funds')) {
          errorMsg = 'Fondos insuficientes para realizar la transferencia.';
        } else if (error.message.includes('user rejected')) {
          errorMsg = 'Transacción rechazada por el usuario.';
        } else if (error.message.includes('gas')) {
          errorMsg = 'Error en el cálculo de gas. Intenta con un monto menor.';
        } else if (error.message.includes('network') || error.message.includes('chain')) {
          errorMsg = `Error de red. Asegúrate de estar conectado a ${networkId === '1' ? 'Ethereum' : 'Polygon'}.`;
        } else if (error.message.includes('No se pudo acceder al contrato')) {
          errorMsg = error.message;
        } else if (error.message.includes('No se pudo verificar el balance')) {
          errorMsg = error.message;
        }
      }
      
      setErrorMessage(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden">
        <DialogTitle className="sr-only">Confirmar pago con USDC</DialogTitle>
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-primary/80 to-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold tracking-tight">Confirmar pago con USDC</h2>
          <p className="text-white/80 mt-1">El pago se realizará directamente desde tu wallet conectada</p>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Información de la wallet */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full flex-shrink-0">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 14C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12C15.4477 12 15 12.4477 15 13C15 13.5523 15.4477 14 16 14Z" fill="currentColor"/>
                <path d="M3 10L21 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">Wallet conectada</h4>
              <div className="flex items-center mt-1">
                <div className="flex items-center px-3 py-1 bg-primary/5 dark:bg-primary/10 rounded-full text-sm font-mono text-primary">
                  {address ? address.substring(0, 6) + '...' + address.substring(address.length - 4) : '...'}
                </div>
                <div className="ml-2 text-xs px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded-full text-green-700 dark:text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                  Conectada
                </div>
              </div>
            </div>
          </div>
          
          {/* Panel de detalles de la transacción */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            {/* Cabecera del panel */}
            <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">Detalles de la transacción</h3>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Sección de balance y monto */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Monto a transferir</span>
                  <div className="text-sm flex items-center gap-1 text-slate-600 dark:text-slate-400">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    Balance ({selectedNetwork === '1' ? 'Ethereum' : 'Polygon'}): <span className="font-semibold">{balance} USDC</span>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">$</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">USDC</span>
                    </div>
                  </div>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    disabled={isProcessing}
                    min="0.01"
                    step="0.01"
                    className="pr-24 text-lg font-medium bg-white dark:bg-slate-900 focus-visible:ring-primary"
                  />
                </div>
                
                {/* Selector de red */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="font-medium">Seleccionar red</span>
                  </div>
                  
                  <RadioGroup 
                    value={selectedNetwork} 
                    onValueChange={(value) => {
                      const newNetwork = value as '1' | '137';
                      setSelectedNetwork(newNetwork);
                      // Actualizar el balance al cambiar de red
                      setTimeout(() => fetchUsdcBalance(), 100);
                    }}
                    className="flex gap-3"
                    disabled={isProcessing}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="ethereum" />
                      <Label htmlFor="ethereum" className="flex items-center gap-1.5">
                        <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                        Ethereum
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="137" id="polygon" />
                      <Label htmlFor="polygon" className="flex items-center gap-1.5">
                        <span className="w-4 h-4 bg-purple-600 rounded-full"></span>
                        Polygon
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Información de dirección de destino */}
                {destinationAddress && (
                  <div className="mt-4 space-y-1">
                    <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-medium">Dirección de destino</span>
                    </div>
                    <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded border border-dashed border-slate-300 dark:border-slate-700">
                      <code className="text-xs block truncate font-mono text-slate-600 dark:text-slate-400">
                        {destinationAddress}
                      </code>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Mensaje de error */}
              {errorMessage && (
                <div className="flex items-start gap-2 p-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 rounded-lg border border-red-200 dark:border-red-900">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V13M12 17.5V17.51M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
              
              {/* Información importante */}
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-900">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 9V12M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="text-sm space-y-1">
                  <p>Solo se aceptan pagos con USDC. Asegúrate de tener suficiente saldo de USDC en tu wallet.</p>
                  <p className="mt-1">La transacción requerirá gas en MATIC para procesarse en la blockchain Polygon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="p-6 pt-0 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleTransfer} 
            className="flex-1 gap-2"
            disabled={isProcessing || !transferAmount || parseFloat(transferAmount) <= 0}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536
                  7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829
                  12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645
                  11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645
                  3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
                <span>Confirmar transferencia</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}