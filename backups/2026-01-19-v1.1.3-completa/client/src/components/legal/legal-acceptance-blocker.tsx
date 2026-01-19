import { useState } from "react";
import { useLegalTerms } from "@/hooks/use-legal-terms";
import { useWallet } from "@/hooks/use-wallet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Shield, FileText, Lock, AlertTriangle, Loader2, CheckCircle } from "lucide-react";
import { Link } from "wouter";

type LegalAcceptanceBlockerProps = {
  children: React.ReactNode;
};

export default function LegalAcceptanceBlocker({ children }: LegalAcceptanceBlockerProps) {
  const { account } = useWallet();
  const {
    hasAcceptedLegalTerms,
    isLoading,
    termsOfUseAccepted,
    privacyPolicyAccepted,
    disclaimerAccepted,
    acceptTermsOfUse,
    acceptPrivacyPolicy,
    acceptDisclaimer,
    submitLegalAcceptance,
    isSubmitting,
  } = useLegalTerms();

  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [hasReadDisclaimer, setHasReadDisclaimer] = useState(false);

  const allChecked = termsOfUseAccepted && privacyPolicyAccepted && disclaimerAccepted;
  const allRead = hasReadTerms && hasReadPrivacy && hasReadDisclaimer;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-slate-300">Verificando estado legal...</p>
        </div>
      </div>
    );
  }

  if (hasAcceptedLegalTerms) {
    return <>{children}</>;
  }

  const handleSubmit = async () => {
    if (allChecked) {
      await submitLegalAcceptance();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4" data-testid="legal-acceptance-blocker">
      <Card className="w-full max-w-2xl bg-slate-800/80 border-slate-700 shadow-2xl">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-amber-400" />
          </div>
          <CardTitle className="text-2xl text-white">Aceptación de Términos Legales</CardTitle>
          <CardDescription className="text-slate-300 text-base">
            Para continuar usando WayBank, debes leer y aceptar nuestros términos legales.
            Esto es obligatorio para cumplir con las regulaciones vigentes.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3" data-testid="terms-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <h4 className="text-white font-medium">Términos de Uso</h4>
                    <p className="text-slate-400 text-sm">Condiciones del servicio</p>
                  </div>
                </div>
                <Link href="/terms-of-use" target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHasReadTerms(true)}
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                    data-testid="button-read-terms"
                  >
                    Leer documento
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-600/50">
                <Checkbox
                  id="terms"
                  checked={termsOfUseAccepted}
                  onCheckedChange={() => {
                    setHasReadTerms(true);
                    acceptTermsOfUse();
                  }}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  data-testid="checkbox-terms"
                />
                <label
                  htmlFor="terms"
                  className={`text-sm ${hasReadTerms ? 'text-slate-200' : 'text-slate-500'}`}
                >
                  He leído y acepto los Términos de Uso
                  {hasReadTerms && <CheckCircle className="w-4 h-4 inline ml-2 text-green-400" />}
                </label>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3" data-testid="privacy-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <div>
                    <h4 className="text-white font-medium">Política de Privacidad</h4>
                    <p className="text-slate-400 text-sm">Protección de datos personales</p>
                  </div>
                </div>
                <Link href="/privacy-policy" target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHasReadPrivacy(true)}
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
                    data-testid="button-read-privacy"
                  >
                    Leer documento
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-600/50">
                <Checkbox
                  id="privacy"
                  checked={privacyPolicyAccepted}
                  onCheckedChange={() => {
                    setHasReadPrivacy(true);
                    acceptPrivacyPolicy();
                  }}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  data-testid="checkbox-privacy"
                />
                <label
                  htmlFor="privacy"
                  className={`text-sm ${hasReadPrivacy ? 'text-slate-200' : 'text-slate-500'}`}
                >
                  He leído y acepto la Política de Privacidad
                  {hasReadPrivacy && <CheckCircle className="w-4 h-4 inline ml-2 text-green-400" />}
                </label>
              </div>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4 space-y-3" data-testid="disclaimer-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <div>
                    <h4 className="text-white font-medium">Disclaimer</h4>
                    <p className="text-slate-400 text-sm">Aviso legal y riesgos</p>
                  </div>
                </div>
                <Link href="/disclaimer" target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHasReadDisclaimer(true)}
                    className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
                    data-testid="button-read-disclaimer"
                  >
                    Leer documento
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-600/50">
                <Checkbox
                  id="disclaimer"
                  checked={disclaimerAccepted}
                  onCheckedChange={() => {
                    setHasReadDisclaimer(true);
                    acceptDisclaimer();
                  }}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  data-testid="checkbox-disclaimer"
                />
                <label
                  htmlFor="disclaimer"
                  className={`text-sm ${hasReadDisclaimer ? 'text-slate-200' : 'text-slate-500'}`}
                >
                  He leído y acepto el Disclaimer
                  {hasReadDisclaimer && <CheckCircle className="w-4 h-4 inline ml-2 text-green-400" />}
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-600">
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6"
              onClick={handleSubmit}
              disabled={!allChecked || isSubmitting}
              data-testid="button-submit-legal"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Guardando aceptación...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Aceptar y Continuar al Dashboard
                </>
              )}
            </Button>

            {!allChecked && (
              <p className="text-center text-slate-400 text-sm mt-3">
                Debes leer y aceptar los 3 documentos para continuar
              </p>
            )}
          </div>

          <div className="text-center text-slate-500 text-xs pt-2">
            <p>Wallet conectada: {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'No conectada'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
