import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useReferralsTranslations } from "@/hooks/use-referrals-translations";
import { useToast } from "@/hooks/use-toast";
import { Button, ButtonProps } from "@/components/ui/button";
import { Download } from "lucide-react";

interface WithdrawRewardsButtonProps extends ButtonProps {
  rewards: string;
  walletAddress: string | null;
}

const WithdrawRewardsButton: React.FC<WithdrawRewardsButtonProps> = ({
  rewards,
  walletAddress,
  ...props
}) => {
  const rt = useReferralsTranslations();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  // Comprobar si hay recompensas para retirar
  const rewardsValue = parseFloat(rewards);
  const hasRewards = !isNaN(rewardsValue) && rewardsValue > 0;

  // Función para manejar el retiro de recompensas
  const handleWithdraw = async () => {
    if (!hasRewards) {
      toast({
        title: rt.noRewardsAvailable,
        description: rt.noRewardsToWithdraw,
        variant: "destructive",
      });
      return;
    }

    if (!walletAddress) {
      toast({
        title: rt.walletNotConnected,
        description: rt.connectWalletToWithdraw,
        variant: "destructive",
      });
      return;
    }

    setIsPending(true);

    try {
      // Por ahora, solo simularemos el retiro
      // En una implementación real, aquí iría la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: rt.withdrawalSuccessful,
        description: rt.rewardsSentToWallet,
      });

      // Refresca los datos después del retiro
      queryClient.invalidateQueries({ queryKey: ['/api/referrals', walletAddress] });
    } catch (error) {
      toast({
        title: rt.error,
        description: rt.withdrawalError,
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={!hasRewards || isPending}
      onClick={handleWithdraw}
      className="gap-1"
      {...props}
    >
      <Download size={16} />
      {isPending ? rt.withdrawing : rt.withdraw}
    </Button>
  );
};

export default WithdrawRewardsButton;