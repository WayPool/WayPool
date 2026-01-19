import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Componente de límite de errores (Error Boundary) para prevenir que todo el dashboard
 * desaparezca si hay errores en las traducciones o en componentes específicos.
 */
class SafeTranslationProvider extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Actualizar el estado para mostrar el fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Puedes registrar el error en un servicio de reportes
    console.error('Error en componente de dashboard:', error);
    console.error('Error info:', errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI como fallback
      return this.props.fallback || (
        <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900 my-4">
          <h3 className="text-lg font-medium mb-2">Cargando componente...</h3>
          <p className="text-slate-500 dark:text-slate-400">
            Estamos recuperando la información. Por favor, espere un momento.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SafeTranslationProvider;