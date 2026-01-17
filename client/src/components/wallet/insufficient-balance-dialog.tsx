import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  ArrowRightIcon, 
  WalletIcon, 
  AlertCircleIcon, 
  CircleDollarSignIcon, 
  BarChartIcon, 
  RefreshCcwIcon, 
  ShieldAlertIcon,
  CoinsIcon,
  ExternalLinkIcon,
  WalletCards,
  ReceiptTextIcon,
  CopyIcon,
  CheckCircle2Icon,
  XCircleIcon,
  NetworkIcon
} from "lucide-react";
import { formatCurrency } from "@/lib/ethereum";

interface InsufficientBalanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenSymbol: string;
  amount: string;
  balance?: string;
}

export const InsufficientBalanceDialog: React.FC<InsufficientBalanceDialogProps> = ({
  open,
  onOpenChange,
  tokenSymbol,
  amount,
  balance = "0",
}) => {
  const [copied, setCopied] = React.useState(false);
  
  // Diferencia que necesita ser transferida
  const requiredAmount = Math.max(0, parseFloat(amount) - parseFloat(balance));
  const transactionHash = "0x0D8c379a000000000000000000000000";
  
  // Función para copiar al portapapeles
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-gradient-to-b from-[#0F172A] to-[#060D19] border border-indigo-900/20 shadow-[0_0_25px_rgba(99,102,241,0.2)] text-white max-w-md overflow-hidden rounded-2xl p-0">
        {/* Hexagon pattern background */}
        <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NiIgaGVpZ2h0PSI0OCI+CjxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wLDAgTDEyLDAgTDE0LDIgTDE0LDggTDEyLDEwIEwwLDEwIEwyLDUgeiBNMiwxNSBMMCwxMCBMMTIsMTAgTDE0LDEyIEwxNCwxOCBMMTIsMjAgTDAsMjAgTDIsMTUgeiBNMiwyNSBMMCwyMCBMMTIsMjAgTDE0LDIyIEwxNCwyOCBMMTIsMzAgTDAsMzAgTDIsMjUgeiBNMiw1IEwwLDAgTDAsNSB6IE0yLDE1IEwwLDEwIEwwLDE1IHogTTIsMjUgTDAsMjAgTDAsMjUgeg0KTTQsMCBMMTQsMCBMMTYsMiBMMTYsOCBMMTQsMTAgTDQsMTAgTDYsNSB6IE02LDE1IEw0LDEwIEwxNCwxMCBMMTYsMTIgTDE2LDE4IEwxNCwyMCBMNCwyMCBMNiwxNSB6IE02LDI1IEw0LDIwIEwxNCwyMCBMMTYsMjIgTDE2LDI4IEwxNCwzMCBMNCwzMCBMNiwyNSB6IE02LDUgTDQsMCBMNCw1IHogTTYsMTUgTDQsMTAgTDQsMTUgeiBNNiwyNSBMNCwyMCBMNCwyNSB6DQpNOCwwIEwxNiwwIEwxOCwyIEwxOCw4IEwxNiwxMCBMOCwxMCBMMTAsNSB6IE0xMCwxNSBMOCwxMCBMMTYsMTAgTDE4LDEyIEwxOCwxOCBMMTYsMjAgTDgsMjAgTDEwLDE1IHogTTEwLDI1IEw4LDIwIEwxNiwyMCBMMTgsMjIgTDE4LDI4IEwxNiwzMCBMOCwzMCBMMTAsMjUgeiBNMTAsNSBMOCwwIEw4LDUgeiBNMTAsMTUgTDgsMTAgTDgsMTUgeiBNMTAsMjUgTDgsMjAgTDgsMjUgeg0KTTIwLDAgTDMwLDAgTDMyLDIgTDMyLDggTDMwLDEwIEwyMCwxMCBMMjIsNSB6IE0yMiwxNSBMMjAsMTAgTDMwLDEwIEwzMiwxMiBMMzIsMTggTDMwLDIwIEwyMCwyMCBMMjIsMTUgeiBNMjIsMjUgTDIwLDIwIEwzMCwyMCBMMzIsMjIgTDMyLDI4IEwzMCwzMCBMMjAsMzAgTDIyLDI1IHogTTIyLDUgTDIwLDAgTDIwLDUgeiBNMjIsMTUgTDIwLDEwIEwyMCwxNSB6IE0yMiwyNSBMMjAsMjAgTDIwLDI1IHoNCk0yNCwwIEwzNCwwIEwzNiwyIEwzNiw4IEwzNCwxMCBMMjQsMTAgTDI2LDUgeiBNMjYsMTUgTDI0LDEwIEwzNCwxMCBMMzYsMTIgTDM2LDE4IEwzNCwyMCBMMjQsMjAgTDI2LDE1IHogTTI2LDI1IEwyNCwyMCBMMzQsMjAgTDM2LDIyIEwzNiwyOCBMMzQsMzAgTDI0LDMwIEwyNiwyNSB6IE0yNiw1IEwyNCwwIEwyNCw1IHogTTI2LDE1IEwyNCwxMCBMMjQsMTUgeiBNMjYsMjUgTDI0LDIwIEwyNCwyNSB6DQpNMjgsICBMMzgsICBMNDAsICBMNDAsICBMMzgsICBMMjgsICBMMzAsICB6IE0zMCwgIEwyOCwgIEwzOCwgIEw0MCwgIEw0MCwgIEwzOCwgIEwyOCwgIEwzMCwgIHogTTMwLCAgTDI4LCAgTDM4LCAgTDQwLCAgTDQwLCAgTDM4LCAgTDI4LCAgTDMwLCAgeiB6DQpNNCwzMCBMMTQsMzAgTDE2LDMyIEwxNiwzOCBMMTQsNDAgTDQsNDAgTDYsMzUgeiBNNiw0NSBMNC00MCBMMTQsNDAgTDE2LDQyIEwxNiw0OCBMMTQsNTAgEwwsNTAgTDYsNDUgeiBNNiw1NSBMNCw1MCBMMTQsNTAgTDE2LDUyIEwxNiw1OCBMMTQsNjAgTDAsNjAgTDYsNTUgeiBNNiwzNSBMNCwzMCBMNCwzNSB6IE02LDQ1IEw0LDQwIEw0LDQ1IHogTTYsNTUgTDQsNTAgTDQsNTUgeg0KTTgsMzAgTDE4LDMwIEwyMCwzMiBMMjAsMzggTDE4LDQwIEw4LDQwIEwxMCwzNSB6IE0xMCw0NSBMOCw0MCBMMTPDNC40MCBMMjAsNDIgTDIwLDQ4IEwxOCw1MCBMOCw1MCBMMTAsNDUgeiBNMTAsNTUgTDgsNTAgTDE4LDUwIEwyMCw1MiBMMjAsNTggTDE4LDYwIEw4LDYwIEwxMCw1NSB6IE0xMCwzNSBMOCwzMCBMOCwzNSB6IE0xMCw0NSBMOCw0MCBMOCw0NSB6IE0xMCw1NSBMOCw1MCBMOCw1NSB6DQpNMTIsMzAgTDIyLDMwIEwyNCwzMiBMMjQsMzggTDIyLDQwIEwxMiw0MCBMMTQsMzUgeiBNMTQsNDUgTDEyLDQwIEwyMiw0MCBMMjQsNDIgTDI0LDQ4IEwyMiw1MCBMMTIsNTAgTDE0LDQ1IHogTTE0LDU1IEwxMiw1MCBMMjIsNTAgTDI0LDUyIEwyNCw1OCBMMjIsNjAgTDEyLDYwIEwxNCw1NSB6IE0xNCwzNSBMMTIsMzAgTDEyLDM1IHogTTE0LDQ1IEwxMiw0MCBMMTIsNDUgeiBNMTQsNTUgTDEyLDUwIEwxMiw1NSB6DQpNMTYsMzAgTDI2LDMwIEwyOCwzMiBMMjgsMzggTDI2LDQwIEwxNiw0MCBMMTgsMzUgeiBNMTgsNDUgTDE2LDQwIEwyNiw0MCBMMjgsNDIgTDI4LDQ4IEwyNiw1MCBMMTYsNTAgTDE4LDQ1IHogTTE4LDU1IEwxNiw1MCBMMjYsNTAgTDI4LDUyIEwyOCw1OCBMMjYsNjAgTDE2LDYwIEwxOCw1NSB6IE0xOCwzNSBMMTYsMzAgTDE2LDM1IHogTTE4LDQ1IEwxNiw0MCBMMTYsNDUgeiBNMTgsNTUgTDE2LDUwIEwxNiw1NSB6DQpNMjAsMzAgTDMwLDMwIEwzMiwzMiBMMzIsMzggTDMwLDQwIEwyMCw0MCBMMjIsMzUgeiBNMjIsNDUgTDIwLDQwIEwzMCw0MCBMMzIsNDIgTDMyLDQ4IEwzMCw1MCBMMjAsNTAgTDIyLDQ1IHogTTIyLDU1IEwyMCw1MCBMMzAsNTAgTDMyLDUyIEwzMiw1OCBMMzAsNjAgTDIwLDYwIEwyMiw1NSB6IE0yMiwzNSBMMjAsMzAgTDIwLDM1IHogTTIyLDQ1IEwyMCw0MCBMMjAsNDUgeiBNMjIsNTUgTDIwLDUwIEwyMCw1NSB6DQpNMjQsMzAgTDM0LDMwIEwzNiwzMiBMMzYsMzggTDM0LDQwIEwyNCw0MCBMMjYsMzUgeiBNMjYsNDUgTDI0LDQwIEwzNCw0MCBMMzYsNDIgTDM2LDQ4IEwzNCw1MCBMMjQsNTAgTDI2LDQ1IHogTTI2LDU1IEwyNCw1MCBMMzQsNTAgTDM2LDUyIEwzNiw1OCBMMzQsNjAgTDI0LDYwIEwyNiw1NSB6IE0yNiwzNSBMMjQsMzAgTDI0LDM1IHogTTI2LDQ1IEwyNCw0MCBMMjQsNDUgeiBNMjYsNTUgTDI0LDUwIEwyNCw1NSB6DQpNMjgsMzAgTDM4LDMwIEw0MCwzMiBMNDAsMzggTDM4LDQwIEwyOCw0MCBMMzAsMzUgeiBNMzAsNDUgTDI4LDQwIEwzOCw0MCBMNDAsNDIgTDQwLDQ4IEwzOCw1MCBMMjgsNTAgTDMwLDQ1IHogTTMwLDU1IEwyOCw1MCBMMzgsNTAgTDQwLDUyIEw0MCw1OCBMMzgsNjAgTDI4LDYwIEwzMCw1NSB6IE0zMCwzNSBMMjgsMzAgTDI4LDM1IHogTTMwLDQ1IEwyOCw0MCBMMjgsNDUgeiBNMzAsNTUgTDI4LDUwIEwyOCw1NSB6DQpNMzIsMzAgTDQyLDMwIEw0NCwzMiBMNDQsMzggTDQyLDQwIEwzMiw0MCBMMzQsMzUgeiBNMzQsNDUgTDMyLDQwIEw0Miw0MCBMNDQsNDIgTDQ0LDQ4IEw0Miw1MCBMMzIsNTAgTDM0LDQ1IHogTTM0LDU1IEwzMiw1MCBMNDIsNTAgTDQ0LDUyIEw0NCw1OCBMNDIsNjAgTDMyLDYwIEwzNCw1NSB6IE0zNCwzNSBMMzIsMzAgTDMyLDM1IHogTTM0LDQ1IEwzMiw0MCBMMzIsNDUgeiBNMzQsNTUgTDMyLDUwIEwzMiw1NSB6DQpNMzYsMzAgTDQ2LDMwIEw0OCwzMiBMNDgsMzggTDQ2LDQwIEwzNiw0MCBMMzgsMzUgeiBNMzgsNDUgTDM2LDQwIEw0Niw0MCBMNDgsNDIgTDQ4LDQ4IEw0Niw1MCBMMzYsNTAgTDM4LDQ1IHogTTM4LDU1IEwzNiw1MCBMNDYsNTAgTDQ4LDUyIEw0OCw1OCBMNDYsNjAgTDM2LDYwIEwzOCw1NSB6IE0zOCwzNSBMMzYsMzAgTDM2LDM1IHogTTM4LDQ1IEwzNiw0MCBMMzYsNDUgeiBNMzgsNTUgTDM2LDUwIEwzNiw1NSB6DQpNNDAsMzAgTDUwLDMwIEw1MiwzMiBMNTIsMzggTDUwLDQwIEw0MCw0MCBMNDIsMzUgeiBNNDIsNDUgTDQwLDQwIEw1MCw0MCBMNTIsNDIgTDUyLDQ4IEw1MCw1MCBMNDAsNTAgTDQyLDQ1IHogTTQyLDU1IEw0MCw1MCBMNTAsNTAgTDUyLDUyIEw1Miw1OCBMNTAsNjAgTDQwLDYwIEw0Miw1NSB6IE00MiwzNSBMNDAsMzAgTDQwLDM1IHogTTQyLDQ1IEw0MCw0MCBMNDAsNDUgeiBNNDIsNTUgTDQwLDUwIEw0MCw1NSB6DQpNNTIsMzAgTDYyLDMwIEw2NCwzMiBMNjQsMzggTDYyLDQwIEw1Miw0MCBMNTQsMzUgeiBNNTQsNDUgTDUyLDQwIEw2Miw0MCBMNjQsNDIgTDY0LDQ4IEw2Miw1MCBMNTIsNTAgTDU0LDQ1IHogTTU0LDU1IEw1Miw1MCBMNjIsNTAgTDY0LDUyIEw2NCw1OCBMNjIsNjAgTDUyLDYwIEw1NCw1NSB6IE01NCwzNSBMNTIsMzAgTDUyLDM1IHogTTU0LDQ1IEw1Miw0MCBMNTIsNDUgeiBNNTQsNTUgTDUyLDUwIEw1Miw1NSB6DQpNNTYsMzAgTDY2LDMwIEw2OCwzMiBMNjgsMzggTDY2LDQwIEw1Niw0MCBMNTgsMzUgeiBNNTgsNDUgTDU2LDQwIEw2Niw0MCBMNjgsNDIgTDY4LDQ4IEw2Niw1MCBMNTYsNTAgTDU4LDQ1IHogTTU4LDU1IEw1Niw1MCBMNjYsNTAgTDY4LDUyIEw2OCw1OCBMNjYsNjAgTDU2LDYwIEw1OCw1NSB6IE01OCwzNSBMNTYsMzAgTDU2LDM1IHogTTU4LDQ1IEw1Niw0MCBMNTYsNDUgeiBNNTgsNTUgTDU2LDUwIEw1Niw1NSB6DQpNNjAsMzAgTDcwLDMwIEw3MiwzMiBMNzIsMzggTDcwLDQwIEw2MCw0MCBMNjIsMzUgeiBNNjIsNDUgTDYwLDQwIEw3MCw0MCBMNzIsNDIgTDcyLDQ4IEw3MCw1MCBMNjAsNTAgTDYyLDQ1IHogTTYyLDU1IEw2MCw1MCBMNzAsNTAgTDcyLDUyIEw3Miw1OCBMNzAsNjAgTDYwLDYwIEw2Miw1NSB6IE02MiwzNSBMNjAsMzAgTDYwLDM1IHogTTYyLDQ1IEw2MCw0MCBMNjAsNDUgeiBNNjIsNTUgTDYwLDUwIEw2MCw1NSB6DQpNNjQsMzAgTDc0LDMwIEw3NiwzMiBMNzYsMzggTDc0LDQwIEw2NCw0MCBMNjYsMzUgeiBNNjYsNDUgTDY0LDQwIEw3NCw0MCBMNzYsNDIgTDc2LDQ4IEw3NCw1MCBMNjQsNTAgTDY2LDQ1IHogTTY2LDU1IEw2NCw1MCBMNzQsNTAgTDc2LDUyIEw3Niw1OCBMNzQsNjAgTDY0LDYwIEw2Niw1NSB6IE02NiwzNSBMNjQsMzAgTDY0LDM1IHogTTY2LDQ1IEw2NCw0MCBMNjQsNDUgeiBNNjYsNTUgTDY0LDUwIEw2NCw1NSB6DQpNNjgsMzAgTDc4LDMwIEw4MCwzMiBMODAsMzggTDc4LDQwIEw2OCw0MCBMNzAsMzUgeiBNNzAsNDUgTDY4LDQwIEw3OCw0MCBMODAsNDIgTDgwLDQ4IEw3OCw1MCBMNjgsNTAgTDcwLDQ1IHogTTcwLDU1IEw2OCw1MCBMNzgsNTAgTDgwLDUyIEw4MCw1OCBMNzgsNjAgTDY4LDYwIEw3MCw1NSB6IE03MCwzNSBMNjgsMzAgTDY4LDM1IHogTTcwLDQ1IEw2OCw0MCBMNjgsNDUgeiBNNzAsNTUgTDY4LDUwIEw2OCw1NSB6DQpNNzIsMzAgTDgyLDMwIEw4NCwzMiBMODQsMzggTDgyLDQwIEw3Miw0MCBMNzQsMzUgeiBNNzQsNDUgTDcyLDQwIEw4Miw0MCBMODQsNDIgTDg0LDQ4IEw4Miw1MCBMNzIsNTAgTDc0LDQ1IHogTTc0LDU1IEw3Miw1MCBMODIsNTAgTDg0LDUyIEw4NCw1OCBMODIsNjAgTDcyLDYwIEw3NCw1NSB6IE03NCwzNSBMNzIsMzAgTDcyLDM1IHogTTc0LDQ1IEw3Miw0MCBMNzIsNDUgeiBNNzQsNTUgTDcyLDUwIEw3Miw1NSB6DQpNNzYsMzAgTDg2LDMwIEw4OCwzMiBMODgsMzggTDg2LDQwIEw3Niw0MCBMNzgsMzUgeiBNNzgsNDUgTDc2LDQwIEw4Niw0MCBMODgsNDIgTDg4LDQ4IEw4Niw1MCBMNzYsNTAgTDc4LDQ1IHogTTc4LDU1IEw3Niw1MCBMODYsNTAgTDg4LDUyIEw4OCw1OCBMODYsNjAgTDc2LDYwIEw3OCw1NSB6IE03OCwzNSBMNzYsMzAgTDc2LDM1IHogTTc4LDQ1IEw3Niw0MCBMNzYsNDUgeiBNNzgsNTUgTDc2LDUwIEw3Niw1NSB6DQoiPjwvcGF0aD4KPC9zdmc+')]"></div>
        
        {/* Gradiente brillante animado */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-gradient-x"></div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-gradient-x"></div>
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent animate-gradient-y"></div>
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-indigo-500 to-transparent animate-gradient-y"></div>
        
        <div className="p-6 relative z-10">
          <AlertDialogHeader className="space-y-3 pb-2">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-red-500 blur-md opacity-30 animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-red-500 to-red-800 rounded-full flex items-center justify-center shadow-lg ring-2 ring-red-400/20">
                  <XCircleIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="mt-4 text-center">
                <AlertDialogTitle className="text-2xl font-bold text-white mb-1">
                  Transacción Fallida
                </AlertDialogTitle>
                <p className="text-indigo-200/70 text-sm">
                  La operación no pudo completarse debido a saldo insuficiente
                </p>
              </div>
            </div>
          </AlertDialogHeader>
          
          {/* Detalles de la transacción */}
          <div className="my-5 p-5 rounded-xl bg-[#131c31] backdrop-blur-sm border border-indigo-900/30 my-4 shadow-inner">
            {/* Status de la transacción */}
            <div className="flex items-center justify-between mb-4 border-b border-indigo-900/20 pb-3">
              <div className="flex items-center gap-2">
                <ReceiptTextIcon className="text-indigo-400 w-5 h-5" />
                <span className="text-indigo-100 text-sm font-medium">Estado Transacción</span>
              </div>
              <div className="flex items-center gap-1.5 bg-red-900/30 border border-red-800/50 text-red-300 rounded-full px-2.5 py-1 text-xs">
                <XCircleIcon className="h-3.5 w-3.5" />
                <span>Revertida</span>
              </div>
            </div>
            
            {/* Información de balance y cantidad requerida */}
            <div className="space-y-3 pb-3 border-b border-indigo-900/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WalletIcon className="text-indigo-400 w-4 h-4" />
                  <span className="text-indigo-100 text-sm">Balance Actual</span>
                </div>
                <div className="font-mono text-white text-sm">
                  <span className="font-bold">{parseFloat(balance) < 0.01 ? "0.00" : formatCurrency(parseFloat(balance))}</span>
                  <span className="ml-1 text-green-400">{tokenSymbol}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CircleDollarSignIcon className="text-indigo-400 w-4 h-4" />
                  <span className="text-indigo-100 text-sm">Cantidad Requerida</span>
                </div>
                <div className="font-mono text-white text-sm">
                  <span className="font-bold">{formatCurrency(parseFloat(amount))}</span>
                  <span className="ml-1 text-green-400">{tokenSymbol}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <NetworkIcon className="text-indigo-400 w-4 h-4" />
                  <span className="text-indigo-100 text-sm">Red</span>
                </div>
                <div className="text-white text-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Ethereum Mainnet</span>
                </div>
              </div>
            </div>
            
            {/* Hash de la transacción */}
            <div className="mt-3 pt-2 border-b border-indigo-900/20 pb-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-start gap-2">
                  <div className="pt-0.5">
                    <ReceiptTextIcon className="text-indigo-400 w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-indigo-100 text-sm">Error de Contrato</span>
                    <div className="mt-1 p-2.5 bg-red-900/20 border border-red-800/40 rounded-lg">
                      <code className="text-xs font-mono text-red-200 break-all whitespace-pre-wrap">
                        ERC20: transfer amount exceeds balance
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Saldo Adicional Requerido */}
            <div className="flex items-center justify-between mt-3 pt-1">
              <div className="flex items-center gap-2">
                <CoinsIcon className="text-purple-400 w-4 h-4" />
                <span className="text-indigo-200 text-sm font-semibold">Saldo Adicional Requerido</span>
              </div>
              <div className="font-mono text-white bg-purple-600/20 border border-purple-500/30 rounded-lg px-3 py-1">
                <span className="font-bold text-sm">+{formatCurrency(requiredAmount)}</span>
                <span className="ml-1 text-green-400 text-sm">{tokenSymbol}</span>
              </div>
            </div>
          </div>
          
          {/* Solución recomendada */}
          <div className="my-4 p-4 rounded-lg bg-indigo-900/20 border border-indigo-700/30">
            <h4 className="text-indigo-300 font-medium text-sm mb-3 flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-indigo-600/50 flex items-center justify-center">
                <CheckCircle2Icon className="w-3.5 h-3.5 text-white" />
              </div>
              Acciones Recomendadas
            </h4>
            
            <p className="text-sm text-indigo-100/70 mb-1">
              Para completar esta transacción, necesitas depositar al menos <span className="font-bold text-white">{formatCurrency(requiredAmount)}</span> <span className="text-green-400">{tokenSymbol}</span> en tu wallet.
            </p>
            
            <div className="mt-3 p-2 rounded-lg bg-indigo-900/40 border border-indigo-600/30">
              <div className="flex items-start gap-2 mb-2">
                <div className="mt-0.5 min-w-5">
                  <div className="w-4 h-4 rounded-full bg-indigo-500/50 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">1</span>
                  </div>
                </div>
                <p className="text-xs text-indigo-200">
                  <span className="text-indigo-300 font-medium">Recargar {tokenSymbol}:</span> Transfiere fondos desde otra wallet o exchange a tu wallet actual.
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="mt-0.5 min-w-5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/50 flex items-center justify-center">
                    <span className="text-xs text-white font-bold">2</span>
                  </div>
                </div>
                <p className="text-xs text-indigo-200">
                  <span className="text-emerald-300 font-medium">Añadir Liquidez:</span> Agrega fondos directamente al pool de WayBank para comenzar a generar rendimientos.
                </p>
              </div>
            </div>
            
            <div className="animate-pulse mt-4">
              <div className="h-1 w-full bg-gradient-to-r from-indigo-500/20 via-indigo-400 to-indigo-500/20 rounded"></div>
            </div>
          </div>
          
          <AlertDialogFooter className="flex flex-col space-y-3 mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
              <Link href="/add-liquidity" className="w-full">
                <Button 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 h-12 font-medium rounded-lg shadow-xl shadow-indigo-600/10"
                  onClick={() => onOpenChange(false)}
                >
                  <WalletCards className="w-5 h-5 mr-2" />
                  Recargar {tokenSymbol}
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              {/* Nuevo botón para ir al diálogo de añadir liquidez */}
              <Link href="/liquidity" className="w-full">
                <Button 
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 h-12 font-medium rounded-lg shadow-xl shadow-emerald-600/10"
                  onClick={() => onOpenChange(false)}
                >
                  <CoinsIcon className="w-5 h-5 mr-2" />
                  Añadir Liquidez
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            <AlertDialogCancel className="bg-transparent text-indigo-300 border border-indigo-800/50 hover:bg-indigo-900/50 hover:text-white transition-colors h-11">
              <RefreshCcwIcon className="w-4 h-4 mr-2" />
              Intentar más tarde
            </AlertDialogCancel>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};