import React, { ReactNode, useEffect, useState } from 'react';
import { getUser } from '@/lib/user-service';
import { useSimpleWallet } from '@/hooks/use-simple-wallet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LayoutWithAuth } from './layout-with-auth';

type LayoutWithLegalTermsProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  requireAuth?: boolean;
  autoCloseTermsDialog?: boolean;
};

export function LayoutWithLegalTerms({
  children,
  title = "Waybank",
  description = "Gestión avanzada de posiciones de liquidez en Uniswap v4",
  requireAuth = true,
  autoCloseTermsDialog = false,
}: LayoutWithLegalTermsProps) {
  const { account } = useSimpleWallet();
  const [hasAcceptedLegalTerms, setHasAcceptedLegalTerms] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (account) {
      const fetchUserTermsStatus = async () => {
        try {
          const userData = await getUser(account);
          setHasAcceptedLegalTerms(userData?.hasAcceptedLegalTerms || false);
          setIsLoading(false);
        } catch (error) {
          console.error("Error obteniendo estado de aceptación de términos:", error);
          setHasAcceptedLegalTerms(false);
          setIsLoading(false);
        }
      };
      
      fetchUserTermsStatus();
    } else {
      setIsLoading(false);
    }
  }, [account]);
  
  // Eliminamos logging excesivo
  
  const handleAcceptTerms = async () => {
    if (!account) return;
    try {
      // Corregir URL y formato del endpoint según el servidor
      await fetch(`/api/user/${account.toLowerCase()}/legal-acceptance`, {
        method: 'POST',
        body: JSON.stringify({
          termsOfUse: true,
          privacyPolicy: true,
          disclaimer: true
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Incluir cookies para la autenticación
      });
      
      // Actualizar el estado local inmediatamente
      setHasAcceptedLegalTerms(true);
      
      // Almacenar en localStorage como mecanismo de respaldo 
      try {
        localStorage.setItem(`waybank_legal_accepted_${account.toLowerCase()}`, "true");
      } catch (e) {
        console.warn("No se pudo guardar en localStorage:", e);
      }
    } catch (error) {
      console.error("Error al aceptar términos legales:", error);
      
      // En caso de error, intentar almacenar en localStorage como plan de contingencia
      try {
        localStorage.setItem(`waybank_legal_accepted_${account.toLowerCase()}`, "true");
        setHasAcceptedLegalTerms(true); // Permitir el acceso de todas formas
      } catch (e) {
        console.warn("No se pudo guardar en localStorage como contingencia:", e);
      }
    }
  };
  
  // Determinar si debemos mostrar el diálogo de términos legales
  const showLegalTermsDialog = account && 
                              !isLoading && 
                              hasAcceptedLegalTerms === false;
  
  return (
    <LayoutWithAuth
      title={title}
      description={description}
      requireAuth={requireAuth}
    >
      {children}
      
      <AlertDialog 
        open={showLegalTermsDialog || false}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Términos y Condiciones</AlertDialogTitle>
            <AlertDialogDescription className="text-left space-y-4 max-h-[60vh] overflow-y-auto">
              <p>Bienvenido a Waybank. Para poder utilizar nuestros servicios, necesitamos que leas y aceptes nuestros términos y condiciones. Estos términos establecen las reglas y regulaciones para el uso de nuestra plataforma.</p>
              
              <h3 className="text-lg font-semibold mt-4">1. Aceptación de los términos</h3>
              <p>Al acceder y utilizar Waybank, usted acepta estos términos y condiciones en su totalidad. Si no está de acuerdo con estos términos y condiciones o cualquier parte de estos términos y condiciones, no debe utilizar este sitio web.</p>
              
              <h3 className="text-lg font-semibold mt-4">2. Servicios financieros descentralizados</h3>
              <p>Waybank ofrece servicios relacionados con finanzas descentralizadas (DeFi) y manejo de posiciones en protocolos de liquidez como Uniswap. Usted reconoce y acepta los riesgos inherentes asociados con las tecnologías blockchain, contratos inteligentes y DeFi en general.</p>
              
              <h3 className="text-lg font-semibold mt-4">3. Riesgos y responsabilidades</h3>
              <p>Usted comprende que:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Las transacciones blockchain son irreversibles y Waybank no puede revertir o recuperar fondos una vez procesados.</li>
                <li>El valor de los activos digitales puede fluctuar significativamente y existe el riesgo de pérdida parcial o total del capital.</li>
                <li>Waybank no garantiza ningún rendimiento específico de las estrategias o posiciones gestionadas a través de nuestra plataforma.</li>
                <li>Los contratos inteligentes pueden contener vulnerabilidades o errores que pueden resultar en la pérdida de fondos.</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4">4. Responsabilidad fiscal</h3>
              <p>Es su responsabilidad determinar qué impuestos, si los hay, se aplican a las transacciones que realiza a través de Waybank y es su responsabilidad informar y remitir el impuesto correcto a la autoridad fiscal apropiada. No somos responsables de determinar si los impuestos se aplican a sus transacciones o de cobrar, informar o remitir impuestos derivados de transacciones.</p>
              
              <h3 className="text-lg font-semibold mt-4">5. Limitación de responsabilidad</h3>
              <p>En ningún caso Waybank, sus directores, empleados o agentes serán responsables por cualquier daño directo, indirecto, incidental, especial, punitivo o consecuente de cualquier tipo, que surja de o en conexión con su uso de nuestros servicios.</p>
              
              <h3 className="text-lg font-semibold mt-4">6. Ley aplicable</h3>
              <p>Estos términos y condiciones se rigen e interpretan de acuerdo con las leyes internacionales aplicables, y usted se somete irrevocablemente a la jurisdicción exclusiva de los tribunales en esa ubicación.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Rechazar</AlertDialogCancel>
            <AlertDialogAction onClick={handleAcceptTerms}>Aceptar Términos</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </LayoutWithAuth>
  );
}