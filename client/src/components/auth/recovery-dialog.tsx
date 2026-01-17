import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, ArrowRight, KeyRound, ShieldCheck } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from '@/lib/queryClient';
import { useTranslation } from '@/hooks/use-translation';
import { RecoveryTranslations, recoveryTranslations } from '@/translations/recovery';

interface RecoveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Diálogo de recuperación de wallet custodiado mediante frase semilla
 * Permite a los usuarios recuperar el acceso a sus carteras WayBank utilizando
 * la frase semilla de 12 palabras proporcionada durante el proceso de backup
 */
export default function RecoveryDialog({ open, onOpenChange }: RecoveryDialogProps) {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const { language } = useTranslation();
  
  // Obtener traducciones para el idioma actual
  const t: RecoveryTranslations = recoveryTranslations[language] || recoveryTranslations.es;

  // Limpiar el formulario cuando se cierra el diálogo
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSeedPhrase('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
    }
    onOpenChange(open);
  };

  // Manejar el envío del formulario de recuperación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    setError(null);
    
    if (!seedPhrase.trim()) {
      setError(t.errorEmptySeedPhrase);
      return;
    }
    
    // Verificar si la frase tiene aproximadamente 12 palabras (puede variar según el espaciado)
    const words = seedPhrase.trim().split(/\s+/);
    console.log('[RecoveryDialog] Detectadas palabras en frase semilla:', words.length);
    console.log('[RecoveryDialog] Primeras 3 palabras:', words.slice(0, 3).join(' '));
    
    if (words.length < 12) {
      setError(t.errorIncompleteSeedPhrase);
      return;
    }
    
    // Verificación adicional para asegurar que es una frase semilla válida
    console.log('[RecoveryDialog] Validación de formato de frase semilla');
    const allWordsAreSingleWords = words.every(word => /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]+$/.test(word));
    if (!allWordsAreSingleWords) {
      console.log('[RecoveryDialog] Error de formato: alguna palabra contiene caracteres inválidos');
      setError('La frase semilla contiene caracteres inválidos. Solo debe contener palabras.');
      return;
    }
    
    // Validar las contraseñas si se proporcionan
    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        setError(t.errorPasswordLength);
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError(t.errorPasswordMismatch);
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      console.log('Iniciando recuperación con frase semilla:', seedPhrase.substring(0, 10) + '...');
      
      // Enviar solicitud a la ruta específica del API con los datos completos
      const response = await fetch('/api/wallet/simple-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seedPhrase,
          newPassword: newPassword || undefined,
        }),
      });
      
      console.log('Respuesta recibida del servidor:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Recuperación exitosa. Wallet recuperado:', data.walletAddress);
        
        // Almacenar dirección en localStorage para mantener la sesión
        if (data.walletAddress) {
          localStorage.setItem('walletAddress', data.walletAddress);
          console.log('Dirección guardada en localStorage:', data.walletAddress);
        }
        
        toast({
          title: t.successTitle,
          description: t.successDescription,
          duration: 5000,
        });
        
        // Cerrar el diálogo
        handleOpenChange(false);
        
        // Redireccionar al dashboard después de una recuperación exitosa
        setTimeout(() => {
          console.log('Redirigiendo al dashboard...');
          setLocation('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Error de recuperación:', errorData);
        setError(errorData.error || 'Error al recuperar el wallet');
      }
    } catch (err) {
      console.error('Error al realizar la recuperación:', err);
      setError(t.errorConnection);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-w-[95vw] p-4 sm:p-6 border-slate-800 bg-slate-950 text-slate-100 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg text-slate-100">🔧 ARCHIVO CORRECTO - {t.title}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-slate-400">{t.subtitle}</DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 sm:gap-4 py-2">
          <Alert className="mb-1 sm:mb-2 p-3 sm:p-4 bg-blue-900/20 border-blue-800 text-slate-300">
            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
            <AlertTitle className="text-xs sm:text-sm font-medium">{t.importantTitle}</AlertTitle>
            <AlertDescription className="text-xs text-slate-400">
              {t.importantDescription}
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4 mb-1 sm:mb-2">
            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <div className="bg-blue-500/10 p-1.5 sm:p-2 rounded-full mt-0.5 sm:mt-0 flex-shrink-0">
                <ShieldCheck className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              </div>
              <span className="text-xs sm:text-sm text-slate-300">{t.securityPoint1}</span>
            </div>
            <div className="flex items-start sm:items-center gap-2 sm:gap-3">
              <div className="bg-blue-500/10 p-1.5 sm:p-2 rounded-full mt-0.5 sm:mt-0 flex-shrink-0">
                <KeyRound className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              </div>
              <span className="text-xs sm:text-sm text-slate-300">{t.securityPoint2}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="seedPhrase" className="text-xs sm:text-sm text-slate-300">{t.seedPhraseLabel}</Label>
              <Textarea
                id="seedPhrase"
                placeholder={t.seedPhrasePlaceholder}
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
                rows={3}
                className="resize-none bg-slate-900 border-slate-700 text-slate-100 text-xs sm:text-sm"
              />
            </div>
            
            <Separator className="bg-slate-800" />
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="newPassword" className="flex items-center gap-1 text-xs sm:text-sm text-slate-300">
                {t.newPasswordLabel} <span className="text-slate-500 text-[10px] sm:text-xs">{t.newPasswordOptional}</span>
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder={t.newPasswordPlaceholder}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-slate-900 border-slate-700 text-slate-100 text-xs sm:text-sm h-8 sm:h-10"
              />
            </div>
            
            {newPassword && (
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs sm:text-sm text-slate-300">{t.confirmPasswordLabel}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder={t.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-slate-100 text-xs sm:text-sm h-8 sm:h-10"
                />
              </div>
            )}
            
            {error && (
              <Alert variant="destructive" className="p-3 bg-red-900/40 text-rose-100 border-red-800">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <AlertTitle className="text-xs sm:text-sm">{t.errorTitle}</AlertTitle>
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-2 sm:mt-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto border-slate-700 hover:bg-slate-800 text-slate-300 bg-transparent text-xs sm:text-sm h-8 sm:h-10"
          >
            {t.cancel || "Cancelar"}
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-10"
          >
            {isLoading ? t.recoveringButton : t.recoverButton}
            {!isLoading && <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}