import React from "react";
import { useReferralsTranslations } from "@/hooks/use-referrals-translations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ReferralRank from "./referral-rank";
import { Progress } from "@/components/ui/progress";
import { getNextRankInfo, getRankInfo, getRankProgress } from "./referral-rank";
import { Trophy, Sparkles } from "lucide-react";

interface ReferralRankSectionProps {
  referralCount: number;
}

/**
 * Componente que muestra la sección completa de ranking de referidos
 */
const ReferralRankSection: React.FC<ReferralRankSectionProps> = ({ 
  referralCount = 0
}) => {
  const rt = useReferralsTranslations();
  const currentRank = getRankInfo(referralCount);
  const nextRank = getNextRankInfo(referralCount);
  const progress = getRankProgress(referralCount);
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{rt.yourReferralRank}</h2>
          <p className="text-muted-foreground mt-1">
            {rt.keepInvitingFriends}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ReferralRank 
          referralCount={referralCount} 
          showLargeIcon={true} 
        />
        
        {/* Tarjeta de beneficios del rango */}
        <Card className="border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {rt.rankBenefits}
            </CardTitle>
            <CardDescription>
              {rt.unlockSpecialPerks}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Rookie Benefits */}
              <Card className={`border-green-500/20 ${currentRank.name === "Rookie" ? "bg-green-500/5" : "bg-card"}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{rt.Rookie}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• {rt.onePercentRewards}</p>
                  <p>• {rt.basicDashboardAccess}</p>
                  <p>• {rt.standardSupport}</p>
                </CardContent>
              </Card>
              
              {/* Advanced Benefits */}
              <Card className={`border-blue-500/20 ${["Cat", "Dog", "Sentinel"].includes(currentRank.name) ? "bg-blue-500/5" : "bg-card"}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{rt.Advanced}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• {rt.onePointFivePercentRewards}</p>
                  <p>• {rt.prioritySupport}</p>
                  <p>• {rt.exclusiveWebinars}</p>
                </CardContent>
              </Card>
              
              {/* Elite Benefits */}
              <Card className={`border-purple-500/20 ${["Phoenix", "Legend", "Champion"].includes(currentRank.name) ? "bg-purple-500/5" : "bg-card"}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{rt.Elite}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• {rt.twoPercentRewards}</p>
                  <p>• {rt.vipSupport}</p>
                  <p>• {rt.earlyAccess}</p>
                </CardContent>
              </Card>
            </div>
            
            {nextRank ? (
              <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span>{rt.nextMilestone}: <strong>{nextRank.name}</strong> ({nextRank.min} {rt.referrals})</span>
                  </div>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground pt-1">
                  {rt.youNeed} {nextRank.min - referralCount} {rt.moreReferralsToAdvance}
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20 text-center">
                <Sparkles className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="font-medium">
                  {rt.congratsHighestRank}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {rt.enjoyChampionBenefits}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferralRankSection;