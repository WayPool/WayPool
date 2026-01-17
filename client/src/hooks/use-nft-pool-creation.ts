/**
 * Hook for NFT Pool Creation
 *
 * This hook checks for pending NFT creations when the user connects their wallet
 * and provides functions to create the NFT pools through the WayPoolPositionCreator contract.
 */

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './use-wallet';
import { useToast } from './use-toast';
import {
  WAYPOOL_CREATOR_ADDRESS,
  WAYPOOL_CREATOR_ABI,
  POLYGON_TOKENS,
  ERC20_ABI,
  DEFAULT_TICK_RANGE,
} from '@/lib/waypool-position-creator';

// Polygon chain ID
const POLYGON_CHAIN_ID = 137;

interface PendingNFTCreation {
  positionId: number;
  walletAddress: string;
  valueUsdc: string;
  poolAddress?: string;
  token0?: string;
  token1?: string;
  fee?: number;
  tickLower?: number;
  tickUpper?: number;
}

interface NFTCreationState {
  isLoading: boolean;
  isCreating: boolean;
  pendingCreations: PendingNFTCreation[];
  currentCreation: PendingNFTCreation | null;
  error: string | null;
}

export function useNFTPoolCreation() {
  const { address, provider, isConnected } = useWallet();
  const { toast } = useToast();

  const [state, setState] = useState<NFTCreationState>({
    isLoading: false,
    isCreating: false,
    pendingCreations: [],
    currentCreation: null,
    error: null,
  });

  /**
   * Check for pending NFT creations for the connected wallet
   */
  const checkPendingCreations = useCallback(async () => {
    if (!address) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/nft-creation/pending/${address}`);
      const data = await response.json();

      if (data.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          pendingCreations: data.pendingCreations || [],
        }));

        // Show toast if there are pending creations
        if (data.pendingCreations?.length > 0) {
          toast({
            title: 'Posiciones pendientes de activación',
            description: `Tienes ${data.pendingCreations.length} posición(es) esperando la creación del NFT en Polygon.`,
          });
        }
      } else {
        throw new Error(data.message || 'Error checking pending creations');
      }
    } catch (error) {
      console.error('Error checking pending NFT creations:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }));
    }
  }, [address, toast]);

  /**
   * Switch to Polygon network if not already connected
   */
  const ensurePolygonNetwork = async (): Promise<boolean> => {
    if (!window.ethereum) {
      toast({
        title: 'MetaMask requerido',
        description: 'Por favor instala MetaMask para continuar.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainId, 16);

      if (currentChainId !== POLYGON_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x89' }], // 137 in hex
          });
          return true;
        } catch (switchError: any) {
          // Chain not added, try to add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x89',
                  chainName: 'Polygon Mainnet',
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18,
                  },
                  rpcUrls: ['https://polygon-rpc.com'],
                  blockExplorerUrls: ['https://polygonscan.com'],
                },
              ],
            });
            return true;
          }
          throw switchError;
        }
      }
      return true;
    } catch (error) {
      console.error('Error switching to Polygon:', error);
      toast({
        title: 'Error de red',
        description: 'No se pudo cambiar a la red Polygon.',
        variant: 'destructive',
      });
      return false;
    }
  };

  /**
   * Approve tokens for the WayPool contract (minimal amounts)
   */
  const approveTokens = async (signer: ethers.Signer): Promise<boolean> => {
    try {
      const usdc = new ethers.Contract(POLYGON_TOKENS.USDC, ERC20_ABI, signer);
      const weth = new ethers.Contract(POLYGON_TOKENS.WETH, ERC20_ABI, signer);

      const userAddress = await signer.getAddress();

      // Check current allowances
      const [usdcAllowance, wethAllowance] = await Promise.all([
        usdc.allowance(userAddress, WAYPOOL_CREATOR_ADDRESS),
        weth.allowance(userAddress, WAYPOOL_CREATOR_ADDRESS),
      ]);

      // Approve USDC if needed
      if (usdcAllowance < 1n) {
        toast({
          title: 'Aprobando USDC...',
          description: 'Por favor confirma la transacción en tu wallet.',
        });
        const tx = await usdc.approve(WAYPOOL_CREATOR_ADDRESS, 1n);
        await tx.wait();
      }

      // Approve WETH if needed
      if (wethAllowance < 1n) {
        toast({
          title: 'Aprobando WETH...',
          description: 'Por favor confirma la transacción en tu wallet.',
        });
        const tx = await weth.approve(WAYPOOL_CREATOR_ADDRESS, 1n);
        await tx.wait();
      }

      return true;
    } catch (error) {
      console.error('Error approving tokens:', error);
      return false;
    }
  };

  /**
   * Create NFT pool for a pending creation
   */
  const createNFTPool = async (creation: PendingNFTCreation): Promise<boolean> => {
    if (!provider || !address) {
      toast({
        title: 'Wallet no conectada',
        description: 'Por favor conecta tu wallet para continuar.',
        variant: 'destructive',
      });
      return false;
    }

    setState((prev) => ({ ...prev, isCreating: true, currentCreation: creation, error: null }));

    try {
      // 1. Ensure we're on Polygon
      const onPolygon = await ensurePolygonNetwork();
      if (!onPolygon) {
        throw new Error('No se pudo cambiar a Polygon');
      }

      // 2. Get signer
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await ethersProvider.getSigner();

      // 3. Approve tokens (minimal amounts - just 1 wei each)
      toast({
        title: 'Preparando transacción...',
        description: 'Verificando aprobaciones de tokens.',
      });

      const approved = await approveTokens(signer);
      if (!approved) {
        throw new Error('No se pudieron aprobar los tokens');
      }

      // 4. Create the position
      toast({
        title: 'Creando posición NFT...',
        description: 'Por favor confirma la transacción en tu wallet.',
      });

      const contract = new ethers.Contract(WAYPOOL_CREATOR_ADDRESS, WAYPOOL_CREATOR_ABI, signer);

      const tickLower = creation.tickLower || DEFAULT_TICK_RANGE.tickLower;
      const tickUpper = creation.tickUpper || DEFAULT_TICK_RANGE.tickUpper;

      const tx = await contract.createMinimalPosition(tickLower, tickUpper);

      toast({
        title: 'Transacción enviada',
        description: 'Esperando confirmación...',
      });

      const receipt = await tx.wait();

      // 5. Parse the PositionCreated event to get tokenId
      const iface = new ethers.Interface(WAYPOOL_CREATOR_ABI);
      let tokenId: string | null = null;

      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog({
            topics: log.topics,
            data: log.data,
          });
          if (parsed?.name === 'PositionCreated') {
            tokenId = parsed.args.tokenId.toString();
            break;
          }
        } catch {
          // Not our event
        }
      }

      if (!tokenId) {
        throw new Error('No se pudo obtener el ID del NFT creado');
      }

      // 6. Register the NFT in the backend
      const registerResponse = await fetch('/api/nft-creation/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          positionId: creation.positionId,
          tokenId,
          transactionHash: receipt.hash,
          walletAddress: address,
          valueUsdc: creation.valueUsdc,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerData.success) {
        throw new Error(registerData.message || 'Error registrando el NFT');
      }

      // 7. Success!
      toast({
        title: '¡NFT creado exitosamente!',
        description: `Token ID: ${tokenId}. Tu posición ha sido activada.`,
      });

      // Remove from pending list
      setState((prev) => ({
        ...prev,
        isCreating: false,
        currentCreation: null,
        pendingCreations: prev.pendingCreations.filter((p) => p.positionId !== creation.positionId),
      }));

      return true;
    } catch (error: any) {
      console.error('Error creating NFT pool:', error);

      // Report failure to backend
      try {
        await fetch('/api/nft-creation/failed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            positionId: creation.positionId,
            errorMessage: error.message || 'Error desconocido',
          }),
        });
      } catch {
        // Ignore
      }

      const errorMessage = error.reason || error.message || 'Error creando el NFT';

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      setState((prev) => ({
        ...prev,
        isCreating: false,
        currentCreation: null,
        error: errorMessage,
      }));

      return false;
    }
  };

  /**
   * Create all pending NFT pools
   */
  const createAllPendingPools = async (): Promise<void> => {
    for (const creation of state.pendingCreations) {
      const success = await createNFTPool(creation);
      if (!success) {
        break; // Stop on first failure
      }
    }
  };

  // Check for pending creations when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      checkPendingCreations();
    }
  }, [isConnected, address, checkPendingCreations]);

  return {
    ...state,
    checkPendingCreations,
    createNFTPool,
    createAllPendingPools,
    hasPendingCreations: state.pendingCreations.length > 0,
  };
}

export default useNFTPoolCreation;
