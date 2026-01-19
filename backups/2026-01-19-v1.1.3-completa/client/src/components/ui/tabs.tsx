import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"
import { isTranslationFunction } from "@/utils/translation-utils"

/**
 * COMPONENTE TABS ULTRA-PROTEGIDO CONTRA ERRORES DE TRADUCCIÓN
 * Esta versión mejorada protege contra el problema "t is not a function"
 * garantizando que los children de los componentes TabsTrigger siempre sean manipulados
 * de forma segura.
 */

// Wrapper para interceptar errores en componentes Tab
function withErrorBoundary<P extends object>(
  Component: React.ForwardRefExoticComponent<P & React.RefAttributes<any>>,
  displayName: string
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    try {
      // Protección específica para problemas de traducción en children que sean funciones
      const safeProps = { ...props } as any;
      
      // Sanitizar los children si son funciones o contienen funciones
      if (safeProps.children !== undefined) {
        // Si children es una función (posible t), asegurarse de que realmente lo sea
        if (typeof safeProps.children === 'function') {
          if (!isTranslationFunction(safeProps.children)) {
            console.warn(`[PROTECCIÓN-UI] Children en ${displayName} es una función inválida:`, safeProps.children);
            safeProps.children = displayName; // Fallback seguro
          }
        } 
        // Si children es un elemento JSX que podría usar t internamente, no interferir
      }
      
      return <Component ref={ref} {...safeProps} />
    } catch (error) {
      console.error(`[PROTECCIÓN-UI] Error en ${displayName}:`, error);
      return null; // Fallback vacío en caso de error crítico
    }
  });
  
  WrappedComponent.displayName = displayName;
  return WrappedComponent;
}

// Componentes base
const TabsBase = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn(
      "overflow-visible", // Asegura que no haya scroll en el contenedor de tabs
      className
    )}
    {...props}
  />
));

const TabsListBase = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsListBase.displayName = TabsPrimitive.List.displayName;

const TabsTriggerBase = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTriggerBase.displayName = TabsPrimitive.Trigger.displayName;

const TabsContentBase = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[state=inactive]:hidden data-[state=active]:block", // Asegura que el contenido inactivo esté oculto
      "overflow-x-visible", // Permitir que el contenido horizontal sea visible
      "h-full", // Asegurar que ocupe todo el espacio necesario
      className
    )}
    {...props}
  />
));
TabsContentBase.displayName = TabsPrimitive.Content.displayName;

// Componentes protegidos con boundary de errores
const Tabs = withErrorBoundary(TabsBase, "Tabs");
const TabsList = withErrorBoundary(TabsListBase, "TabsList");
const TabsTrigger = withErrorBoundary(TabsTriggerBase, "TabsTrigger");
const TabsContent = withErrorBoundary(TabsContentBase, "TabsContent");

export { Tabs, TabsList, TabsTrigger, TabsContent }
