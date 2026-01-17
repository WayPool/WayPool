import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

/**
 * Botón básico de wallet que no realiza ninguna conexión ni redirección
 * Utilizado para mantener la interfaz consistente cuando se usa el modo sin wallet
 */
export function BasicConnectButton() {
  return (
    <Button
      variant="default"
      size="sm"
      className="relative flex items-center gap-2 px-3 py-1 h-9"
      disabled={true}
    >
      <Wallet className="h-4 w-4" />
      <span>Wallet desactivado</span>
    </Button>
  );
}

export default BasicConnectButton;