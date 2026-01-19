import React, { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useReferralsTranslations } from "@/hooks/use-referrals-translations";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatExactCurrency } from "@/lib/utils";
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  Activity,
  BarChart4,
  ArrowDownToLine
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { useWalletAddress } from "@/hooks/use-wallet-address";
import { toast } from "@/hooks/use-toast";

interface ReferralStatsProps {
  stats: {
    totalReferred: number;
    activeUsers: number;
    totalRewards: string;
    completionRate?: number;
  };
  targetInfo?: {
    currentLevel: number;
    nextLevel: number;
    progress: number;
    reward: string;
  };
}

/**
 * Componente para mostrar estadísticas y visualizaciones del programa de referidos
 */
const ReferralStats: React.FC<ReferralStatsProps> = ({ 
  stats = {
    totalReferred: 0,
    activeUsers: 0,
    totalRewards: "$0.00",
    completionRate: 0
  }, 
  targetInfo = { currentLevel: 1, nextLevel: 5, progress: 20, reward: "$50" } 
}) => {
  const { t } = useTranslation();
  const rt = useReferralsTranslations();
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { walletAddress } = useWalletAddress();
  
  // Asegurarse de que todos los valores existan y sean válidos
  const safeStats = {
    totalReferred: typeof stats.totalReferred === 'number' && !isNaN(stats.totalReferred) ? stats.totalReferred : 0,
    activeUsers: typeof stats.activeUsers === 'number' && !isNaN(stats.activeUsers) ? stats.activeUsers : 0,
    totalRewards: stats.totalRewards && typeof stats.totalRewards === 'string' ? stats.totalRewards : "$0.00",
    completionRate: typeof stats.completionRate === 'number' && !isNaN(stats.completionRate) ? stats.completionRate : 0
  };
  
  // Convertir la cadena de recompensas a un número para validaciones
  const rewardsValue = safeStats.totalRewards 
    ? parseFloat(safeStats.totalRewards.replace(/[^0-9.]/g, '')) || 0 
    : 0;
  
  // Protegemos contra NaN en caso de que el parseFloat falle
  const safeRewardsValue = isNaN(rewardsValue) ? 0 : rewardsValue;
  const canWithdraw = safeRewardsValue >= 100; // Mínimo 100 USDC para retirar
  
  const handleWithdraw = async () => {
    try {
      setIsProcessing(true);
      
      // Mostrar mensaje de que la funcionalidad está en desarrollo
      toast({
        title: rt.featureInDevelopment,
        description: rt.withdrawalFeatureComingSoon,
        variant: "default",
      });
      
      // Cerrar el diálogo
      setWithdrawalDialogOpen(false);
    } catch (error) {
      console.error("Error al procesar el retiro:", error);
      toast({
        title: rt.withdrawalFailed,
        description: rt.withdrawalProcessingError,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Diálogo de confirmación de retiro */}
      <Dialog open={withdrawalDialogOpen} onOpenChange={setWithdrawalDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{rt.confirmWithdrawal}</DialogTitle>
            <DialogDescription>
              {rt.confirmWithdrawalMessage}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-muted">
              <div className="text-sm text-muted-foreground">{rt.amountToWithdraw}:</div>
              <div className="text-sm font-medium text-right">{safeStats.totalRewards}</div>
              
              <div className="text-sm text-muted-foreground">{rt.withdrawalCurrency}:</div>
              <div className="text-sm font-medium text-right">USDC</div>
              
              <div className="text-sm text-muted-foreground">{rt.receivingWallet}:</div>
              <div className="text-sm font-medium text-right truncate" title={walletAddress || ""}>
                {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : '-'}
              </div>
            </div>
            
            {!canWithdraw ? (
              <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-destructive mr-2 mt-0.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <div>
                    <p className="font-medium text-sm text-destructive">{rt.minimumBalanceNotMet}</p>
                    <p className="text-xs text-destructive/80 mt-1">
                      {rt.withdrawalMinimumBalance} {safeStats.totalRewards}.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-100 dark:bg-amber-950 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                <p className="text-xs text-amber-800 dark:text-amber-400">
                  {rt.withdrawalNote}
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex flex-row items-center gap-2 sm:justify-between">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {rt.cancel}
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              variant="default"
              onClick={handleWithdraw}
              disabled={isProcessing || !canWithdraw}
              className="flex items-center gap-1"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {rt.processing}...
                </>
              ) : (
                <>
                  <ArrowDownToLine className="h-4 w-4" />
                  {rt.confirmAndWithdraw}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tarjetas de estadísticas principales */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-primary/10 shadow-md bg-gradient-to-br from-card to-card/90">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{rt.totalReferred}</p>
                <p className="text-2xl font-bold">{safeStats.totalReferred}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            {safeStats.totalReferred > 0 && (
              <div className="mt-3 flex items-center text-xs text-emerald-500">
                <TrendingUp size={12} className="mr-1" />
                <span>{rt.activeProgram || "Active program"}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 shadow-md bg-gradient-to-br from-card to-card/90">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{rt.activeUsers}</p>
                <p className="text-2xl font-bold">{safeStats.activeUsers}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
            </div>
            {safeStats.totalReferred > 0 && (
              <div className="mt-3 flex items-center text-xs">
                <div className="bg-muted w-full h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ 
                      width: safeStats.totalReferred > 0 ? `${(safeStats.activeUsers / safeStats.totalReferred) * 100}%` : '0%'
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-muted-foreground">
                  {safeStats.totalReferred > 0 ? Math.round((safeStats.activeUsers / safeStats.totalReferred) * 100) : 0}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 shadow-md bg-gradient-to-br from-card to-card/90">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{rt.totalRewards}</p>
                <p className="text-2xl font-bold">{safeStats.totalRewards}</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {rt.accumulatedEarnings}
                </span>
                {canWithdraw && (
                  <span className="inline-flex items-center rounded-md bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 animate-pulse">
                    {rt.noRewardsAvailable}
                  </span>
                )}
              </div>
              <div className="flex justify-end">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full h-10 gap-2 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setWithdrawalDialogOpen(true)}
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  {rt.withdraw}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 shadow-md bg-gradient-to-br from-card to-card/90">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{rt.yourBenefit}</p>
                <p className="text-2xl font-bold">1%</p>
              </div>
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart4 className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {rt.ofAllReturns}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tarjeta de progreso hacia la siguiente meta */}
      {targetInfo && (
        <Card className="border-primary/10 shadow-md bg-gradient-to-br from-card to-card/90">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{rt.nextMilestone}</h3>
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-muted-foreground">{rt.current}</p>
                  <p className="text-lg font-bold flex items-center">
                    <Users className="h-4 w-4 mr-1 text-primary" />
                    {safeStats.totalReferred} {rt.referredUsers}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">{rt.nextRank}</p>
                  <p className="text-lg font-bold flex items-center justify-end">
                    {targetInfo.nextLevel} {rt.referredUsers}
                    <Users className="h-4 w-4 ml-1 text-primary" />
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{rt.progressThroughRanks}</span>
                  <span className="font-medium">{targetInfo.progress}%</span>
                </div>
                <Progress value={targetInfo.progress} className="h-2" />
              </div>
              
              <div className="flex justify-between items-center bg-primary/5 rounded-lg p-3 border border-primary/10">
                <div>
                  <p className="text-sm text-muted-foreground">{rt.rankGivesYou}</p>
                  <p className="text-lg font-bold text-primary">{targetInfo.reward}</p>
                </div>
                <div className="text-sm">
                  {rt.usersNeeded
                    .replace("{count}", String(Math.max(0, targetInfo.nextLevel - safeStats.totalReferred)))
                    .replace("{rank}", String(targetInfo.nextLevel))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReferralStats;