import { Loader2 } from 'lucide-react';

export function LegalTermsLoading() {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <h3 className="text-lg font-medium">Verificando información legal</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Estamos confirmando su estado de aceptación de términos legales. Por favor, espere un momento...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}