import React from "react";
import { useReferralsTranslations } from "@/hooks/use-referrals-translations";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Users, 
  ChartBar, 
  Gift, 
  Zap
} from "lucide-react";

/**
 * Componente que muestra los beneficios del programa de referidos
 * de una manera atractiva y visualmente impactante
 */
const BenefitsShowcase: React.FC = () => {
  const rt = useReferralsTranslations();
  
  // Lista de beneficios destacados
  const benefits = [
    {
      id: 1,
      title: rt.passiveIncomeStream,
      description: rt.earnWhileFriendsEarn,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      id: 2,
      title: rt.aprBoost,
      description: rt.aprBoostDescription1,
      icon: Sparkles,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      id: 3,
      title: rt.noLimits,
      description: rt.noReferredUsersYet,
      icon: ChartBar,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20"
    },
    {
      id: 4,
      title: rt.networkEffect,
      description: rt.earningsGrow,
      icon: Users,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20"
    },
    {
      id: 5,
      title: rt.instantRewards,
      description: rt.passiveIncomeContinues,
      icon: Zap,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20"
    },
    {
      id: 6,
      title: rt.winWinSystem,
      description: rt.noHiddenConditions,
      icon: Gift,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10",
      borderColor: "border-teal-500/20"
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold">{rt.benefitsTitle}</h2>
        <p className="text-muted-foreground">
          {rt.benefitsDescription}
        </p>
      </div>
      
      {/* Beneficios destacados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {benefits.map(benefit => (
          <Card 
            key={benefit.id} 
            className={`border ${benefit.borderColor} shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
          >
            <CardContent className="pt-6">
              <div className={`w-12 h-12 rounded-full ${benefit.bgColor} flex items-center justify-center mb-4`}>
                <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Sección de seguridad y transparencia */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-8">
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">{rt.secureTransparent}</h3>
            <p className="text-muted-foreground">
              {rt.e2eEncryption}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="bg-background/50 border border-border rounded-lg p-3">
                <h4 className="font-medium text-sm">{rt.blockchainVerified}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {rt.militarySecurity}
                </p>
              </div>
              
              <div className="bg-background/50 border border-border rounded-lg p-3">
                <h4 className="font-medium text-sm">{rt.automaticDistribution}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {rt.compatibleWallets}
                </p>
              </div>
              
              <div className="bg-background/50 border border-border rounded-lg p-3">
                <h4 className="font-medium text-sm">{rt.noHiddenConditions}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {rt.walletCompatibilityDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsShowcase;