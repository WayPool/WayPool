/**
 * WBC Token Hook
 *
 * Provides functions to interact with the WBC Token contract on Polygon
 * - Check balance
 * - Return tokens to owner (for fee collection / position close)
 */

import { useCallback, useState } from 'react';
import { useAccount, usePublicClient, useWalletClient, useSwitchChain } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { parseUnits, formatUnits, type Address } from 'viem';

// WBC Token Contract on Polygon
const WBC_CONTRACT_ADDRESS = '0xf79e7330eF4DA9C567B8811845Ce9b0B75064456' as const;
const WBC_OWNER_ADDRESS = '0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F' as const;

// WBC Token ABI (only the functions we need)
const WBC_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
  {
    name: 'returnToOwner',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amount', type: 'uint256' },
      { name: 'positionId', type: 'uint256' },
      { name: 'reason', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'owner',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'address' }],
  },
] as const;

export interface WBCBalanceResult {
  balance: number;
  balanceRaw: bigint;
  formatted: string;
}

export interface WBCReturnResult {
  success: boolean;
  txHash?: string;
  error?: string;
  blockNumber?: number;
}

export function useWBCToken() {
  const { address, isConnected, chain } = useAccount();
  const publicClient = usePublicClient({ chainId: polygon.id });
  const { data: walletClient } = useWalletClient({ chainId: polygon.id });
  const { switchChain } = useSwitchChain();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Check if user is on Polygon network
   */
  const isOnPolygon = chain?.id === polygon.id;

  /**
   * Switch to Polygon network
   */
  const switchToPolygon = useCallback(async () => {
    try {
      await switchChain({ chainId: polygon.id });
      return true;
    } catch (err) {
      console.error('Failed to switch to Polygon:', err);
      return false;
    }
  }, [switchChain]);

  /**
   * Get WBC balance for connected wallet
   */
  const getBalance = useCallback(async (): Promise<WBCBalanceResult | null> => {
    if (!address || !publicClient) {
      return null;
    }

    try {
      const balance = await publicClient.readContract({
        address: WBC_CONTRACT_ADDRESS,
        abi: WBC_ABI,
        functionName: 'balanceOf',
        args: [address],
      });

      const balanceNumber = parseFloat(formatUnits(balance, 6));

      return {
        balance: balanceNumber,
        balanceRaw: balance,
        formatted: balanceNumber.toLocaleString('es-ES', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }),
      };
    } catch (err) {
      console.error('Failed to get WBC balance:', err);
      return null;
    }
  }, [address, publicClient]);

  /**
   * Check if user has enough WBC for an operation
   */
  const hasEnoughBalance = useCallback(async (requiredAmount: number): Promise<boolean> => {
    const balanceResult = await getBalance();
    if (!balanceResult) return false;
    return balanceResult.balance >= requiredAmount;
  }, [getBalance]);

  /**
   * Return WBC tokens to owner (for fee collection or position close)
   * @param amount Amount in USDC/WBC (e.g., 100.50)
   * @param positionId Position ID for tracking
   * @param reason Reason: 'fee_collection' or 'position_close'
   */
  const returnToOwner = useCallback(async (
    amount: number,
    positionId: number,
    reason: 'fee_collection' | 'position_close'
  ): Promise<WBCReturnResult> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!address || !walletClient || !publicClient) {
        throw new Error('Wallet not connected');
      }

      // Check if on Polygon
      if (!isOnPolygon) {
        const switched = await switchToPolygon();
        if (!switched) {
          throw new Error('Please switch to Polygon network');
        }
      }

      // Check balance first
      const balanceResult = await getBalance();
      if (!balanceResult || balanceResult.balance < amount) {
        throw new Error(`Insufficient WBC balance. You have ${balanceResult?.formatted || '0'} WBC, need ${amount} WBC`);
      }

      // Convert amount to contract units (6 decimals)
      const amountInUnits = parseUnits(amount.toFixed(6), 6);

      console.log(`[WBC] Returning ${amount} WBC to owner for position ${positionId} (${reason})`);

      // Call returnToOwner on the contract
      const hash = await walletClient.writeContract({
        address: WBC_CONTRACT_ADDRESS,
        abi: WBC_ABI,
        functionName: 'returnToOwner',
        args: [amountInUnits, BigInt(positionId), reason],
      });

      console.log(`[WBC] Transaction sent: ${hash}`);

      // Wait for confirmation
      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1,
      });

      console.log(`[WBC] Transaction confirmed in block ${receipt.blockNumber}`);

      setIsLoading(false);
      return {
        success: true,
        txHash: hash,
        blockNumber: Number(receipt.blockNumber),
      };

    } catch (err: any) {
      console.error('[WBC] Return failed:', err);
      const errorMessage = err.message || 'Unknown error';
      setError(errorMessage);
      setIsLoading(false);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [address, walletClient, publicClient, isOnPolygon, switchToPolygon, getBalance]);

  /**
   * Simple transfer to owner (alternative method)
   */
  const transferToOwner = useCallback(async (
    amount: number
  ): Promise<WBCReturnResult> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!address || !walletClient || !publicClient) {
        throw new Error('Wallet not connected');
      }

      if (!isOnPolygon) {
        const switched = await switchToPolygon();
        if (!switched) {
          throw new Error('Please switch to Polygon network');
        }
      }

      const amountInUnits = parseUnits(amount.toFixed(6), 6);

      const hash = await walletClient.writeContract({
        address: WBC_CONTRACT_ADDRESS,
        abi: WBC_ABI,
        functionName: 'transfer',
        args: [WBC_OWNER_ADDRESS, amountInUnits],
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash,
        confirmations: 1,
      });

      setIsLoading(false);
      return {
        success: true,
        txHash: hash,
        blockNumber: Number(receipt.blockNumber),
      };

    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error';
      setError(errorMessage);
      setIsLoading(false);
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [address, walletClient, publicClient, isOnPolygon, switchToPolygon]);

  return {
    // State
    isConnected,
    address,
    isOnPolygon,
    isLoading,
    error,

    // Contract info
    contractAddress: WBC_CONTRACT_ADDRESS,
    ownerAddress: WBC_OWNER_ADDRESS,

    // Functions
    getBalance,
    hasEnoughBalance,
    returnToOwner,
    transferToOwner,
    switchToPolygon,
  };
}
