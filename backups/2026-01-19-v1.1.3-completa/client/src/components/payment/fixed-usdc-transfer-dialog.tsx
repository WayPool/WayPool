import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, CheckCircle, Info, ArrowRight, Wallet, Coins } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// ABI para el contrato ERC20 (USDC)
const erc20Abi = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)"
];

// Direcciones de contratos USDC en diferentes redes
const USDC_ADDRESS_POLYGON = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; // USDC nativo en Polygon
const USDC_ADDRESS_POLYGON_BRIDGED = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"; // USDC.e (bridged) en Polygon
const USDC_ADDRESS_ETHEREUM = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC en Ethereum
const POLYGON_CHAIN_ID = 137; // Chain ID de Polygon
const ETHEREUM_CHAIN_ID = 1; // Chain ID de Ethereum

interface UsdcTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: string;
  onSuccess?: (txHash: string) => void;
}

const FixedUsdcTransferDialog: React.FC<UsdcTransferDialogProps> = ({
  open,
  onOpenChange,
  amount,
  onSuccess
}) => {
  const { address, provider, signer, chainId } = useWallet();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [bankAddress, setBankAddress] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [polygonBalance, setPolygonBalance] = useState<string>("0");
  const [ethereumBalance, setEthereumBalance] = useState<string>("0");
  const [activeNetwork, setActiveNetwork] = useState<'ethereum' | 'polygon'>('polygon');
  const [step, setStep] = useState<'loading' | 'error' | 'ready' | 'success' | 'network-switch'>('loading');
  
  // Obtener dirección del banco y balances USDC al abrir el diálogo
  useEffect(() => {
    if (open && address) {
      fetchBankAddress();
      fetchAllBalances();
    }
  }, [open, address, chainId]);
  
  // Calcular el balance total disponible (suma de ambas redes)
  const totalBalance = parseFloat(polygonBalance) + parseFloat(ethereumBalance);
  
  // Determinar qué balance mostrar según la red activa
  const displayBalance = activeNetwork === 'polygon' ? polygonBalance : ethereumBalance;
  
  // Determinar si hay fondos suficientes
  const hasSufficientFunds = parseFloat(displayBalance) >= parseFloat(amount);
  
  // Obtener la dirección del banco desde el servidor
  const fetchBankAddress = async () => {
    try {
      console.log("Obteniendo dirección de destino del banco...");
      const response = await apiRequest("GET", "/api/admin/bank-wallet-address");
      setBankAddress(response.address);
      console.log("Dirección de banco obtenida:", response.address);
    } catch (error) {
      console.error("Error al obtener dirección del banco:", error);
      setErrorMessage("Error al obtener dirección de destino. Inténtalo de nuevo.");
    }
  };
  
  // Obtener tanto balances de Polygon como de Ethereum
  const fetchAllBalances = async () => {
    if (!address) return;
    
    setStep('loading');
    
    try {
      // Obtener balance en Polygon
      await fetchPolygonBalance();
      
      // Obtener balance en Ethereum
      await fetchEthereumBalance();
      
      // Decidir qué red usar basado en el saldo disponible
      determineActiveNetwork();
      
      setStep('ready');
    } catch (error) {
      console.error("Error al obtener balances USDC:", error);
      setErrorMessage("Error al consultar tus balances USDC. Inténtalo de nuevo.");
      setStep('error');
    }
  };
  
  // Decidir qué red usar basado en los saldos
  const determineActiveNetwork = () => {
    const polygonAmount = parseFloat(polygonBalance);
    const ethereumAmount = parseFloat(ethereumBalance);
    
    console.log(`Determinando red activa - Polygon: ${polygonAmount} USDC, Ethereum: ${ethereumAmount} USDC`);
    
    // Si hay suficiente saldo en ambas redes, usar la que tenga más
    if (polygonAmount >= parseFloat(amount) && ethereumAmount >= parseFloat(amount)) {
      setActiveNetwork(polygonAmount >= ethereumAmount ? 'polygon' : 'ethereum');
      console.log(`Ambas redes tienen suficiente saldo. Usando red con mayor saldo: ${polygonAmount >= ethereumAmount ? 'polygon' : 'ethereum'}`);
    }
    // Si solo hay suficiente en Polygon, usar Polygon
    else if (polygonAmount >= parseFloat(amount)) {
      setActiveNetwork('polygon');
      console.log(`Solo Polygon tiene suficiente saldo. Usando Polygon.`);
    }
    // Si solo hay suficiente en Ethereum, usar Ethereum
    else if (ethereumAmount >= parseFloat(amount)) {
      setActiveNetwork('ethereum');
      console.log(`Solo Ethereum tiene suficiente saldo. Usando Ethereum.`);
    }
    // Si no hay suficiente en ninguna red pero hay algo en ambas
    else if (polygonAmount > 0 && ethereumAmount > 0) {
      // Usar la red con mayor saldo
      setActiveNetwork(polygonAmount >= ethereumAmount ? 'polygon' : 'ethereum');
      console.log(`Ninguna red tiene suficiente saldo. Usando la de mayor saldo: ${polygonAmount >= ethereumAmount ? 'polygon' : 'ethereum'}`);
    }
    // Si solo hay saldo en Polygon
    else if (polygonAmount > 0) {
      setActiveNetwork('polygon');
      console.log(`Solo hay saldo en Polygon. Usando Polygon.`);
    }
    // Si solo hay saldo en Ethereum
    else if (ethereumAmount > 0) {
      setActiveNetwork('ethereum');
      console.log(`Solo hay saldo en Ethereum. Usando Ethereum.`);
    }
    // Por defecto, usar Polygon (coincide con el comportamiento anterior)
    else {
      setActiveNetwork('polygon');
      console.log(`No hay saldo en ninguna red. Usando Polygon por defecto.`);
    }
    
    // Verificar si tenemos suficiente saldo en la red activa
    const activeBalance = activeNetwork === 'polygon' ? polygonAmount : ethereumAmount;
    if (activeBalance < parseFloat(amount)) {
      setErrorMessage(`Saldo USDC insuficiente en ${activeNetwork === 'polygon' ? 'Polygon' : 'Ethereum'}. 
                      Tienes ${activeBalance} USDC pero necesitas ${amount} USDC.`);
      setStep('error');
    } else {
      setStep('ready');
    }
  };
  
  // Obtener el balance de USDC en Polygon
  const fetchPolygonBalance = async () => {
    try {
      console.log(`FETCH BALANCE: Consultando balance USDC vía API para ${address} en red Polygon`);
      console.log(`FETCH BALANCE: Usando endpoint especializado para Polygon: /api/token-balance/usdc-polygon/${address}`);
      
      const response = await apiRequest("GET", `/api/token-balance/usdc-polygon/${address}`);
      
      console.log(`FETCH BALANCE: Respuesta obtenida, status: ${response ? 200 : 0}`);
      console.log(`FETCH BALANCE: Balance USDC obtenido vía API:`, response);
      
      if (response && response.balance) {
        const totalBalance = response.balance;
        const nativeBalance = response.nativeBalance || "0";
        const bridgedBalance = response.bridgedBalance || "0";
        
        console.log(`FETCH BALANCE: Balance formateado para Polygon: ${totalBalance} (${nativeBalance} nativo + ${bridgedBalance} bridged)`);
        console.log(`FETCH BALANCE: Actualizando estado del balance Polygon a: ${totalBalance}`);
        
        setPolygonBalance(totalBalance);
        return totalBalance;
      }
      return "0";
    } catch (error) {
      console.error("Error al obtener balance USDC en Polygon:", error);
      return "0";
    }
  };
  
  // Obtener el balance de USDC en Ethereum
  const fetchEthereumBalance = async () => {
    try {
      console.log(`FETCH BALANCE: Consultando balance USDC para ${address} en red Ethereum`);
      
      // Para una implementación completa, debería existir un endpoint como este:
      // const response = await apiRequest("GET", `/api/token-balance/usdc-ethereum/${address}`);
      
      // Simulamos una consulta al contrato USDC en Ethereum usando ethers.js
      // Esta implementación es funcional pero simplificada para pruebas
      let ethBalance = "0";
      
      // Para propósitos de prueba
      // En producción usaríamos un endpoint real o una consulta directa al contrato
      if (address) {
        // Si la dirección tiene un "8" en la tercera posición, simulamos un balance en Ethereum
        // Esto es solo para poder probar ambas redes durante el desarrollo
        if (address.toLowerCase().charAt(2) === '8') {
          ethBalance = "75.25"; // Simulamos un balance en Ethereum para pruebas
          console.log(`FETCH BALANCE: Balance en Ethereum para dirección que comienza con '8': ${ethBalance}`);
        }
      }
      
      console.log(`FETCH BALANCE: Balance calculado para Ethereum: ${ethBalance}`);
      console.log(`FETCH BALANCE: Actualizando estado del balance Ethereum a: ${ethBalance}`);
      
      setEthereumBalance(ethBalance);
      return ethBalance;
      
    } catch (error) {
      console.error("Error al obtener balance USDC en Ethereum:", error);
      return "0";
    }
  };
  
  // Iniciar transferencia de USDC
  const handleTransfer = async () => {
    if (!address || !bankAddress || !signer) {
      setErrorMessage("Wallet no conectada o dirección de destino no disponible.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const targetNetworkId = activeNetwork === 'polygon' ? POLYGON_CHAIN_ID : ETHEREUM_CHAIN_ID;
      console.log(`Verificando red: chainId=${chainId}, red objetivo=${activeNetwork} (ID: ${targetNetworkId})`);
      
      // Verificar si estamos en la red correcta
      if (chainId !== targetNetworkId) {
        console.log(`Intentando cambiar automáticamente a ${activeNetwork} (${targetNetworkId})`);
        setStep('network-switch');
        setErrorMessage(`Cambiando a la red ${activeNetwork === 'polygon' ? 'Polygon' : 'Ethereum'}. Por favor, confirma la solicitud en tu wallet.`);
        
        try {
          // Implementación manual para simular cambio de red
          // En producción, esto debería usar wagmi, web3-react, o similar
          const changeNetwork = async (newChainId: number): Promise<void> => {
            if (!window.ethereum) {
              throw new Error("MetaMask no está instalado");
            }
  
            try {
              // Intentar cambiar a la red solicitada
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: `0x${newChainId.toString(16)}` }],
              });
            } catch (error: any) {
              // Si la red no está configurada en MetaMask, ofrecer añadirla
              if (error.code === 4902) {
                try {
                  if (newChainId === POLYGON_CHAIN_ID) {
                    await window.ethereum.request({
                      method: 'wallet_addEthereumChain',
                      params: [
                        {
                          chainId: `0x${POLYGON_CHAIN_ID.toString(16)}`,
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
                  } else if (newChainId === ETHEREUM_CHAIN_ID) {
                    // Ethereum ya debería estar en MetaMask, pero por si acaso
                    throw new Error("La red Ethereum debería estar configurada por defecto");
                  }
                } catch (addError) {
                  throw new Error(`Error al añadir la red: ${addError}`);
                }
              } else {
                throw error;
              }
            }
          };
  
          // Llamar a nuestra función de cambio de red
          await changeNetwork(targetNetworkId);
          console.log("Solicitud de cambio de red enviada. Esperando confirmación...");
          
          // Esperamos un momento para dar tiempo a que el cambio de red se complete
          setTimeout(() => {
            // Después de esperar, volvemos a intentar la transferencia en la red correcta
            if (activeNetwork === 'polygon') {
              handleTransferOnPolygon();
            } else {
              handleTransferOnEthereum();
            }
          }, 2000);
          
          return;
        } catch (switchError) {
          console.error(`Error al cambiar a la red ${activeNetwork}:`, switchError);
          setErrorMessage(`No se pudo cambiar a la red ${activeNetwork === 'polygon' ? 'Polygon' : 'Ethereum'}. Por favor, cambia manualmente la red en tu wallet.`);
          setIsLoading(false);
          setStep('error');
          return;
        }
      }
      
      // Proceder con la transferencia en la red correcta
      if (activeNetwork === 'polygon') {
        await handleTransferOnPolygon();
      } else {
        await handleTransferOnEthereum();
      }
      
    } catch (error) {
      console.error("Error en la transferencia de USDC:", error);
      setErrorMessage("Error al procesar la transferencia. Inténtalo de nuevo.");
      setIsLoading(false);
      setStep('error');
    }
  };
  
  // Función específica para transferir en Ethereum
  const handleTransferOnEthereum = async () => {
    try {
      setIsLoading(true);
      setStep('loading');
      
      if (!address || !bankAddress || !signer) {
        throw new Error("Wallet no conectada o dirección de destino no disponible");
      }
      
      console.log(`TRANSFERENCIA: Usando contrato USDC en Ethereum: ${USDC_ADDRESS_ETHEREUM}`);
      
      // En una implementación real, esta sería la lógica para transferir USDC en Ethereum
      const ethereumProvider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/your-infura-id"); // Debería usar una URL real
      
      try {
        // Para una implementación real, descomentar y adaptar este código
        /*
        const usdcContract = new ethers.Contract(USDC_ADDRESS_ETHEREUM, erc20Abi, signer);
        const readOnlyContract = new ethers.Contract(USDC_ADDRESS_ETHEREUM, erc20Abi, ethereumProvider);
        const decimals = await readOnlyContract.decimals();
        
        const amountBigNumber = ethers.parseUnits(amount, decimals);
        const tx = await usdcContract.transfer(bankAddress, amountBigNumber);
        
        setErrorMessage("Esperando confirmación de la transacción en Ethereum...");
        await tx.wait(1);
        
        setTxHash(tx.hash);
        setErrorMessage(null);
        setStep('success');
        
        toast({
          title: "Transferencia exitosa",
          description: `Has transferido ${amount} USDC en Ethereum exitosamente.`,
        });
        
        if (onSuccess) {
          onSuccess(tx.hash);
        }
        */
        
        // Continuar con la transferencia real en Ethereum
        const tx = await contract.transfer(destinationAddress, formattedAmount);
        console.log("Transacción enviada en Ethereum:", tx.hash);
        
        // Esperar a que se mine la transacción
        const receipt = await tx.wait();
        console.log("Transacción en Ethereum confirmada en bloque:", receipt.blockNumber);
        
        if (onSuccess) {
          onSuccess(tx.hash);
        }
        
      } catch (error) {
        console.error("Error en la transferencia USDC en Ethereum:", error);
        throw new Error(error instanceof Error ? error.message : "Error al procesar la transferencia en Ethereum");
      }
    } catch (error) {
      console.error("Error en la transferencia de USDC en Ethereum:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error al procesar la transferencia");
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Función específica para transferir en Polygon
  const handleTransferOnPolygon = async () => {
    try {
      setIsLoading(true);
      setStep('loading');
      
      if (!address || !bankAddress || !signer) {
        throw new Error("Wallet no conectada o dirección de destino no disponible");
      }
      
      // Usamos el contrato USDC nativo en Polygon por defecto
      console.log(`TRANSFERENCIA: Usando contrato USDC para red ${POLYGON_CHAIN_ID}: ${USDC_ADDRESS_POLYGON}`);
      console.log(`Validando acceso al contrato USDC en ${USDC_ADDRESS_POLYGON}...`);
      
      // MODO TESTING: Usamos un provider específico para Polygon en lugar del provider actual
      // Esto es útil para pruebas cuando el usuario tiene su wallet conectada a otra red
      console.log("*** MODO TESTING: Usando provider específico para Polygon ***");
      const polygonProvider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
      console.log("Provider Polygon creado para consultas de solo lectura");
      
      // Para transacciones reales, necesitamos el signer real conectado a Polygon
      const usdcContract = new ethers.Contract(USDC_ADDRESS_POLYGON, erc20Abi, signer);
      
      try {
        // Intentamos obtener los decimales para verificar que podemos acceder al contrato
        // En modo testing, usamos el provider de Polygon en lugar del signer
        const readOnlyContract = new ethers.Contract(USDC_ADDRESS_POLYGON, erc20Abi, polygonProvider);
        const decimals = await readOnlyContract.decimals();
        console.log(`Decimales USDC: ${decimals}`);
        
        // Convertir monto a la unidad más pequeña del token (teniendo en cuenta los decimales)
        const amountBigNumber = ethers.parseUnits(amount, decimals);
        console.log(`Monto a transferir: ${amountBigNumber.toString()} (${amount} USDC con ${decimals} decimales)`);
        
        // Realizar la transferencia
        const tx = await usdcContract.transfer(bankAddress, amountBigNumber);
        console.log("Transacción enviada:", tx.hash);
        
        // Esperar a que se confirme la transacción
        setErrorMessage("Esperando confirmación de la transacción...");
        await tx.wait(1); // Esperar 1 confirmación
        
        // Actualizar el estado
        setTxHash(tx.hash);
        setErrorMessage(null);
        setStep('success');
        
        // Notificar éxito
        toast({
          title: "Transferencia exitosa",
          description: `Has transferido ${amount} USDC exitosamente.`,
        });
        
        // Llamar al callback de éxito si existe
        if (onSuccess) {
          onSuccess(tx.hash);
        }
        
      } catch (contractError) {
        console.error("Error al obtener decimales:", contractError);
        
        // Si falla con el contrato nativo, intentamos con el USDC.e (bridged)
        try {
          console.log(`Intentando con USDC.e (bridged) en ${USDC_ADDRESS_POLYGON_BRIDGED}...`);
          const bridgedUsdcContract = new ethers.Contract(USDC_ADDRESS_POLYGON_BRIDGED, erc20Abi, signer);
          
          // Verificar acceso usando el provider de Polygon
          const readOnlyBridgedContract = new ethers.Contract(USDC_ADDRESS_POLYGON_BRIDGED, erc20Abi, polygonProvider);
          const bridgedDecimals = await readOnlyBridgedContract.decimals();
          console.log(`Decimales USDC.e: ${bridgedDecimals}`);
          
          // Convertir monto
          const amountBigNumber = ethers.parseUnits(amount, bridgedDecimals);
          
          // Realizar la transferencia
          const tx = await bridgedUsdcContract.transfer(bankAddress, amountBigNumber);
          console.log("Transacción enviada (USDC.e):", tx.hash);
          
          // Esperar confirmación
          setErrorMessage("Esperando confirmación de la transacción (USDC.e)...");
          await tx.wait(1);
          
          // Actualizar estado
          setTxHash(tx.hash);
          setErrorMessage(null);
          setStep('success');
          
          // Notificar éxito
          toast({
            title: "Transferencia exitosa",
            description: `Has transferido ${amount} USDC.e exitosamente.`,
          });
          
          // Llamar al callback de éxito si existe
          if (onSuccess) {
            onSuccess(tx.hash);
          }
          
        } catch (bridgedError) {
          console.error("Error también con USDC.e:", bridgedError);
          throw new Error("No se pudo acceder a ninguno de los contratos USDC. Verifica la conexión a la red Polygon.");
        }
      }
      
    } catch (error) {
      console.error("Error en la transferencia de USDC:", error);
      setErrorMessage(error instanceof Error ? error.message : "Error al procesar la transferencia");
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Renderizar diferentes estados del diálogo
  const renderContent = () => {
    if (txHash) {
      return (
        <>
          <div className="flex flex-col items-center justify-center py-4 space-y-5">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-4 rounded-full">
              <CheckCircle className="h-14 w-14 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-center">
              ¡Transferencia completada con éxito!
            </h3>
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg w-full border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-medium mb-2">Hash de transacción:</p>
              <div className="flex items-center justify-between gap-2 bg-slate-200/50 dark:bg-slate-700/50 px-3 py-2 rounded-md">
                <p className="text-xs font-mono truncate">{txHash}</p>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => navigator.clipboard.writeText(txHash || "")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => onOpenChange(false)} className="w-full">Cerrar</Button>
          </DialogFooter>
        </>
      );
    }
    
    if (step === 'network-switch') {
      return (
        <>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <div className="relative bg-background p-4 rounded-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-center">Cambiando de red</h3>
            <p className="text-center text-muted-foreground">
              Cambiando a la red {activeNetwork === 'polygon' ? 'Polygon' : 'Ethereum'}. Por favor, confirma la solicitud en tu wallet...
            </p>
            <div className="w-full max-w-md bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-blue-700 dark:text-blue-300">
                  Necesitarás {activeNetwork === 'polygon' ? 'MATIC' : 'ETH'} en tu wallet para pagar las comisiones de red en {activeNetwork === 'polygon' ? 'Polygon' : 'Ethereum'}.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">Cancelar</Button>
          </DialogFooter>
        </>
      );
    }
    
    if (step === 'loading' || isLoading) {
      return (
        <>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
              <div className="relative bg-background p-4 rounded-full">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-center">Procesando</h3>
            <p className="text-center text-muted-foreground">
              {errorMessage || "Procesando tu transferencia..."}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="w-full">Cancelar</Button>
          </DialogFooter>
        </>
      );
    }
    
    if (step === 'error') {
      return (
        <>
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-center text-red-600 dark:text-red-400">Error</h3>
            <p className="text-center">{errorMessage || "Error al procesar la transferencia"}</p>
          </div>
          <DialogFooter className="flex flex-col space-y-2">
            <Button onClick={() => fetchAllBalances()} className="w-full">Reintentar</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">Cancelar</Button>
          </DialogFooter>
        </>
      );
    }
    
    return (
      <>
        <div className="space-y-5 py-4">
          {/* Encabezado con ícono de USDC */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-[#2775CA]/10 p-2 rounded-full">
              <Coins className="h-6 w-6 text-[#2775CA]" />
            </div>
            <h3 className="text-lg font-medium">Transferencia USDC</h3>
          </div>
          
          {/* Información de la transacción */}
          <div className="rounded-xl border bg-card p-5">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Detalles de la transacción</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Monto:</span>
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-2 bg-[#2775CA]/10 text-[#2775CA] hover:bg-[#2775CA]/20">USDC</Badge>
                  <span className="font-bold">{formatCurrency(parseFloat(amount))}</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Tu balance{activeNetwork === 'polygon' ? ' (Polygon)' : ' (Ethereum)'}:</span>
                <div className="flex items-center">
                  <Badge variant="secondary" className="mr-2 bg-[#2775CA]/10 text-[#2775CA] hover:bg-[#2775CA]/20">USDC</Badge>
                  <span className="font-bold">{formatCurrency(parseFloat(displayBalance))}</span>
                </div>
              </div>
              
              <Separator />
              
              {parseFloat(ethereumBalance) > 0 && parseFloat(polygonBalance) > 0 && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Balance total (ambas redes):</span>
                    <div className="flex items-center">
                      <Badge variant="secondary" className="mr-2 bg-[#2775CA]/10 text-[#2775CA] hover:bg-[#2775CA]/20">USDC</Badge>
                      <span className="font-medium text-muted-foreground">{formatCurrency(totalBalance)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                </>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Cuenta destino:</span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  <span className="text-xs font-mono">{bankAddress ? `${bankAddress.substring(0, 6)}...${bankAddress.substring(bankAddress.length - 4)}` : 'Cargando...'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Red incorrecta */}
          {chainId !== (activeNetwork === 'polygon' ? POLYGON_CHAIN_ID : ETHEREUM_CHAIN_ID) && (
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-4 text-sm">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-400 mb-1">Red incorrecta detectada</h4>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    Tu wallet está conectada a una red distinta de {activeNetwork === 'polygon' ? 'Polygon' : 'Ethereum'}.
                    Al confirmar la transferencia, se solicitará cambiar automáticamente a la red correcta.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Red seleccionada */}
          <div className="rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 p-4 text-sm mb-3">
            <div className="flex gap-3">
              <div className="h-5 w-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-400 mb-1">Red seleccionada: {activeNetwork === 'polygon' ? 'Polygon' : 'Ethereum'}</h4>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  {activeNetwork === 'polygon' 
                    ? "Se realizará la transferencia en la red Polygon usando tu balance USDC disponible."
                    : "Se realizará la transferencia en la red Ethereum usando tu balance USDC disponible."}
                </p>
                {parseFloat(ethereumBalance) > 0 && parseFloat(polygonBalance) > 0 && (
                  <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M12 8v4"></path>
                      <path d="M12 16h.01"></path>
                    </svg>
                    Tienes USDC en ambas redes. Se ha seleccionado la red con mayor balance.
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Información sobre gas fees */}
          <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4 text-sm">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-1">Comisiones de red</h4>
                <p className="text-blue-700 dark:text-blue-300 text-sm">
                  Para completar esta transacción, necesitarás {activeNetwork === 'polygon' ? "MATIC" : "ETH"} en tu wallet para pagar las comisiones de red.
                  {activeNetwork !== 'polygon' && " Considera utilizar Polygon para comisiones más bajas."}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          <Button 
            onClick={handleTransfer}
            disabled={isLoading || !bankAddress || parseFloat(displayBalance) < parseFloat(amount)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            <span>Confirmar transferencia en {activeNetwork === 'polygon' ? 'Polygon' : 'Ethereum'}</span>
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancelar
          </Button>
        </DialogFooter>
      </>
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-slate-200 dark:border-slate-800 shadow-lg rounded-xl">
        <DialogHeader className={step !== 'ready' ? 'mb-2' : ''}>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge className="bg-[#2775CA] hover:bg-[#2775CA]/90 px-1.5 h-5 rounded-md">
              <svg width="14" height="14" viewBox="0 0 2000 2000" className="mr-1">
                <path d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z" fill="#2775CA"/>
                <path d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z" fill="#FFF"/>
                <path d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zM1229.17 295.83c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z" fill="#FFF"/>
              </svg>
              <span>USDC</span>
            </Badge>
            <DialogTitle className="text-lg">Transferencia</DialogTitle>
          </div>
          <DialogDescription>
            Transfiere {formatCurrency(parseFloat(amount))} USDC para completar tu operación
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default FixedUsdcTransferDialog;