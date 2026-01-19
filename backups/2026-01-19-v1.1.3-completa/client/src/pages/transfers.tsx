import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { APP_NAME } from "@/utils/app-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, ArrowUpRight, CheckCircle, Coins, Copy, ExternalLink, Info, Loader, LogIn, Send, ShieldAlert, Wallet } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useLanguage } from "@/context/language-context";
import { transfersTranslations } from "@/translations/transfers";

// Validation schema for ETH/Matic transfers
const transferETHSchema = z.object({
  toAddress: z.string()
    .min(42, "Address must be 42 characters long with 0x prefix")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid ETH address"),
  amount: z.string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number"
    }),
  network: z.enum(["ethereum", "polygon"]),
});

// Validation schema for ERC20 token transfers
const transferTokenSchema = z.object({
  toAddress: z.string()
    .min(42, "Address must be 42 characters long with 0x prefix")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid ETH address"),
  tokenAddress: z.string()
    .min(42, "Address must be 42 characters long with 0x prefix")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid token address"),
  amount: z.string()
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Amount must be a positive number"
    }),
  network: z.enum(["ethereum", "polygon"]),
});

// Validation schema for NFT transfers
const transferNFTSchema = z.object({
  toAddress: z.string()
    .min(42, "Address must be 42 characters long with 0x prefix")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid ETH address"),
  nftAddress: z.string()
    .min(42, "Address must be 42 characters long with 0x prefix")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid NFT address"),
  tokenId: z.string().min(1, "Token ID is required"),
  network: z.enum(["ethereum", "polygon"]),
});

// Type for native balance (ETH/MATIC)
interface NativeBalance {
  symbol: string;
  balance: string;
  rawBalance: string;
  decimals: number;
}

// Type for ERC20 token balance
interface TokenBalance {
  symbol: string;
  address: string;
  balance: string;
  rawBalance: string;
  decimals: number;
  error?: boolean;
}

// Type for balances object
interface Balances {
  nativeBalance: NativeBalance;
  tokenBalances: TokenBalance[];
  // Added for authentication information support
  auth?: {
    authenticated: boolean;
    readOnly: boolean;
  };
}

// Type for transfer history
interface Transfer {
  id: number;
  from_address: string;
  to_address: string;
  amount: string;
  tx_hash: string;
  network: string;
  asset_type: 'NATIVE' | 'ERC20' | 'NFT';
  asset_address: string | null;
  token_id: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED';
  created_at: string;
}

// Main transfers page
const TransfersPage: React.FC = () => {
  const { account, setIsModalOpen } = useWallet();
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("crypto");
  const [selectedSubTab, setSelectedSubTab] = useState("eth");
  const [selectedNetwork, setSelectedNetwork] = useState<"ethereum" | "polygon">("ethereum");
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { language } = useLanguage();
  
  // Función de traducción para los textos de la página
  const t = (key: keyof typeof transfersTranslations.es): string => {
    return transfersTranslations[language]?.[key] || transfersTranslations.en[key];
  };

  // Check if user is connected
  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border border-destructive bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <ShieldAlert className="mr-2 h-5 w-5 text-destructive" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>You must connect your {APP_NAME} wallet to access this section.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Query balances - with read-only mode support
  const { data: balances, isLoading: isLoadingBalances, refetch: refetchBalances } = useQuery<Balances>({
    queryKey: ['/api/transfers', account, 'balances', selectedNetwork, sessionToken],
    queryFn: async () => {
      if (!account) {
        return { 
          nativeBalance: { symbol: "", balance: "0", rawBalance: "0", decimals: 18 }, 
          tokenBalances: [],
          auth: { authenticated: false, readOnly: true }
        };
      }
      
      // Try to obtain the token from different sources if we don't have it
      let token = sessionToken;
      if (!token) {
        // 1. Try to get it from localStorage
        token = localStorage.getItem('sessionToken');
        if (token) {
          setSessionToken(token);
          console.log("Token obtained from localStorage during balance query");
        } 
        // 2. Try to get it from the global instance
        else if (window.walletInstance && window.walletInstance.sessionToken) {
          token = window.walletInstance.sessionToken;
          localStorage.setItem('sessionToken', token);
          setSessionToken(token);
          console.log("Token obtained from window.walletInstance during balance query");
        }
      }
      
      // Use the new direct route that bypasses session token requirement
      let url = `/api/transfers/${account}/balances?network=${selectedNetwork}`;
      
      console.log("Querying balances with connected wallet authentication");
      
      try {
        const response = await apiRequest('GET', url);
        console.log("Balances obtained:", response);
        
        // If we don't receive authentication information from the server, add it
        if (!response.auth) {
          response.auth = {
            authenticated: !!token,
            readOnly: !token
          };
        }
        
        return response;
      } catch (error) {
        console.error("Error querying balances:", error);
        
        // In case of error, return a valid object with empty balances
        return { 
          nativeBalance: { 
            symbol: selectedNetwork === "ethereum" ? "ETH" : "MATIC", 
            balance: "0", 
            rawBalance: "0", 
            decimals: 18 
          }, 
          tokenBalances: [],
          auth: { authenticated: false, readOnly: true }
        };
      }
    },
    enabled: !!account,
  });

  // Query transfer history (custodial transfers)
  const { data: transferHistory, isLoading: isLoadingHistory } = useQuery<{ transfers: Transfer[] }>({
    queryKey: ['/api/transfers', account, 'history', sessionToken],
    queryFn: async () => {
      if (!account) return { transfers: [] };
      
      // Try to obtain the token from different sources if we don't have it
      let token = sessionToken;
      if (!token) {
        // 1. Try to get it from localStorage
        token = localStorage.getItem('sessionToken');
        if (token) {
          setSessionToken(token);
          console.log("Token obtained from localStorage during history query");
        } 
        // 2. Try to get it from the global instance
        else if (window.walletInstance && window.walletInstance.sessionToken) {
          token = window.walletInstance.sessionToken;
          localStorage.setItem('sessionToken', token);
          setSessionToken(token);
          console.log("Token obtained from window.walletInstance during history query");
        }
      }
      
      if (!token) {
        console.warn("No session token found for history query");
        return { transfers: [] };
      }
      
      const response = await apiRequest(
        'GET', 
        `/api/transfers/${account}/history?sessionToken=${encodeURIComponent(token)}`
      );
      return response;
    },
    enabled: !!account,
  });

  // Query external wallet transfer history
  const { data: externalTransfers, isLoading: externalTransfersLoading } = useQuery({
    queryKey: ['/api/wallet-transfers', account, 'history'],
    queryFn: () => apiRequest('GET', `/api/wallet-transfers/${account}/history`),
    enabled: !!account,
  });

  // Formulario para transferencia de ETH nativo
  const ethForm = useForm<z.infer<typeof transferETHSchema>>({
    resolver: zodResolver(transferETHSchema),
    defaultValues: {
      toAddress: "",
      amount: "",
      network: selectedNetwork,
    },
  });

  // Formulario para transferencia de tokens ERC20
  const tokenForm = useForm<z.infer<typeof transferTokenSchema>>({
    resolver: zodResolver(transferTokenSchema),
    defaultValues: {
      toAddress: "",
      tokenAddress: "",
      amount: "",
      network: selectedNetwork,
    },
  });

  // Formulario para transferencia de NFTs
  const nftForm = useForm<z.infer<typeof transferNFTSchema>>({
    resolver: zodResolver(transferNFTSchema),
    defaultValues: {
      toAddress: "",
      nftAddress: "",
      tokenId: "",
      network: selectedNetwork,
    },
  });

  // Helper function to get the session token from all possible sources
  const getSessionTokenFromAllSources = () => {
    // 1. Use the token we already have in the state if it exists
    let token = sessionToken;
    if (token) {
      console.log("Using existing token from component state");
      return token;
    }
    
    // 2. Try to get it from sessionStorage
    token = sessionStorage.getItem('sessionToken');
    if (token) {
      console.log("Token retrieved from sessionStorage:", token.substring(0, 10) + "...");
      return token;
    }
    
    // 3. Try to get it from localStorage
    token = localStorage.getItem('sessionToken');
    if (token) {
      console.log("Token retrieved from localStorage:", token.substring(0, 10) + "...");
      return token;
    }
    
    // 4. Get it from the global wallet instance
    if (window.walletInstance) {
      if (window.walletInstance.sessionToken) {
        token = window.walletInstance.sessionToken;
        console.log("Token retrieved from window.walletInstance:", token.substring(0, 10) + "...");
        return token;
      }
    }
    
    // 5. Try to get it from alternative format in localStorage
    token = localStorage.getItem('waybank_session_token');
    if (token) {
      console.log("Token retrieved from waybank_session_token:", token.substring(0, 10) + "...");
      return token;
    }
    
    // 6. Look in cookies (if possible from the client)
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith('sessionToken=')) {
        token = cookie.substring('sessionToken='.length, cookie.length);
        console.log("Token retrieved from cookie:", token.substring(0, 10) + "...");
        return token;
      }
      if (cookie.startsWith('custodialSession=')) {
        token = cookie.substring('custodialSession='.length, cookie.length);
        console.log("Token retrieved from cookie custodialSession:", token.substring(0, 10) + "...");
        return token;
      }
    }
    
    console.warn("No session token found in any source");
    return null;
  };

  // Function to record transfer in database
  const recordTransfer = async (transferData: {
    txHash: string;
    fromAddress: string;
    toAddress: string;
    amount: string;
    network: string;
    transferType: 'NATIVE' | 'ERC20' | 'ERC721';
    assetSymbol: string;
    assetAddress?: string;
    tokenId?: string;
    walletType?: string;
  }) => {
    try {
      await apiRequest('POST', '/api/wallet-transfers/record', {
        ...transferData,
        chainId: transferData.network === 'ethereum' ? 1 : 137,
        assetDecimals: transferData.transferType === 'NATIVE' ? 18 : undefined,
        detectionMethod: 'user_initiated',
        sourceApplication: 'waybank_transfers'
      });
      console.log('✅ Transfer recorded in database:', transferData.txHash);
    } catch (error) {
      console.error('❌ Error recording transfer:', error);
      // Don't throw error to avoid breaking the transfer flow
    }
  };

  // Mutation for ETH transfer
  const ethTransferMutation = useMutation({
    mutationFn: async (values: z.infer<typeof transferETHSchema>) => {
      if (!account) throw new Error('No wallet address');
      
      // Try backend first to validate the transaction
      try {
        const backendResponse = await apiRequest(
          'POST',
          `/api/transfers/${account}/send-eth`,
          values
        );
        
        // If backend says to use wallet signature
        if (backendResponse.requiresWalletSignature) {
          // Use Web3 directly to send the transaction
          if (!window.ethereum) {
            throw new Error('Web3 wallet not found. Please install MetaMask or Coinbase Wallet.');
          }
          
          const amount = values.amount;
          const toAddress = values.toAddress;
          
          // Convert amount to hex (Wei)
          const amountInWei = (parseFloat(amount) * Math.pow(10, 18)).toString(16);
          
          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              from: account,
              to: toAddress,
              value: '0x' + amountInWei,
            }],
          });
          
          // Record the transfer in our database
          await recordTransfer({
            txHash,
            fromAddress: account,
            toAddress: toAddress,
            amount: amount,
            network: values.network,
            transferType: 'NATIVE',
            assetSymbol: values.network === 'ethereum' ? 'ETH' : 'MATIC',
            walletType: 'external'
          });
          
          return {
            success: true,
            txHash: txHash,
            fromAddress: account,
            toAddress: toAddress,
            amount: amount,
            network: values.network
          };
        }
        
        return backendResponse;
      } catch (error) {
        // If backend validation fails, still try direct wallet transfer
        if (!window.ethereum) {
          throw new Error('Web3 wallet not found. Please install MetaMask or Coinbase Wallet.');
        }
        
        const amount = values.amount;
        const toAddress = values.toAddress;
        
        // Convert amount to hex (Wei)
        const amountInWei = (parseFloat(amount) * Math.pow(10, 18)).toString(16);
        
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: account,
            to: toAddress,
            value: '0x' + amountInWei,
          }],
        });
        
        return {
          success: true,
          txHash: txHash,
          fromAddress: account,
          toAddress: toAddress,
          amount: amount,
          network: values.network
        };
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Transfer sent",
        description: `Transaction sent: ${data.txHash}`,
      });
      ethForm.reset();
      refetchBalances();
    },
    onError: (error: any) => {
      toast({
        title: "Transfer error",
        description: error.message || "Could not complete the transfer",
        variant: "destructive",
      });
    }
  });

  // Mutation for token transfer
  const tokenTransferMutation = useMutation({
    mutationFn: async (values: z.infer<typeof transferTokenSchema>) => {
      if (!account) throw new Error('No wallet address');
      
      // Get token from all possible sources
      const token = getSessionTokenFromAllSources();
      
      if (!token) throw new Error('No session token for transfer. Please verify your wallet connection.');
      
      // Save the token for future use if we didn't have it
      if (!sessionToken) {
        setSessionToken(token);
        localStorage.setItem('sessionToken', token);
        sessionStorage.setItem('sessionToken', token);
        
        // Set in the global instance if it exists
        if (window.walletInstance) {
          window.walletInstance.sessionToken = token;
        }
      }
      
      return await apiRequest(
        'POST',
        `/api/transfers/${account}/send-token?sessionToken=${encodeURIComponent(token)}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        title: "Token sent",
        description: `Transaction sent: ${data.txHash}`,
      });
      tokenForm.reset();
      refetchBalances();
    },
    onError: (error: any) => {
      toast({
        title: "Transfer error",
        description: error.message || "Could not send the token",
        variant: "destructive",
      });
    }
  });

  // Mutation for NFT transfer
  const nftTransferMutation = useMutation({
    mutationFn: async (values: z.infer<typeof transferNFTSchema>) => {
      if (!account) throw new Error('No wallet address');
      
      // Get token from all possible sources
      const token = getSessionTokenFromAllSources();
      
      if (!token) throw new Error('No session token for transfer. Please verify your wallet connection.');
      
      // Save the token for future use if we didn't have it
      if (!sessionToken) {
        setSessionToken(token);
        localStorage.setItem('sessionToken', token);
        sessionStorage.setItem('sessionToken', token);
        
        // Set in the global instance if it exists
        if (window.walletInstance) {
          window.walletInstance.sessionToken = token;
        }
      }
      
      return await apiRequest(
        'POST',
        `/api/transfers/${account}/send-nft?sessionToken=${encodeURIComponent(token)}`,
        values
      );
    },
    onSuccess: (data) => {
      toast({
        title: "NFT sent",
        description: `Transaction sent: ${data.txHash}`,
      });
      nftForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Transfer error",
        description: error.message || "Could not send the NFT",
        variant: "destructive",
      });
    }
  });

  // Get the sessionToken from localStorage when the component mounts
  useEffect(() => {
    // Helper function to retrieve the token from all possible sources
    const getSessionTokenFromAllSources = () => {
      // 1. Try to get it from sessionStorage first
      let token = sessionStorage.getItem('sessionToken');
      if (token) {
        console.log("Session token retrieved from sessionStorage:", token.substring(0, 10) + "...");
        return token;
      }
      
      // 2. Try to get it from localStorage
      token = localStorage.getItem('sessionToken');
      if (token) {
        console.log("Session token retrieved from localStorage:", token.substring(0, 10) + "...");
        return token;
      }
      
      // 3. Get it from the global wallet instance
      if (window.walletInstance) {
        if (window.walletInstance.sessionToken) {
          token = window.walletInstance.sessionToken;
          console.log("Session token retrieved from window.walletInstance:", token.substring(0, 10) + "...");
          return token;
        }
      }
      
      // 4. Try to get it from alternative format in localStorage
      token = localStorage.getItem('waybank_session_token');
      if (token) {
        console.log("Session token retrieved from waybank_session_token:", token.substring(0, 10) + "...");
        return token;
      }
      
      // 5. Look in cookies (if possible from the client)
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('sessionToken=')) {
          token = cookie.substring('sessionToken='.length, cookie.length);
          console.log("Session token retrieved from cookie:", token.substring(0, 10) + "...");
          return token;
        }
        if (cookie.startsWith('custodialSession=')) {
          token = cookie.substring('custodialSession='.length, cookie.length);
          console.log("Session token retrieved from cookie custodialSession:", token.substring(0, 10) + "...");
          return token;
        }
      }
      
      console.warn("No session token found in any source");
      return null;
    };
    
    // Get token from all possible sources
    const token = getSessionTokenFromAllSources();
    
    if (token) {
      // Save the token in all necessary locations
      setSessionToken(token);
      localStorage.setItem('sessionToken', token);
      sessionStorage.setItem('sessionToken', token);
      
      // Try to set in the global instance if it exists
      if (window.walletInstance) {
        window.walletInstance.sessionToken = token;
      }
      
      // Refresh balances
      if (account) {
        setTimeout(() => {
          refetchBalances();
        }, 100);
      }
    } else {
      console.warn("Could not find a valid session token");
      
      // Check the wallet instance
      if (window.walletInstance && window.walletInstance.isCustodial) {
        console.log("Custodial Wallet detected but without valid session token");
        
        // Refresh balances to at least show read-only mode
        setTimeout(() => {
          refetchBalances();
        }, 100);
      }
    }
  }, [account]);
  
  // Update the network value in the forms when it changes
  useEffect(() => {
    ethForm.setValue("network", selectedNetwork);
    tokenForm.setValue("network", selectedNetwork);
    nftForm.setValue("network", selectedNetwork);
  }, [selectedNetwork]);

  // Helper function to format addresses
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Function to copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The information has been copied",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
            <p className="text-muted-foreground">
              {t('description').replace('{APP_NAME}', APP_NAME)}
            </p>
          </div>
          
          {/* Read-only mode indicator, visible when there's no valid token */}
          {balances?.auth?.readOnly && (
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="py-1 px-3 border-amber-500 text-amber-500 flex gap-1 items-center">
                <Info size={14} className="mr-1" />
                <span>{t('readOnlyMode')}</span>
              </Badge>
            </div>
          )}
        </div>
        
        {/* Alert for read-only mode */}
        {balances?.auth?.readOnly && (
          <Alert className="mt-4 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle>{t('limitedFunctionality')}</AlertTitle>
            <AlertDescription className="flex flex-col">
              <span>
                {t('noActiveSession')}
              </span>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main panel */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="crypto" className="flex items-center">
                <Coins className="mr-2 h-4 w-4" />
                {t('cryptocurrencies')}
              </TabsTrigger>
              <TabsTrigger value="nfts" className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                {t('nfts')}
              </TabsTrigger>
            </TabsList>

            {/* Cryptocurrency content */}
            <TabsContent value="crypto">
              <Card className="border-slate-800 bg-slate-950 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Send className="mr-2 h-5 w-5 text-primary" />
                      {t('sendCryptocurrencies')}
                    </span>
                    <Select value={selectedNetwork} onValueChange={(value: "ethereum" | "polygon") => setSelectedNetwork(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('selectNetwork')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                  <CardDescription>
                    {t('transferDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedSubTab} onValueChange={setSelectedSubTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="eth">{t('ethMatic')}</TabsTrigger>
                      <TabsTrigger value="tokens">{t('erc20Tokens')}</TabsTrigger>
                    </TabsList>

                    {/* ETH/MATIC transfer tab */}
                    <TabsContent value="eth">
                      <Form {...ethForm}>
                        <form onSubmit={ethForm.handleSubmit(data => ethTransferMutation.mutate(data))} className="space-y-6">
                          <FormField
                            control={ethForm.control}
                            name="toAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('destinationAddress')}</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="0x..." 
                                    {...field} 
                                    className="font-mono text-sm"
                                  />
                                </FormControl>
                                <FormDescription>
                                  {t('addressDescription')}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={ethForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('amount')}</FormLabel>
                                <FormControl>
                                  <div className="flex items-center">
                                    <Input 
                                      type="text"
                                      placeholder="0.0" 
                                      {...field} 
                                      className="font-mono"
                                    />
                                    <span className="ml-2 font-semibold">
                                      {selectedNetwork === "ethereum" ? "ETH" : "MATIC"}
                                    </span>
                                  </div>
                                </FormControl>
                                <FormDescription className="flex justify-between">
                                  <span>{t('amountDescription')}</span>
                                  {balances && (
                                    <span 
                                      className="text-primary cursor-pointer" 
                                      onClick={() => {
                                        ethForm.setValue("amount", balances.nativeBalance.balance);
                                      }}
                                    >
                                      {t('useMax')}: {balances.nativeBalance.balance} {balances.nativeBalance.symbol}
                                    </span>
                                  )}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Alert className="bg-amber-950/30 border-amber-500/50">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <AlertTitle className="text-amber-500">{t('importantVerification')}</AlertTitle>
                            <AlertDescription>
                              {t('verificationDescription')}
                            </AlertDescription>
                          </Alert>

                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={ethTransferMutation.isPending || !balances || balances?.auth?.readOnly}
                          >
                            {ethTransferMutation.isPending ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                {t('sending')}
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                {t('send')} {selectedNetwork === "ethereum" ? "ETH" : "MATIC"}
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>

                    {/* Tab de transferencia de tokens ERC20 */}
                    <TabsContent value="tokens">
                      <Form {...tokenForm}>
                        <form onSubmit={tokenForm.handleSubmit(data => tokenTransferMutation.mutate(data))} className="space-y-6">
                          <FormField
                            control={tokenForm.control}
                            name="toAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('destinationAddress')}</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="0x..." 
                                    {...field} 
                                    className="font-mono text-sm"
                                  />
                                </FormControl>
                                <FormDescription>
                                  {t('addressDescription')}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={tokenForm.control}
                            name="tokenAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('tokenAddress')}</FormLabel>
                                <FormControl>
                                  <div className="flex">
                                    <Input 
                                      placeholder="0x..." 
                                      {...field} 
                                      className="font-mono text-sm"
                                    />
                                    <Select 
                                      onValueChange={(value) => {
                                        if (value && value !== "custom") {
                                          const token = balances?.tokenBalances.find(t => t.address === value);
                                          if (token) {
                                            tokenForm.setValue("tokenAddress", token.address);
                                          }
                                        }
                                      }}
                                    >
                                      <SelectTrigger className="w-[120px] ml-2">
                                        <SelectValue placeholder={t('selectNetwork')} />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="custom">{t('custom')}</SelectItem>
                                        {balances?.tokenBalances.map((token) => (
                                          <SelectItem key={token.address} value={token.address}>
                                            {token.symbol}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </FormControl>
                                <FormDescription>
                                  {t('tokenAddressDescription')}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={tokenForm.control}
                            name="amount"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('tokenAmount')}</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="text"
                                    placeholder="0.0" 
                                    {...field} 
                                    className="font-mono"
                                  />
                                </FormControl>
                                <FormDescription>
                                  {t('tokenAmountDescription')}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Alert className="bg-amber-950/30 border-amber-500/50">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <AlertTitle className="text-amber-500">{t('importantVerification')}</AlertTitle>
                            <AlertDescription>
                              {t('verificationDescription')}
                            </AlertDescription>
                          </Alert>

                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={tokenTransferMutation.isPending || balances?.auth?.readOnly}
                          >
                            {tokenTransferMutation.isPending ? (
                              <>
                                <Loader className="mr-2 h-4 w-4 animate-spin" />
                                {t('sending')}
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                {t('sendTokens')}
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contenido de NFTs */}
            <TabsContent value="nfts">
              <Card className="border-slate-800 bg-slate-950 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Send className="mr-2 h-5 w-5 text-primary" />
                      {t('sendNFTs')}
                    </span>
                    <Select value={selectedNetwork} onValueChange={(value: "ethereum" | "polygon") => setSelectedNetwork(value)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('selectNetwork')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardTitle>
                  <CardDescription>
                    {t('nftTransferDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...nftForm}>
                    <form onSubmit={nftForm.handleSubmit(data => nftTransferMutation.mutate(data))} className="space-y-6">
                      <FormField
                        control={nftForm.control}
                        name="toAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('destinationAddress')}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="0x..." 
                                {...field} 
                                className="font-mono text-sm"
                              />
                            </FormControl>
                            <FormDescription>
                              {t('addressDescription')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={nftForm.control}
                        name="nftAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('nftContractAddress')}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="0x..." 
                                {...field} 
                                className="font-mono text-sm"
                              />
                            </FormControl>
                            <FormDescription>
                              {t('nftContractAddressDescription')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={nftForm.control}
                        name="tokenId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('tokenId')}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="1234" 
                                {...field} 
                                className="font-mono"
                              />
                            </FormControl>
                            <FormDescription>
                              {t('tokenIdDescription')}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Alert className="bg-amber-950/30 border-amber-500/50">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <AlertTitle className="text-amber-500">{t('importantVerification')}</AlertTitle>
                        <AlertDescription>
                          {t('nftVerificationDescription')}
                        </AlertDescription>
                      </Alert>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={nftTransferMutation.isPending || balances?.auth?.readOnly}
                      >
                        {nftTransferMutation.isPending ? (
                          <>
                            <Loader className="mr-2 h-4 w-4 animate-spin" />
                            {t('sending')}
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            {t('sendNft')}
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Saldos */}
          <Card className="border-slate-800 bg-slate-950 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                {t('wallet')} {APP_NAME}
              </CardTitle>
              <CardDescription>
                <span className="flex items-center">
                  {formatAddress(account)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 ml-1"
                    onClick={() => copyToClipboard(account)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  {selectedNetwork === "ethereum" ? t('ethBalance') : t('maticBalance')}
                </Label>
                {isLoadingBalances ? (
                  <Skeleton className="h-8 w-full" />
                ) : (
                  <div className="font-bold text-xl flex items-center">
                    {balances ? balances.nativeBalance.balance : "0.0"}
                    <span className="ml-2 text-lg text-muted-foreground">
                      {balances ? balances.nativeBalance.symbol : selectedNetwork === "ethereum" ? "ETH" : "MATIC"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 ml-auto"
                      onClick={() => refetchBalances()}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">
                  {t('erc20TokensLabel')}
                </Label>
                {isLoadingBalances ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : balances && balances.tokenBalances.length > 0 ? (
                  <div className="space-y-3">
                    {balances.tokenBalances.map((token) => (
                      <div key={token.address} className="flex items-center justify-between">
                        <div className="font-medium">{token.symbol}</div>
                        <div className="font-mono">{token.balance}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm italic">
                    {t('noTokensFound')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Historial de Transferencias */}
          <Card className="border-slate-800 bg-slate-950 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Coins className="mr-2 h-5 w-5 text-primary" />
                {t('transferHistory')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingHistory ? (
                <div className="space-y-3">
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              ) : transferHistory && transferHistory.transfers.length > 0 ? (
                <div className="space-y-3">
                  {transferHistory.transfers.slice(0, 5).map((transfer) => (
                    <div key={transfer.id} className="border border-slate-800 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <Badge variant={transfer.status === 'CONFIRMED' ? 'default' : transfer.status === 'PENDING' ? 'outline' : 'destructive'}>
                            {transfer.status === 'CONFIRMED' ? t('completed') : 
                              transfer.status === 'PENDING' ? t('pending') : 
                              t('failed')}
                          </Badge>
                          <span className="ml-2 text-muted-foreground text-xs">
                            {new Date(transfer.created_at).toLocaleString()}
                          </span>
                        </div>
                        <a 
                          href={`https://${transfer.network === 'ethereum' ? 'etherscan.io' : 'polygonscan.com'}/tx/${transfer.tx_hash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary flex items-center text-xs hover:underline"
                        >
                          {t('viewOnBlockExplorer')} <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                      <div className="mt-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('to')}:</span>
                          <span className="font-mono">{formatAddress(transfer.to_address)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t('amount')}:</span>
                          <span>{transfer.amount} {transfer.asset_type}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    {t('noTransfers')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransfersPage;