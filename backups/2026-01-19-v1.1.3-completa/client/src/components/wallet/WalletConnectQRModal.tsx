import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import QRCodeModal from '@walletconnect/qrcode-modal';

// Este componente abre el modal de WalletConnect con un QR dentro de nuestra UI
const WalletConnectQRModal = ({
  open,
  onClose,
  uri
}: {
  open: boolean;
  onClose: () => void;
  uri: string | null;
}) => {
  useEffect(() => {
    // Cuando se abre el modal con un URI, mostramos el QR
    if (open && uri) {
      try {
        // Mostramos el QR code nativo de WalletConnect
        QRCodeModal.open(uri, () => {
          console.log("QR modal closed");
          onClose();
        });
      } catch (error) {
        console.error("Error abriendo QRCodeModal:", error);
      }
    } else if (!open) {
      // Cerramos el QR code si el modal se cierra
      try {
        QRCodeModal.close();
      } catch (error) {
        console.error("Error cerrando QRCodeModal:", error);
      }
    }

    // Limpiar al desmontar
    return () => {
      try {
        QRCodeModal.close();
      } catch (error) {
        console.error("Error cerrando QRCodeModal en cleanup:", error);
      }
    };
  }, [open, uri, onClose]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Conectar con WalletConnect</DialogTitle>
        <div className="flex flex-col items-center justify-center p-6">
          {!uri ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
              <p>Generando código QR...</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Escanea el código QR con tu aplicación de WalletConnect para conectar tu wallet.
              </p>
              <div id="walletconnect-qr-container" className="w-64 h-64 bg-white p-4">
                {/* El QR se mostrará en un modal nativo de WalletConnect */}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectQRModal;