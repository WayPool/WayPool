import React, { ReactNode } from "react";
import { SimpleConnectButton } from "@/components/wallet/simple-connect-button";

interface LayoutBasicProps {
  children: ReactNode;
}

/**
 * Layout básico sin verificación de términos legales para páginas como el perfil de facturación
 */
export function LayoutBasic({ children }: LayoutBasicProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header simple */}
      <header className="border-b shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">WayBank</h1>
          </div>
          <div>
            <SimpleConnectButton />
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer simple */}
      <footer className="border-t py-6 px-4">
        <div className="container mx-auto">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WayBank. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LayoutBasic;