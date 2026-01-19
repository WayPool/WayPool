import React, { useState, useEffect } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { usePositions } from "@/hooks/use-positions";
import { useMediaQuery } from "@/hooks/use-media-query";
import ConnectButton from "@/components/wallet/connect-button";
import ConnectModal from "@/components/wallet/connect-modal";
import CollapsiblePositionCard from "@/components/dashboard/collapsible-position-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Search, Filter, Info, RefreshCw, AlertCircle, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { positionsTranslations } from "@/translations/positions";

// Función para determinar el color del APR basado en su valor
function getAPRColor(apr: number): string {
  if (apr >= 30) return '#10b981'; // green for high APR
  if (apr >= 15) return '#60a5fa'; // blue for medium APR
  return '#f59e0b';                // amber for low APR
}

const Positions: React.FC = () => {
  const { address, connectWallet, setIsModalOpen } = useWallet();
  const { positions, dbPositions, isLoadingPositions, totalLiquidityValue, totalFeesEarned, activePositionsCount } = usePositions();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // Obtener traducciones para el idioma actual con fallback jerárquico
  const t = positionsTranslations[language] || positionsTranslations.es || positionsTranslations.en;

  // Determine number of columns based on screen size (for skeleton)
  const columns = isMobile ? 1 : isTablet ? 1 : 2;

  // Filter positions based on search term and active tab
  const filteredPositions = dbPositions?.filter((position: any) => {
    // Search filter
    const searchMatch =
      position.id.toString().includes(searchTerm.toLowerCase()) ||
      (position.token0 && position.token0.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (position.token1 && position.token1.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (position.poolName && position.poolName.toLowerCase().includes(searchTerm.toLowerCase()));

    // Tab filter
    if (activeTab === "active" && position.status !== "Active") return false;
    if (activeTab === "pending" && position.status !== "Pending") return false;
    if (activeTab === "finalized" && position.status !== "Finalized") return false;

    return searchMatch;
  });

  // Function to refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: [`/api/position-history/${address || "none"}`] });
      // Small pause to allow skeletons to be displayed
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      // Removed console.error for production
      toast({
        title: t.errorUpdatingPositions,
        description: t.errorUpdatingPositionsDescription,
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      {/* Header with Wallet Connection */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {t.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>
        <div className="w-full md:w-auto">
          <ConnectButton />
        </div>
      </div>

      {/* Portfolio statistics */}
      {address && !isLoadingPositions && dbPositions && dbPositions.length > 0 && (
        <>
          {/* Tarjetas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                  {t.totalLiquidity}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60 text-xs">
                          {t.totalLiquidityTooltip}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <p className="text-2xl font-bold">{totalLiquidityValue}</p>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                  {t.totalFeesEarned}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60 text-xs">
                          {t.totalFeesEarnedTooltip}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <p className="text-2xl font-bold">{totalFeesEarned}</p>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center">
                  {t.activePositions}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-slate-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="w-60 text-xs">
                          {t.activePositionsTooltip}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
                <p className="text-2xl font-bold">{activePositionsCount}</p>
              </CardHeader>
            </Card>
          </div>
          
          {/* Advanced metrics and analysis - New section */}
          <div className="bg-gradient-to-br from-slate-950 to-slate-900 dark:from-slate-950 dark:to-slate-900 rounded-xl overflow-hidden border border-slate-800 dark:border-slate-800 mb-6 p-4">
            <div className="flex items-center mb-4">
              <div className="w-7 h-7 rounded-md bg-indigo-900/30 flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M5 5l2.5 2.5M19 5l-2.5 2.5M5 19l2.5-2.5M19 19l-2.5-2.5M2 12h4M18 12h4M12 18v4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-200">
                {t.positionAnalytics}
              </h3>
              <div className="ml-auto flex items-center">
                <span className="text-xs bg-indigo-900/30 border border-indigo-700/30 text-indigo-400 rounded-md px-2 py-1">
                  {t.realTimeLiquidityDistribution}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {/* Metric: Average APR */}
              <div className="bg-slate-900/50 rounded-lg border border-slate-800/50 p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 flex items-center">
                      {t.averageAPR}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 ml-1 text-slate-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60 text-xs">
                              {t.averageAPRTooltip}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(() => {
                        const activePositions = dbPositions.filter((p: any) => p.status === "Active");
                        if (activePositions.length === 0) return "0.00%";
                        
                        // Calcular promedio ponderado (valor * APR para cada posición)
                        const totalValue = activePositions.reduce((sum: number, pos: any) => 
                          sum + parseFloat(pos.depositedUSDC || "0"), 0);
                        
                        if (totalValue === 0) return "0.00%";
                        
                        const weightedAPR = activePositions.reduce((sum: number, pos: any) => {
                          const value = parseFloat(pos.depositedUSDC || "0");
                          const apr = parseFloat(pos.apr || "0");
                          return sum + (value * apr / totalValue);
                        }, 0);
                        
                        return weightedAPR.toFixed(2) + "%";
                      })()}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-green-900/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                </div>
                <div className="flex items-center mt-3">
                  <div className="flex-grow h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400" 
                      style={{ 
                        width: (() => {
                          const activePositions = dbPositions.filter((p: any) => p.status === "Active");
                          if (activePositions.length === 0) return "0%";
                          
                          const avgAPR = activePositions.reduce((sum: number, pos: any) => 
                            sum + parseFloat(pos.apr || "0"), 0) / activePositions.length;
                          
                          // Normalize APR for the bar (maximum 100%)
                          return Math.min(avgAPR, 100) + "%";
                        })()
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Metric: Invested Capital */}
              <div className="bg-slate-900/50 rounded-lg border border-slate-800/50 p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 flex items-center">
                      {t.investedCapital}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 ml-1 text-slate-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60 text-xs">
                              {t.investedCapitalTooltip}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(() => {
                        const activePositions = dbPositions.filter((p: any) => p.status === "Active");
                        const totalCapital = activePositions.reduce((sum: number, pos: any) => 
                          sum + parseFloat(pos.depositedUSDC || "0"), 0);
                        
                        return new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(totalCapital);
                      })()}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-blue-900/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"></line>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs">
                  <div className="text-blue-400 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                    {t.statusActive}
                  </div>
                  <div className="ml-auto text-slate-400">
                    {dbPositions.filter((p: any) => p.status === "Active").length} {t.activePositions}
                  </div>
                </div>
              </div>
              
              {/* Metric: Daily Earnings */}
              <div className="bg-slate-900/50 rounded-lg border border-slate-800/50 p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 flex items-center">
                      {language === 'en' ? 'Daily Earnings' : 
                       language === 'es' ? 'Ganancias Diarias' : 
                       language === 'fr' ? 'Gains Journaliers' : 
                       'Tägliche Erträge'}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 ml-1 text-slate-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60 text-xs">
                              {language === 'en' ? 'Estimated daily earnings from all active positions based on current APR.' : 
                               language === 'es' ? 'Ganancias diarias estimadas de todas tus posiciones activas basadas en el APR actual.' : 
                               language === 'fr' ? 'Gains journaliers estimés de toutes vos positions actives basés sur l\'APR actuel.' : 
                               'Geschätzte tägliche Erträge aus allen Ihren aktiven Positionen basierend auf dem aktuellen APR.'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {(() => {
                        const activePositions = dbPositions.filter((p: any) => p.status === "Active");
                        const dailyEarnings = activePositions.reduce((sum: number, pos: any) => {
                          const value = parseFloat(pos.depositedUSDC || "0");
                          const apr = parseFloat(pos.apr || "0") / 100; // Convert to decimal
                          return sum + (value * apr / 365); // Daily earnings
                        }, 0);
                        
                        return new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(dailyEarnings);
                      })()}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-purple-900/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                  </div>
                </div>
                <div className="mt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-500">{t.annualized}:</div>
                    <div className="text-purple-400 font-medium">
                      {(() => {
                        const activePositions = dbPositions.filter((p: any) => p.status === "Active");
                        const dailyEarnings = activePositions.reduce((sum: number, pos: any) => {
                          const value = parseFloat(pos.depositedUSDC || "0");
                          const apr = parseFloat(pos.apr || "0") / 100; // Convert to decimal
                          return sum + (value * apr / 365); // Daily earnings
                        }, 0);
                        
                        // Usar el locale del usuario para formatear la moneda
                        return new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(dailyEarnings * 365);
                      })()}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Métrica: Tiempo promedio hasta finalización */}
              <div className="bg-slate-900/50 rounded-lg border border-slate-800/50 p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-slate-500 mb-1 flex items-center">
                      {language === 'en' ? 'Next Position Maturity' : 
                       language === 'es' ? 'Próximo Vencimiento' : 
                       language === 'fr' ? 'Prochaine Échéance' : 
                       'Nächste Fälligkeit'}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3 w-3 ml-1 text-slate-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60 text-xs">
                              {language === 'en' ? 'Time remaining until the next position reaches maturity date.' : 
                               language === 'es' ? 'Tiempo restante hasta que la próxima posición alcance su fecha de vencimiento.' : 
                               language === 'fr' ? 'Temps restant jusqu\'à ce que la prochaine position atteigne sa date d\'échéance.' : 
                               'Verbleibende Zeit bis die nächste Position ihren Fälligkeitstermin erreicht.'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-2xl font-bold text-white flex items-center gap-1">
                      {(() => {
                        // Obtener posiciones activas
                        const activePositions = dbPositions.filter((p: any) => p.status === "Active");
                        if (activePositions.length === 0) {
                          return language === 'en' ? 'N/A' : 
                            language === 'es' ? 'N/D' : 
                            language === 'fr' ? 'N/D' : 
                            'k.A.';
                        }
                        
                        // Calcular días restantes basándose en fecha de creación + 365 días
                        const positionsWithDays = activePositions.map((pos: any) => {
                          // TODAS las posiciones son de 365 días de bloqueo
                          const LOCK_PERIOD_DAYS = 365;
                          
                          // Calcular desde la fecha de creación
                          if (pos.createdDate || pos.date || pos.startDate) {
                            const creationDate = new Date(pos.createdDate || pos.date || pos.startDate);
                            const lockEndDate = new Date(creationDate.getTime() + (LOCK_PERIOD_DAYS * 24 * 60 * 60 * 1000));
                            const today = new Date();
                            const daysRemaining = Math.max(0, Math.ceil((lockEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
                            
                            return {
                              id: pos.id,
                              remainingDays: daysRemaining
                            };
                          }
                          
                          // Si existe lockStatus como objeto y tiene daysUntilUnlocked
                          if (pos.lockStatus && typeof pos.lockStatus.daysUntilUnlocked === 'number') {
                            return {
                              id: pos.id,
                              remainingDays: pos.lockStatus.daysUntilUnlocked
                            };
                          }
                          
                          // Si existe daysUntilUnlocked directamente en la posición
                          if (typeof pos.daysUntilUnlocked === 'number') {
                            return {
                              id: pos.id,
                              remainingDays: pos.daysUntilUnlocked
                            };
                          }
                          
                          // Calcular con lockEndDate si está disponible
                          if (pos.lockEndDate) {
                            const today = new Date();
                            const lockEndDate = new Date(pos.lockEndDate);
                            const daysUntil = Math.max(0, Math.ceil((lockEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
                            return {
                              id: pos.id,
                              remainingDays: daysUntil
                            };
                          }
                          
                          // Si todo lo demás falla, usar endDate
                          if (pos.endDate) {
                            const today = new Date();
                            const endDate = new Date(pos.endDate);
                            const daysUntil = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
                            return {
                              id: pos.id,
                              remainingDays: daysUntil
                            };
                          }
                          
                          // Si no hay información disponible, asumir 0 días
                          return {
                            id: pos.id,
                            remainingDays: 0
                          };
                        });
                        
                        // Ordenar por días restantes (ascendente)
                        positionsWithDays.sort((a: any, b: any) => a.remainingDays - b.remainingDays);
                        
                        // Log para depuración
                        console.log("Posiciones con días hasta vencimiento:", positionsWithDays);
                        
                        // Obtener la posición que vence primero
                        const nextPosition = positionsWithDays[0];
                        
                        // Traducir "day/days" según el idioma
                        const getDaysText = (count: number) => {
                          if (count === 1) {
                            return language === 'en' ? 'day' : 
                              language === 'es' ? 'día' : 
                              language === 'fr' ? 'jour' : 
                              language === 'de' ? 'Tag' : 
                              language === 'pt' ? 'dia' : 
                              'day';
                          } else {
                            return language === 'en' ? 'days' : 
                              language === 'es' ? 'días' : 
                              language === 'fr' ? 'jours' : 
                              language === 'de' ? 'Tage' : 
                              language === 'pt' ? 'dias' : 
                              'days';
                          }
                        };
                        
                        // Mostrar el resultado formateado con traducción
                        if (!nextPosition || nextPosition.remainingDays === 0) {
                          return "< 1 " + getDaysText(1);
                        } else if (nextPosition.remainingDays === 1) {
                          return "1 " + getDaysText(1);
                        } else {
                          return nextPosition.remainingDays + " " + getDaysText(2);
                        }
                      })()}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-md bg-orange-900/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    {(() => {
                      // Obtener posiciones activas
                      const activePositions = dbPositions.filter((p: any) => p.status === "Active");
                      if (activePositions.length === 0) return null;
                      
                      // Calcular progreso basándose en fecha de creación + 365 días (TODAS las posiciones)
                      const positionsWithProgress = activePositions.map((pos: any) => {
                        const LOCK_PERIOD_DAYS = 365; // TODAS las posiciones son de 365 días
                        
                        // Calcular desde la fecha de creación
                        if (pos.createdDate || pos.date || pos.startDate) {
                          const creationDate = new Date(pos.createdDate || pos.date || pos.startDate);
                          const lockEndDate = new Date(creationDate.getTime() + (LOCK_PERIOD_DAYS * 24 * 60 * 60 * 1000));
                          const today = new Date();
                          const remainingDays = Math.max(0, Math.ceil((lockEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
                          
                          // El progreso es el porcentaje que falta por completar
                          const progress = Math.min(100, Math.max(0, (remainingDays / LOCK_PERIOD_DAYS) * 100));
                          
                          return {
                            id: pos.id,
                            remainingDays: remainingDays,
                            totalDays: LOCK_PERIOD_DAYS,
                            progress
                          };
                        }
                        
                        // Si no tenemos datos predefinidos, calcular con timeframe y timestamp
                        if (pos.timestamp && pos.timeframe) {
                          const today = new Date();
                          const creationDate = new Date(pos.timestamp);
                          const lockPeriod = parseInt(pos.timeframe) * 2; // El periodo de bloqueo es 2x el timeframe
                          
                          const endDate = new Date(creationDate);
                          endDate.setDate(creationDate.getDate() + lockPeriod);
                          
                          const totalDuration = endDate.getTime() - creationDate.getTime();
                          const remaining = endDate.getTime() - today.getTime();
                          const progress = Math.min(100, Math.max(0, (remaining / totalDuration) * 100));
                          
                          return {
                            id: pos.id,
                            progress
                          };
                        }
                        
                        // Si hay lockStatus, usarlo
                        if (pos.lockStatus) {
                          // Extraer fechas directamente del objeto lockStatus
                          const creationDate = pos.lockStatus.creationDate ? new Date(pos.lockStatus.creationDate) : null;
                          const lockEndDate = pos.lockStatus.lockEndDate ? new Date(pos.lockStatus.lockEndDate) : null;
                          
                          if (creationDate && lockEndDate) {
                            const today = new Date();
                            const totalDuration = lockEndDate.getTime() - creationDate.getTime();
                            const remaining = lockEndDate.getTime() - today.getTime();
                            const progress = Math.min(100, Math.max(0, (remaining / totalDuration) * 100));
                            
                            return {
                              id: pos.id,
                              progress
                            };
                          }
                        }
                        
                        // Si no hay información suficiente, asumir 50% de progreso
                        return {
                          id: pos.id,
                          progress: 50
                        };
                      });
                      
                      // Ordenar por días restantes (ascendente)
                      const sortedPositions = [...positionsWithProgress].sort((a, b) => 
                        (a.remainingDays || Infinity) - (b.remainingDays || Infinity)
                      );
                      
                      // Obtener la posición que vence primero
                      const nextPosition = sortedPositions[0];
                      
                      // Log para depuración
                      console.log("Posiciones con progreso:", positionsWithProgress);
                      
                      if (!nextPosition) return null;
                      
                      // Usar el progreso calculado (porcentaje completado del periodo total)
                      const progressValue = Math.round(nextPosition.progress);
                      
                      return (
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-yellow-400" 
                          style={{ width: `${progressValue}%` }}
                        ></div>
                      );
                    })()}
                  </div>
                  <div className="flex justify-between mt-1.5 text-xs text-slate-500">
                    <span>{t.start}</span>
                    <span>{t.maturity}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Segunda fila de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* Métrica: Distribución de Pools */}
              <div className="bg-slate-900/50 rounded-lg border border-slate-800/50 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-300 flex items-center">
                    {language === 'es' ? 'Distribución de Pools' : 
                     language === 'fr' ? 'Distribution des Pools' : 
                     language === 'de' ? 'Pool-Verteilung' : 
                     'Pool Distribution'}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-slate-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-60 text-xs">
                            {language === 'es' ? 'Distribución de tu capital entre diferentes pools de liquidez.' : 
                             language === 'fr' ? 'Distribution de votre capital entre différents pools de liquidité.' : 
                             language === 'de' ? 'Verteilung Ihres Kapitals auf verschiedene Liquiditätspools.' : 
                             'Distribution of your capital across different liquidity pools.'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-xs text-slate-500">
                    {language === 'es' ? 'Por capital' : 
                     language === 'fr' ? 'Par capital' : 
                     language === 'de' ? 'Nach Kapital' : 
                     'By capital'}
                  </div>
                </div>
                
                <div>
                  {(() => {
                    const activePositions = dbPositions.filter((p: any) => p.status === "Active");
                    if (activePositions.length === 0) return <div className="text-slate-500 text-sm text-center py-4">{t.noActivePositions}</div>;
                    
                    // Agrupar por pool
                    const poolData: Record<string, { name: string, value: number }> = {};
                    
                    activePositions.forEach((pos: any) => {
                      const poolName = pos.poolName || `${pos.token0Symbol}-${pos.token1Symbol}`;
                      const value = parseFloat(pos.depositedUSDC || "0");
                      
                      if (!poolData[poolName]) {
                        poolData[poolName] = { name: poolName, value: 0 };
                      }
                      
                      poolData[poolName].value += value;
                    });
                    
                    const totalValue = Object.values(poolData).reduce((sum, pool) => sum + pool.value, 0);
                    
                    // Convertir a array y ordenar por valor
                    const poolArray = Object.values(poolData).sort((a, b) => b.value - a.value);
                    
                    // Colores para los pools
                    const colors = [
                      "from-blue-500 to-indigo-600",
                      "from-purple-500 to-indigo-600",
                      "from-pink-500 to-purple-600",
                      "from-green-500 to-emerald-600",
                      "from-orange-500 to-red-600",
                    ];
                    
                    return (
                      <div className="space-y-2.5">
                        {poolArray.map((pool, index) => {
                          const percentage = totalValue > 0 ? (pool.value / totalValue) * 100 : 0;
                          const colorClass = colors[index % colors.length];
                          
                          return (
                            <div key={pool.name} className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300 font-medium">{pool.name}</span>
                                <span className="text-slate-400">{percentage.toFixed(1)}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full bg-gradient-to-r ${colorClass}`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
              
              {/* Métrica: Rendimiento por Pool */}
              <div className="bg-slate-900/50 rounded-lg border border-slate-800/50 p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-300 flex items-center">
                    {language === 'es' ? 'Rendimiento por Pool' : 
                     language === 'fr' ? 'Performance par Pool' : 
                     language === 'de' ? 'Performance nach Pool' : 
                     'Performance by Pool'}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-slate-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-60 text-xs">
                            {language === 'es' ? 'Comparación de APR entre los diferentes pools en los que has invertido.' : 
                             language === 'fr' ? 'Comparaison des APR entre les différents pools dans lesquels vous avez investi.' : 
                             language === 'de' ? 'APR-Vergleich zwischen verschiedenen Pools, in die Sie investiert haben.' : 
                             'APR comparison across different pools you are invested in.'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-xs text-slate-500">
                    {language === 'es' ? 'APR Promedio' : 
                     language === 'fr' ? 'APR Moyen' : 
                     language === 'de' ? 'Durchschnittliche APR' : 
                     'Average APR'}
                  </div>
                </div>
                
                {(() => {
                  const activePositions = dbPositions.filter((p: any) => p.status === "Active");
                  if (activePositions.length === 0) return <div className="text-slate-500 text-sm text-center py-4">{t.noActivePositions}</div>;
                  
                  // Agrupar por pool
                  const poolData: Record<string, { name: string, totalValue: number, totalWeightedAPR: number, count: number }> = {};
                  
                  activePositions.forEach((pos: any) => {
                    const poolName = pos.poolName || `${pos.token0Symbol}-${pos.token1Symbol}`;
                    const value = parseFloat(pos.depositedUSDC || "0");
                    const apr = parseFloat(pos.apr || "0");
                    
                    if (!poolData[poolName]) {
                      poolData[poolName] = { name: poolName, totalValue: 0, totalWeightedAPR: 0, count: 0 };
                    }
                    
                    poolData[poolName].totalValue += value;
                    poolData[poolName].totalWeightedAPR += (value * apr);
                    poolData[poolName].count += 1;
                  });
                  
                  // Calcular APR promedio ponderado por pool
                  Object.values(poolData).forEach(pool => {
                    if (pool.totalValue > 0) {
                      pool.totalWeightedAPR = pool.totalWeightedAPR / pool.totalValue;
                    }
                  });
                  
                  // Convertir a array y ordenar por APR
                  const poolArray = Object.values(poolData).sort((a, b) => b.totalWeightedAPR - a.totalWeightedAPR);
                  
                  return (
                    <div className="space-y-3">
                      {poolArray.map((pool) => (
                        <div key={pool.name} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center text-lg font-bold mr-3">
                              {pool.name.substring(0, 1)}
                            </div>
                            <div>
                              <div className="text-sm text-slate-300">{pool.name}</div>
                              <div className="text-xs text-slate-500">{pool.count} {pool.count === 1 ? t.singlePosition : t.multiplePositions}</div>
                            </div>
                          </div>
                          <div className="text-lg font-bold" style={{ color: getAPRColor(pool.totalWeightedAPR) }}>
                            {pool.totalWeightedAPR.toFixed(2)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Función para determinar el color del APR basado en su valor */}
      

      {/* Show intro section if wallet is not connected */}
      {!address && (
        <div className="bg-[#0b101e] rounded-xl overflow-hidden mb-8">
          {/* Sección principal conexión segura */}
          <div className="p-6 border-b border-[#1c2438]">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#1a1f35] flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-white">{t.secureConnection}</h2>
                  <div className="flex items-center gap-2 bg-[#15212e] px-3 py-1 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-xs text-green-400">{t.allConnectionsEncrypted}</span>
                  </div>
                </div>
                <p className="text-[#8a9fc0] text-sm mb-4">
                  {t.secureConnectionDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Connect Section */}
          <div className="p-6 border-b border-[#1c2438]">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">{t.walletConnect}</h3>
                </div>
                <p className="text-[#8a9fc0] text-sm mb-4 ml-12">
                  {t.universalMultiWallet}
                </p>

                <div className="ml-12 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 mt-0.5 text-green-500 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{t.militaryGradeSecurity}</h4>
                      <p className="text-xs text-[#8a9fc0]">{t.securityDescription}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 mt-0.5 text-green-500 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{t.compatibleWallets}</h4>
                      <p className="text-xs text-[#8a9fc0]">{t.walletsDescription}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 mt-0.5 text-green-500 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{t.mobileDesktopConnection}</h4>
                      <p className="text-xs text-[#8a9fc0]">{t.connectionDescription}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 flex flex-col items-center justify-center bg-[#111827] rounded-xl p-6 min-w-[300px]">
                <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-600/20">
                  <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-white text-lg font-medium mb-6">Connect Wallet</h3>
                <Button 
                  size="lg" 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Connect
                </Button>
                <p className="text-[#8a9fc0] text-xs mt-4 text-center">
                  By connecting your wallet, you agree to our <a href="/terms-of-use" className="text-indigo-400 hover:underline">Terms of Service</a>
                </p>
              </div>
            </div>
          </div>
          
          {/* Información de seguridad */}
          <div className="p-6 bg-[#0d121f]">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-white font-medium">{t.securityInformation}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-green-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#8a9fc0] text-xs">
                  <span className="text-white font-medium">{t.neverStoreKeys}</span> {t.credentialsOnDevice}
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-green-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#8a9fc0] text-xs">
                  <span className="text-white font-medium">{t.verifiableConnections}</span> {t.auditedCode}
                </p>
              </div>
              
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 mt-0.5 text-green-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-[#8a9fc0] text-xs">
                  <span className="text-white font-medium">{t.completeControl}</span> {t.explicitApproval}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {address && (
        <>
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Tabs
              defaultValue="all"
              className="w-full sm:w-auto"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="all">
                  {language === 'en' ? 'All' : 
                   language === 'es' ? 'Todos' : 
                   language === 'fr' ? 'Toutes' : 
                   'Alle'}
                </TabsTrigger>
                <TabsTrigger value="active">
                  {language === 'en' ? 'Active' : 
                   language === 'es' ? 'Activas' : 
                   language === 'fr' ? 'Actives' : 
                   'Aktive'}
                </TabsTrigger>
                <TabsTrigger value="pending">
                  {language === 'en' ? 'Pending' : 
                   language === 'es' ? 'Pendientes' : 
                   language === 'fr' ? 'En attente' : 
                   'Ausstehend'}
                </TabsTrigger>
                <TabsTrigger value="finalized">
                  {language === 'en' ? 'Finalized' : 
                   language === 'es' ? 'Finalizadas' : 
                   language === 'fr' ? 'Finalisées' : 
                   'Abgeschlossen'}
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                <Input
                  placeholder={
                    language === 'en' ? 'Search positions...' : 
                    language === 'es' ? 'Buscar posiciones...' : 
                    language === 'fr' ? 'Rechercher des positions...' : 
                    'Positionen suchen...'
                  }
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                aria-label={
                  language === 'en' ? 'Refresh' : 
                  language === 'es' ? 'Actualizar' : 
                  language === 'fr' ? 'Rafraîchir' : 
                  'Aktualisieren'
                }
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              <Link href="/add-liquidity">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {language === 'en' ? 'New Position' : 
                   language === 'es' ? 'Nueva Posición' : 
                   language === 'fr' ? 'Nouvelle Position' : 
                   'Neue Position'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Position List */}
          {isLoadingPositions || isRefreshing ? (
            <div className="flex flex-col gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5">
                        <Skeleton className="h-5 w-36" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                      <Skeleton className="h-8 w-full" />
                      <div className="grid grid-cols-3 gap-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Skeleton className="h-9 w-28" />
                    <Skeleton className="h-9 w-28" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredPositions && filteredPositions.length > 0 ? (
            <div className="flex flex-col gap-6">
              {filteredPositions.map((position: any) => (
                <CollapsiblePositionCard 
                  key={position.id} 
                  position={position} 
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center">
              <CardContent className="pt-10 pb-10 flex flex-col items-center">
                <AlertCircle className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'en' ? 'No positions found' : 
                   language === 'es' ? 'No se encontraron posiciones' : 
                   language === 'fr' ? 'Aucune position trouvée' : 
                   'Keine Positionen gefunden'}
                </h3>
                {searchTerm || activeTab !== "all" ? (
                  <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    {language === 'en' 
                      ? 'No positions match your current filters. Try adjusting your search or changing the selected position type.' 
                      : language === 'es' 
                      ? 'Ninguna posición coincide con tus filtros actuales. Intenta ajustar tu búsqueda o cambiar el tipo de posición seleccionado.' 
                      : language === 'fr' 
                      ? 'Aucune position ne correspond à vos filtres actuels. Essayez d\'ajuster votre recherche ou de changer le type de position sélectionné.' 
                      : 'Keine Positionen entsprechen Ihren aktuellen Filtern. Versuchen Sie, Ihre Suche anzupassen oder den ausgewählten Positionstyp zu ändern.'}
                  </p>
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                    {language === 'en' 
                      ? "You don't have any active liquidity positions yet. Create your first position to start earning fees on Uniswap." 
                      : language === 'es' 
                      ? "Aún no tienes posiciones de liquidez activas. Crea tu primera posición para comenzar a ganar comisiones en Uniswap." 
                      : language === 'fr' 
                      ? "Vous n'avez pas encore de positions de liquidité actives. Créez votre première position pour commencer à gagner des frais sur Uniswap." 
                      : "Sie haben noch keine aktiven Liquiditätspositionen. Erstellen Sie Ihre erste Position, um mit dem Verdienen von Gebühren auf Uniswap zu beginnen."}
                  </p>
                )}
                <Link href="/add-liquidity">
                  <Button size="lg">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'en' 
                     ? 'Create Liquidity Position' 
                     : language === 'es' 
                     ? 'Crear Posición de Liquidez' 
                     : language === 'fr' 
                     ? 'Créer une Position de Liquidité' 
                     : 'Liquiditätsposition Erstellen'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
      
      {/* Wallet connection modal */}
      <ConnectModal />
    </>
  );
};

export default Positions;
