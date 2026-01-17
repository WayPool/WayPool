import React from "react";
import { useReferralsTranslations } from "@/hooks/use-referrals-translations";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { getRankInfo } from "./referral-rank";

interface RankBadgeProps {
  referralCount: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const RankBadge: React.FC<RankBadgeProps> = ({ 
  referralCount,
  size = "md",
  showLabel = false,
  className = "",
}) => {
  const rt = useReferralsTranslations();
  const rankInfo = getRankInfo(referralCount);
  const RankIcon = rankInfo.icon;
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };
  
  const badgeClasses = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-0.5 text-xs",
    lg: "px-2.5 py-1 text-sm",
  };
  
  const iconSize = sizeClasses[size];
  const badgeSize = badgeClasses[size];
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`${badgeSize} gap-1 font-medium border-primary/30 bg-primary/5 cursor-help ${className}`}
          >
            <RankIcon className={`${iconSize} ${rankInfo.color}`} />
            {showLabel && <span>{rt[rankInfo.name]}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs space-y-1">
            <p className="font-medium">{rt[rankInfo.name]} {rt.yourRank}</p>
            <p>{rt.totalReferred}: {referralCount}</p>
            <p>{rt.referralLevels}: {rankInfo.min === 1000 ? "1000+" : `${rankInfo.min}-${rankInfo.max}`}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default RankBadge;