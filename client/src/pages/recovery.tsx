import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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

/**
 * Página de recuperación de wallet custodiado mediante frase semilla
 * Permite a los usuarios recuperar el acceso a sus carteras WayBank utilizando
 * la frase semilla de 12 palabras proporcionada durante el proceso de backup
 */
export default function Recovery() {
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
    if (words.length < 12) {
      setError(t.errorIncompleteSeedPhrase);
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
      // Enviar solicitud de recuperación
      const response = await apiRequest('POST', '/api/custodial-wallet/recover', {
        seedPhrase,
        newPassword: newPassword || undefined, // Solo enviar si existe
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: t.successTitle,
          description: t.successDescription,
          duration: 5000,
        });
        
        // Redireccionar al dashboard después de una recuperación exitosa
        setTimeout(() => {
          setLocation('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        {/* Columna informativa */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            {t.title}
          </h1>
          <p className="text-muted-foreground mb-4">
            {t.subtitle}
          </p>
          
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t.importantTitle}</AlertTitle>
            <AlertDescription>
              {t.importantDescription}
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col gap-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm">{t.securityPoint1}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <KeyRound className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm">{t.securityPoint2}</span>
            </div>
          </div>
        </div>
        
        {/* Formulario de recuperación */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t.cardTitle}</CardTitle>
            <CardDescription>
              {t.cardDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seedPhrase">{t.seedPhraseLabel}</Label>
                <Textarea
                  id="seedPhrase"
                  placeholder={t.seedPhrasePlaceholder}
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="flex items-center gap-1">
                  {t.newPasswordLabel} <span className="text-muted-foreground text-xs">{t.newPasswordOptional}</span>
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder={t.newPasswordPlaceholder}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              {newPassword && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t.confirmPasswordLabel}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t.errorTitle}</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? t.recoveringButton : t.recoverButton}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-6">
        <Button variant="link" onClick={() => setLocation('/')}>
          {t.backToHome}
        </Button>
      </div>
    </div>
  );
}