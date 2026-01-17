import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ExternalLink, Info, Globe } from "lucide-react";
import { Link } from "wouter";
import { useLegalTerms } from "@/hooks/use-legal-terms";
import { useLanguage, Language, languageNames } from "@/context/language-context";
import legalTranslations from "@/translations/legal-terms";

export interface LegalTermsDialogProps {
  walletAddress: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LegalTermsDialog({ 
  walletAddress,
  open, 
  onOpenChange 
}: LegalTermsDialogProps) {
  const [activeTab, setActiveTab] = useState("terms");
  const [canClose, setCanClose] = useState(false);
  const { language, setLanguage } = useLanguage();
  const t = legalTranslations[language]; // Obtener las traducciones para el idioma actual
  
  const { 
    hasAcceptedLegalTerms,
    termsOfUseAccepted,
    privacyPolicyAccepted,
    disclaimerAccepted,
    acceptTermsOfUse,
    acceptPrivacyPolicy,
    acceptDisclaimer,
    submitLegalAcceptance,
    isSubmitting
  } = useLegalTerms();
  
  // Verificar si el diálogo debe mostrarse o cerrarse, con un proceso más robusto
  // para evitar cualquier parpadeo o aparición innecesaria del diálogo
  useEffect(() => {
    // Utilizamos un pequeño retraso para asegurar que todas las verificaciones se completen
    const verificationTimer = setTimeout(() => {
      // 1. Si los términos ya están aceptados en la base de datos, permitir cerrar pero NO cerrar automáticamente
      if (hasAcceptedLegalTerms) {
        setCanClose(true);
        console.log("Términos ya aceptados, pero NO cerramos el diálogo automáticamente");
        // CAMBIO CRÍTICO: Eliminar cierre automático:
        // onOpenChange(false); 
        return;
      }
      
      // 2. Verificar si hay aceptación en localStorage
      try {
        if (walletAddress) {
          const localStorageKey = `waybank_legal_accepted_${walletAddress.toLowerCase()}`;
          const localStorageAccepted = localStorage.getItem(localStorageKey) === "true";
          
          if (localStorageAccepted) {
            setCanClose(true);
            console.log("Términos ya aceptados en localStorage, pero NO cerramos automáticamente");
            // CAMBIO CRÍTICO: Eliminar cierre automático:
            // onOpenChange(false);
            return;
          }
        }
      } catch (e) {
        console.warn("Error al verificar localStorage:", e);
      }
      
      // 3. Si no hay aceptación en ninguna fuente, no permitir cerrar
      setCanClose(false);
    }, 500); // Delay de 500ms para evitar parpadeos
    
    return () => clearTimeout(verificationTimer);
  }, [hasAcceptedLegalTerms, walletAddress, onOpenChange]);
  
  // Variable para rastrear si se ha realizado la aceptación exitosa de términos
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] = useState(false);
  
  // Verificación adicional de aceptación de términos en localStorage
  const checkLocalStorageForLegalTerms = useCallback(() => {
    if (!walletAddress) return false;
    
    try {
      // Verificar si el usuario ya ha aceptado los términos en localStorage
      const legalAcceptedKey = `waybank_legal_accepted_${walletAddress.toLowerCase()}`;
      return localStorage.getItem(legalAcceptedKey) === "true";
    } catch (e) {
      console.warn("Error al verificar localStorage para términos legales:", e);
      return false;
    }
  }, [walletAddress]);
  
  // Estado derivado: términos aceptados SOLO si ya están confirmados en la base de datos o localStorage
  // NUNCA considerar los checkbox locales como aceptación completa (esto evita cierre automático)
  const isTermsAccepted = useMemo(() => {
    // IMPORTANTE: No tomamos en cuenta los checkboxes que el usuario está marcando actualmente
    // para decidir si los términos están aceptados. Solo consideramos lo que dice la BD o el localStorage.
    const termsPreviouslyAccepted = hasAcceptedLegalTerms || checkLocalStorageForLegalTerms() || hasSubmittedSuccessfully;
    console.log("Estado de términos legales:", { 
      hasAcceptedLegalTerms, 
      localStorageAccepted: checkLocalStorageForLegalTerms(), 
      hasSubmittedSuccessfully,
      termsPreviouslyAccepted
    });
    return termsPreviouslyAccepted;
  }, [hasAcceptedLegalTerms, checkLocalStorageForLegalTerms, hasSubmittedSuccessfully]);
  
  // Manejo mejorado del estado del diálogo para priorizar la experiencia del usuario
  useEffect(() => {
    // REGLA CRÍTICA: Si ya se han aceptado todos los términos legales, permitir cerrar el diálogo
    // PERO NO cerrarlo automáticamente en ningún caso
    if (isTermsAccepted) {
      setCanClose(true);
      
      // CAMBIO CRÍTICO: Ya NO cerramos el diálogo automáticamente aunque los términos estén aceptados
      // Esto garantiza que el diálogo solo se cierre cuando el usuario haga clic en el botón
      // "Confirmar y Continuar" o use el botón X explícitamente
      
      // Eliminado:
      // if (open) {
      //   console.log("Términos ya aceptados, cerrando diálogo automáticamente");
      //   onOpenChange(false);
      // }
      return;
    }
    
    // CAMBIO CRÍTICO: NUNCA abrir el diálogo automáticamente
    // Dejamos que solo el Layout controle cuándo mostrar el diálogo
    // Eliminamos el código anterior que intentaba abrir automáticamente el diálogo
    
    // NOTA IMPORTANTE: Este código fue eliminado porque estaba causando
    // que el diálogo se abriera brevemente al iniciar sesión:
    //
    // if (!isTermsAccepted && !open && !canClose) {
    //   onOpenChange(true);
    // }
  }, [isTermsAccepted]);
  
  // Manejar el intento de cierre del diálogo
  const handleOpenChange = (newOpen: boolean) => {
    if (canClose || newOpen || hasSubmittedSuccessfully) {
      onOpenChange(newOpen);
    } else {
      // No permitir cerrar si no se han aceptado los términos
      onOpenChange(true);
    }
  };
  
  // Enviar la aceptación de todos los términos legales
  const handleAcceptAll = async () => {
    if (termsOfUseAccepted && privacyPolicyAccepted && disclaimerAccepted) {
      try {
        console.log("Iniciando proceso de aceptación de términos legales...");
        await submitLegalAcceptance();
        console.log("Términos legales aceptados correctamente");
        
        // Marcar que hemos aceptado los términos exitosamente para evitar que el diálogo se reabra
        setHasSubmittedSuccessfully(true);
        
        // Permitir cerrar el diálogo
        setCanClose(true);
        
        // Almacenar en localStorage inmediatamente que se han aceptado los términos
        try {
          localStorage.setItem(`waybank_legal_accepted_${walletAddress.toLowerCase()}`, "true");
          console.log("Estado de aceptación guardado en localStorage");
        } catch (e) {
          console.warn("No se pudo guardar estado de aceptación en localStorage:", e);
        }
        
        // IMPORTANTE: Cerramos el diálogo automáticamente después de aceptar los términos
        // y guardar en la base de datos
        setTimeout(() => {
          console.log("Cerrando diálogo de términos legales después de aceptación exitosa");
          onOpenChange(false);
        }, 800);
        
      } catch (error: any) {
        console.error("Error en la aceptación de términos legales:", error);
        alert(`Error al aceptar términos legales: ${error.message || 'Error desconocido'}`);
      }
    } else {
      console.warn("Intento de aceptar términos sin todos los checkboxes marcados");
    }
  };
  
  // Comprobamos si todos los checkboxes están marcados, pero esto NO indica aceptación oficial
  // Solo se considera aceptado oficialmente cuando se guarda en la base de datos
  const allCheckboxesMarked = termsOfUseAccepted && privacyPolicyAccepted && disclaimerAccepted;
  
  // Registrar los cambios de estado para depuración
  useEffect(() => {
    console.log("Estado de los checkboxes:", {
      termsOfUseAccepted,
      privacyPolicyAccepted,
      disclaimerAccepted,
      allCheckboxesMarked
    });
  }, [termsOfUseAccepted, privacyPolicyAccepted, disclaimerAccepted]);
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] h-auto w-[94vw] sm:w-[85vw] md:w-[80vw] flex flex-col p-3 sm:p-6 overflow-hidden" hideCloseButton>
        <DialogHeader className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
          <div>
            <DialogTitle className="text-lg sm:text-2xl">{t.dialogTitle}</DialogTitle>
            <DialogDescription className="text-xs sm:text-base">
              {t.dialogSubtitle}
            </DialogDescription>
          </div>
          
          {/* Selector de idioma */}
          <div className="flex items-center gap-2 self-end sm:self-start">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
              <SelectTrigger className="w-[110px] sm:w-[130px] text-sm">
                <SelectValue placeholder="Idioma" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languageNames).map(([code, name]) => (
                  <SelectItem key={code} value={code}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        
        <Alert className="my-1 border-yellow-500 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-xs sm:text-sm">
            {t.warningMessage}
          </AlertDescription>
        </Alert>
        
        {/* Contenido principal - con altura reducida y scroll vertical */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(60vh - 120px)' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex flex-wrap sm:flex-nowrap gap-1 sm:gap-0 sticky top-0 z-10 bg-background">
              <TabsTrigger value="terms" className="flex-1 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2">
                {t.termsOfUseTab}
                {termsOfUseAccepted && <span className="ml-1 sm:ml-2 text-green-500">✓</span>}
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex-1 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2">
                {t.privacyPolicyTab}
                {privacyPolicyAccepted && <span className="ml-1 sm:ml-2 text-green-500">✓</span>}
              </TabsTrigger>
              <TabsTrigger value="disclaimer" className="flex-1 text-xs sm:text-sm px-2 py-1 sm:px-4 sm:py-2">
                {t.disclaimerTab}
                {disclaimerAccepted && <span className="ml-1 sm:ml-2 text-green-500">✓</span>}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="terms" className="mt-2 sm:mt-4 border rounded-md p-2 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold">{t.termsOfUseTitle}</h3>
                <div className="whitespace-pre-line text-sm">
                  {t.termsContent}
                </div>
                
                <p className="text-xs text-muted-foreground mt-2 sm:mt-4">
                  {language === "es" 
                    ? "Al hacer clic en \"Acepto los Términos de Uso\" a continuación, reconoce que ha leído estos términos."
                    : language === "en" 
                      ? "By clicking \"I accept the Terms of Use\" below, you acknowledge that you have read these terms."
                      : language === "fr"
                        ? "En cliquant sur \"J'accepte les Conditions d'Utilisation\" ci-dessous, vous reconnaissez avoir lu ces conditions."
                        : language === "de"
                          ? "Indem Sie unten auf \"Ich akzeptiere die Nutzungsbedingungen\" klicken, bestätigen Sie, diese Bedingungen gelesen zu haben."
                          : language === "it"
                            ? "Facendo clic su \"Accetto i Termini di Utilizzo\" qui sotto, riconosci di aver letto questi termini."
                            : language === "pt"
                              ? "Ao clicar em \"Aceito os Termos de Uso\" abaixo, você reconhece que leu estes termos."
                              : language === "ar"
                                ? "بالنقر على \"أوافق على شروط الاستخدام\" أدناه، فإنك تقر بأنك قد قرأت هذه الشروط."
                                : language === "hi"
                                  ? "नीचे \"मैं उपयोग की शर्तों को स्वीकार करता हूं\" पर क्लिक करके, आप स्वीकार करते हैं कि आपने इन नियमों को पढ़ लिया है।"
                                  : language === "zh"
                                    ? "通过点击下面的\"我接受使用条款\"，您确认您已阅读这些条款。"
                                    : "Al hacer clic en \"Acepto los Términos de Uso\" reconoce que ha leído estos términos."
                  }
                </p>
              </div>
              
              <div className="flex items-start space-x-2 mt-4">
                <Checkbox 
                  id="terms" 
                  checked={termsOfUseAccepted} 
                  onCheckedChange={() => acceptTermsOfUse()}
                  className="mt-1 flex-shrink-0"
                />
                <Label htmlFor="terms" className="font-medium text-sm leading-tight">
                  {t.acceptTermsOfUse}
                </Label>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                <Link href="/terms-of-use" target="_blank" className="flex items-center hover:underline">
                  {t.viewFullTerms} <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="mt-2 sm:mt-4 border rounded-md p-2 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold">{t.privacyPolicyTitle}</h3>
                <div className="whitespace-pre-line text-sm">
                  {t.privacyContent}
                </div>
                
                <p className="text-xs text-muted-foreground mt-2 sm:mt-4">
                  {language === "es" 
                    ? "Al hacer clic en \"Acepto la Política de Privacidad\" reconoce que ha leído nuestras prácticas de datos."
                    : language === "en" 
                      ? "By clicking \"I accept the Privacy Policy\" you acknowledge that you have read our data practices."
                      : language === "fr"
                        ? "En cliquant sur \"J'accepte la Politique de Confidentialité\" vous reconnaissez avoir lu nos pratiques."
                        : language === "de"
                          ? "Mit dem Klick auf \"Ich akzeptiere die Datenschutzrichtlinie\" bestätigen Sie, unsere Datenpraktiken gelesen zu haben."
                          : language === "it"
                            ? "Cliccando su \"Accetto la Politica sulla Privacy\" riconosci di aver letto le nostre pratiche sui dati."
                            : language === "pt"
                              ? "Ao clicar em \"Aceito a Política de Privacidade\" você reconhece que leu nossas práticas de dados."
                              : language === "ar"
                                ? "بالنقر على \"أوافق على سياسة الخصوصية\" فإنك تقر بأنك قد قرأت ممارسات البيانات لدينا."
                                : language === "hi"
                                  ? "\"मैं गोपनीयता नीति को स्वीकार करता हूं\" पर क्लिक करके, आप स्वीकार करते हैं कि आपने हमारी डेटा प्रथाओं को पढ़ लिया है।"
                                  : language === "zh"
                                    ? "点击\"我接受隐私政策\"，您确认已阅读我们的数据做法。"
                                    : "Al hacer clic en \"Acepto la Política de Privacidad\" reconoce que ha leído nuestras prácticas de datos."
                  }
                </p>
              </div>
              
              <div className="flex items-start space-x-2 mt-4">
                <Checkbox 
                  id="privacy" 
                  checked={privacyPolicyAccepted} 
                  onCheckedChange={() => acceptPrivacyPolicy()}
                  className="mt-1 flex-shrink-0"
                />
                <Label htmlFor="privacy" className="font-medium text-sm leading-tight">
                  {t.acceptPrivacyPolicy}
                </Label>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                <Link href="/privacy-policy" target="_blank" className="flex items-center hover:underline">
                  {t.viewFullPrivacy} <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="disclaimer" className="mt-2 sm:mt-4 border rounded-md p-2 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-lg sm:text-xl font-semibold">{t.disclaimerTitle}</h3>
                <div className="whitespace-pre-line text-sm">
                  {t.disclaimerContent}
                </div>
                
                <p className="text-xs text-muted-foreground mt-2 sm:mt-4">
                  {language === "es" 
                    ? "Al hacer clic en \"Acepto el Aviso Legal\" reconoce que ha leído las condiciones."
                    : language === "en" 
                      ? "By clicking \"I accept the Disclaimer\" you acknowledge that you have read the conditions."
                      : language === "fr"
                        ? "En cliquant sur \"J'accepte l'Avis de Non-Responsabilité\" vous reconnaissez avoir lu les conditions."
                        : language === "de"
                          ? "Mit dem Klick auf \"Ich akzeptiere den Haftungsausschluss\" bestätigen Sie, die Bedingungen gelesen zu haben."
                          : language === "it"
                            ? "Cliccando su \"Accetto il Disclaimer\" riconosci di aver letto le condizioni."
                            : language === "pt"
                              ? "Ao clicar em \"Aceito o Aviso Legal\" você reconhece que leu as condições."
                              : language === "ar"
                                ? "بالنقر على \"أوافق على إخلاء المسؤولية\" فإنك تقر بأنك قد قرأت الشروط."
                                : language === "hi"
                                  ? "\"मैं अस्वीकरण को स्वीकार करता हूं\" पर क्लिक करके, आप स्वीकार करते हैं कि आपने शर्तों को पढ़ लिया है।"
                                  : language === "zh"
                                    ? "点击\"我接受免责声明\"，您确认已阅读条件。"
                                    : "Al hacer clic en \"Acepto el Aviso Legal\" reconoce que ha leído las condiciones."
                  }
                </p>
              </div>
              
              <div className="flex items-start space-x-2 mt-4">
                <Checkbox 
                  id="disclaimer" 
                  checked={disclaimerAccepted} 
                  onCheckedChange={() => acceptDisclaimer()}
                  className="mt-1 flex-shrink-0"
                />
                <Label htmlFor="disclaimer" className="font-medium text-sm leading-tight">
                  {t.acceptDisclaimer}
                </Label>
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                <Link href="/disclaimer" target="_blank" className="flex items-center hover:underline">
                  {t.viewFullDisclaimer} <ExternalLink className="ml-1 h-3 w-3" />
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Footer con fijado en la parte inferior */}
        <div className="pt-4 mt-auto border-t sticky bottom-0 bg-background">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start">
              <span className={`${allCheckboxesMarked ? 'text-green-500 font-medium' : 'text-muted-foreground'}`}>
                {allCheckboxesMarked
                  ? t.allDocsAccepted
                  : `${[termsOfUseAccepted, privacyPolicyAccepted, disclaimerAccepted].filter(Boolean).length}/3 ${t.acceptedDocs}`
                }
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-2 justify-center">
              {/* Next document button */}
              <Button
                variant={activeTab === "terms" && termsOfUseAccepted ? "default" : 
                      activeTab === "privacy" && privacyPolicyAccepted ? "default" : 
                      activeTab === "disclaimer" && disclaimerAccepted ? "default" : "outline"}
                size="sm"
                className={`text-xs sm:text-sm py-1 px-2 h-8 whitespace-nowrap
                  ${activeTab === "terms" && termsOfUseAccepted ? "bg-green-500 hover:bg-green-600 text-white" : 
                    activeTab === "privacy" && privacyPolicyAccepted ? "bg-green-500 hover:bg-green-600 text-white" : 
                    activeTab === "disclaimer" && disclaimerAccepted ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                onClick={() => {
                  if (activeTab === "terms") {
                    setActiveTab("privacy");
                  } else if (activeTab === "privacy") {
                    setActiveTab("disclaimer");
                  } else if (activeTab === "disclaimer" && !termsOfUseAccepted) {
                    setActiveTab("terms");
                  } else if (activeTab === "disclaimer" && !privacyPolicyAccepted) {
                    setActiveTab("privacy");
                  }
                }}
                disabled={allCheckboxesMarked}
              >
                {t.nextDocument}
              </Button>
              
              {/* Confirm and continue button */}
              <Button
                variant="default"
                size="sm"
                className={`text-xs sm:text-sm py-1 px-2 h-8 whitespace-nowrap
                  ${activeTab === "disclaimer" && allCheckboxesMarked ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                onClick={() => {
                  try {
                    console.log("Botón Confirmar y continuar clickeado!");
                    
                    if (allCheckboxesMarked) {
                      console.log("Todos los checkboxes marcados, ejecutando handleAcceptAll()");
                      handleAcceptAll();
                    } else {
                      console.warn("No se puede aceptar: No todos los checkboxes están marcados");
                      alert("Por favor, marca todas las casillas para aceptar los términos legales.");
                    }
                  } catch (error: any) {
                    console.error("Error al hacer clic en el botón:", error);
                    alert("Error al procesar la aceptación: " + (error.message || "Error desconocido"));
                  }
                }}
                disabled={!allCheckboxesMarked || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>{t.processing}</span>
                  </div>
                ) : (
                  t.confirmAndContinue
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}