import React from "react";
import { useReferralsTranslations } from "@/hooks/use-referrals-translations";
import { ReferralsTranslations } from "@/translations/referrals";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Bird, 
  Rabbit, 
  Cat, 
  Dog, 
  ShieldAlert, 
  Flame, 
  ChevronUp, 
  Award, 
  Crown, 
  Trophy, 
  Medal, 
  Sparkles 
} from "lucide-react";

/**
 * Función auxiliar para obtener la traducción de un rango por nombre
 * @param rt Objeto de traducciones de referidos
 * @param rankName Nombre del rango en inglés (Rookie, Rabbit, etc.)
 * @returns La traducción correspondiente al rango
 */
const getRankTranslation = (rt: ReferralsTranslations, rankName: string): string => {
  switch (rankName) {
    case "Rookie": return rt.Rookie;
    case "Rabbit": return rt.Rabbit;
    case "Cat": return rt.Cat;
    case "Dog": return rt.Dog;
    case "Sentinel": return rt.Sentinel;
    case "Phoenix": return rt.Phoenix;
    case "Legend": return rt.Legend;
    case "Champion": return rt.Champion;
    case "Advanced": return rt.Advanced;
    case "Elite": return rt.Elite;
    default: return rankName; // Fallback al nombre original
  }
};

// Definición de los niveles de referidos
export const referralRankLevels = [
  { min: 0, max: 10, name: "Rookie", icon: Bird, color: "text-green-500" },
  { min: 11, max: 25, name: "Rabbit", icon: Rabbit, color: "text-blue-400" },
  { min: 26, max: 50, name: "Cat", icon: Cat, color: "text-orange-500" },
  { min: 51, max: 100, name: "Dog", icon: Dog, color: "text-indigo-500" },
  { min: 101, max: 250, name: "Sentinel", icon: ShieldAlert, color: "text-yellow-500" },
  { min: 251, max: 500, name: "Phoenix", icon: Flame, color: "text-amber-600" },
  { min: 501, max: 999, name: "Legend", icon: Medal, color: "text-purple-600" },
  { min: 1000, max: Infinity, name: "Champion", icon: Crown, color: "text-rose-500" }
];

// Función para determinar el nivel basado en el número de referidos
export const getRankInfo = (referralCount: number) => {
  for (const level of referralRankLevels) {
    if (referralCount >= level.min && referralCount <= level.max) {
      return level;
    }
  }
  return referralRankLevels[0]; // Valor por defecto
};

// Función para obtener el próximo nivel
export const getNextRankInfo = (referralCount: number) => {
  const currentRank = getRankInfo(referralCount);
  const currentIndex = referralRankLevels.findIndex(level => level.name === currentRank.name);
  
  if (currentIndex < referralRankLevels.length - 1) {
    return referralRankLevels[currentIndex + 1];
  }
  
  return null; // Ya está en el máximo nivel
};

// Función para calcular el progreso hacia el próximo nivel
export const getRankProgress = (referralCount: number) => {
  const currentRank = getRankInfo(referralCount);
  const nextRank = getNextRankInfo(referralCount);
  
  if (!nextRank) return 100; // Ya está en el máximo nivel
  
  const totalToNextLevel = nextRank.min - currentRank.min;
  const progressToNextLevel = referralCount - currentRank.min;
  
  return Math.min(Math.round((progressToNextLevel / totalToNextLevel) * 100), 100);
};

interface ReferralRankProps {
  referralCount: number;
  showLargeIcon?: boolean;
}

const ReferralRank: React.FC<ReferralRankProps> = ({ 
  referralCount,
  showLargeIcon = false
}) => {
  const rt = useReferralsTranslations();
  const currentRank = getRankInfo(referralCount);
  const nextRank = getNextRankInfo(referralCount);
  const progress = getRankProgress(referralCount);
  
  const RankIcon = currentRank.icon;
  
  return (
    <Card className="shadow-md border-primary/10">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          {rt.yourRank}
        </CardTitle>
        <CardDescription>
          {rt.progressThroughRanks}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Icono grande del nivel actual */}
          <div className={`flex flex-col items-center justify-center ${showLargeIcon ? 'w-32 h-32' : 'w-24 h-24'} bg-primary/5 rounded-full border border-primary/10`}>
            <RankIcon className={`${showLargeIcon ? 'h-16 w-16' : 'h-12 w-12'} ${currentRank.color}`} />
            <div className="mt-2 font-medium text-center">
              <div className="text-sm text-muted-foreground">{rt.yourRank}</div>
              <div className="text-base">
                {/* Utilizamos un operador ternario para acceder a la propiedad de traducción correspondiente */}
                {getRankTranslation(rt, currentRank.name)}
              </div>
            </div>
          </div>
          
          {/* Información del progreso */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span className="font-medium">{referralCount} {rt.referrals}</span>
                {nextRank && (
                  <span className="text-muted-foreground">
                    {rt.nextRank}: {getRankTranslation(rt, nextRank.name)} ({nextRank.min})
                  </span>
                )}
              </div>
              <Progress 
                value={progress} 
                className="h-2 bg-primary/10" 
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-muted-foreground">
                  {progress}% {rt.nextMilestone}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              {nextRank ? (
                <div className="text-sm">
                  <span className="text-muted-foreground">
                    {rt.usersNeeded.replace(
                      '{count}', 
                      String(nextRank.min - referralCount)
                    ).replace(
                      '{rank}', 
                      getRankTranslation(rt, nextRank.name)
                    )} {rt.inviteMoreFriends}
                  </span>
                </div>
              ) : (
                <div className="text-sm flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium text-primary">
                    {rt.noLimits}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Todos los niveles */}
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">{rt.referralLevels}</h4>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {referralRankLevels.map((level) => {
              const LevelIcon = level.icon;
              const isCurrentLevel = level.name === currentRank.name;
              
              return (
                <TooltipProvider key={level.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`flex flex-col items-center p-2 rounded-lg ${
                          isCurrentLevel 
                            ? 'bg-primary/10 border border-primary/20' 
                            : 'hover:bg-muted/50 cursor-help'
                        }`}
                      >
                        <LevelIcon className={`h-6 w-6 ${level.color} ${
                          isCurrentLevel ? '' : 'opacity-70'
                        }`} />
                        <span className={`text-xs mt-1 ${
                          isCurrentLevel ? 'font-medium' : 'text-muted-foreground'
                        }`}>
                          {getRankTranslation(rt, level.name)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <div className="text-xs">
                        <p className="font-medium">
                          {getRankTranslation(rt, level.name)} {rt.yourRank}
                        </p>
                        <p>{rt.usersNeeded}: {level.min === 1000 ? "1000+" : `${level.min}-${level.max}`}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralRank;