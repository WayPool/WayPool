import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideArrowUpDown, ChevronUp, ChevronDown, Info, ExternalLink } from "lucide-react";
import { cn } from '@/lib/utils';
import { formatCurrency, formatAPR, formatCompactNumber, formatPriceDiff } from '@/lib/formatters';

// Definición de los tipos para los props del componente
export interface PoolCardProps {
  pool: {
    id: string;
    address: string;
    name: string;
    token0Symbol: string;
    token1Symbol: string;
    tvl: number;
    volume24h: number;
    fees24h: number;
    apr: number;
    fee: string;
    network: string;
    isV4: boolean;
    hasStablecoin: boolean;
    version: string;
    feeTier?: number;
    priceRatio?: number;
    createdAt?: string;
    priceChange24h?: number;
  };
  onClick?: (poolId: string) => void;
  isSelected?: boolean;
}

export function PoolCard({ pool, onClick, isSelected = false }: PoolCardProps) {
  const { 
    id, address, name, token0Symbol, token1Symbol, tvl, 
    volume24h, fees24h, apr, fee, network, version, priceChange24h 
  } = pool;

  // Determinar la red para mostrar el ícono correcto
  const getNetworkIcon = () => {
    if (network === 'ethereum') {
      return '🔷'; // ETH
    } else if (network === 'polygon') {
      return '🟣'; // MATIC
    } else if (network === 'arbitrum') {
      return '🔵'; // ARB
    } else if (network === 'optimism') {
      return '🔴'; // OP
    } else if (network === 'base') {
      return '🔘'; // BASE
    }
    return '🔹'; // Default
  };

  // Determinar si el precio está subiendo o bajando
  const isPriceUp = priceChange24h && priceChange24h > 0;
  
  // Handler para click
  const handleClick = () => {
    if (onClick) onClick(id);
  };

  return (
    <Card 
      className={cn(
        "w-full hover:border-primary transition-all duration-200 cursor-pointer", 
        isSelected && "border-primary-500 bg-primary-50/10"
      )}
      onClick={handleClick}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getNetworkIcon()}</span>
            <CardTitle className="text-base md:text-lg">{name}</CardTitle>
            <Badge variant={version === 'V4' ? 'default' : 'outline'}>
              {version}
            </Badge>
          </div>
          <Badge variant="outline" className="bg-muted/30">
            {fee}
          </Badge>
        </div>
        <CardDescription className="flex items-center justify-between mt-2">
          <span className="text-sm">ID: {id}</span>
          {priceChange24h !== undefined && (
            <div className="flex items-center space-x-1">
              <LucideArrowUpDown className="h-3 w-3 text-muted-foreground" />
              <span className={cn(
                "flex items-center",
                isPriceUp ? "text-green-600" : "text-red-600"
              )}>
                {isPriceUp ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {formatPriceDiff(priceChange24h)}
              </span>
            </div>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">TVL</p>
            <p className="font-medium">{formatCurrency(tvl, 0)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Volumen 24h</p>
            <p className="font-medium">{formatCurrency(volume24h, 0)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs">Comisiones 24h</p>
            <p className="font-medium">{formatCurrency(fees24h, 0)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <p className="text-muted-foreground text-xs">APR</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Rendimiento anual basado en comisiones (últimos 7 días)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className={cn(
              "font-semibold",
              apr > 100 ? "text-green-600" : "text-primary"
            )}>
              {formatAPR(apr)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <span>Creado: {pool.createdAt || "Desconocido"}</span>
        <a 
          href={`https://${network === 'ethereum' ? 'etherscan.io' : 'polygonscan.com'}/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:text-primary"
          onClick={(e) => e.stopPropagation()}
        >
          Ver contrato <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      </CardFooter>
    </Card>
  );
}