/**
 * Componentes de UI con tema fijo
 * 
 * Este archivo contiene versiones modificadas de los componentes de UI
 * que tienen correcciones específicas para el problema de fondo negro.
 */

import React, { useState, useEffect } from 'react';
import * as SelectPrimitive from "@radix-ui/react-select";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Selector fijo que mantiene el tema
export function FixedSelect({ 
  children, 
  placeholder,
  value,
  onValueChange,
  ...props 
}: { 
  children: React.ReactNode,
  placeholder?: string,
  value?: string,
  onValueChange?: (value: string) => void,
  [key: string]: any
}) {
  const [isDark, setIsDark] = useState<boolean>(
    document.documentElement.classList.contains('dark')
  );
  
  // Actualizar tema cuando cambie en el documento
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed-select-wrapper">
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} {...props}>
        <SelectPrimitive.Trigger 
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            isDark ? "bg-[rgb(19,24,54)] border-[rgb(39,46,79)] text-white" : "bg-white border-slate-200 text-slate-950"
          )}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              isDark 
                ? "bg-[rgb(19,24,54)] border-[rgb(39,46,79)] text-white" 
                : "bg-white border-slate-200 text-slate-950"
            )}
          >
            <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-6">
              <ChevronUp className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>
            
            <SelectPrimitive.Viewport
              className={cn(
                "p-1",
                "w-full min-w-[var(--radix-select-trigger-width)]"
              )}
            >
              {children}
            </SelectPrimitive.Viewport>
            
            <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-6">
              <ChevronDown className="h-4 w-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}

// Item de selección con tema fijo
export function FixedSelectItem({ 
  children, 
  value,
  ...props 
}: { 
  children: React.ReactNode,
  value: string,
  [key: string]: any
}) {
  const isDark = document.documentElement.classList.contains('dark');
  
  return (
    <SelectPrimitive.Item
      value={value}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isDark 
          ? "text-white hover:bg-[rgb(39,46,79)] data-[highlighted]:bg-[rgb(39,46,79)]" 
          : "text-slate-950 hover:bg-slate-100 data-[highlighted]:bg-slate-100"
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

// Menú desplegable con tema fijo
export function FixedDropdownMenu({ 
  children,
  ...props 
}: { 
  children: React.ReactNode,
  [key: string]: any
}) {
  return (
    <DropdownMenuPrimitive.Root {...props}>
      {children}
    </DropdownMenuPrimitive.Root>
  );
}

export function FixedDropdownMenuTrigger({ 
  children,
  ...props 
}: { 
  children: React.ReactNode,
  [key: string]: any
}) {
  return (
    <DropdownMenuPrimitive.Trigger {...props}>
      {children}
    </DropdownMenuPrimitive.Trigger>
  );
}

export function FixedDropdownMenuContent({ 
  children,
  ...props 
}: { 
  children: React.ReactNode,
  [key: string]: any
}) {
  const [isDark, setIsDark] = useState<boolean>(
    document.documentElement.classList.contains('dark')
  );
  
  // Actualizar tema cuando cambie en el documento
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md p-1 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          isDark 
            ? "bg-[rgb(19,24,54)] border border-[rgb(39,46,79)] text-white" 
            : "bg-white border border-slate-200 text-slate-950"
        )}
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  );
}

export function FixedDropdownMenuItem({ 
  children,
  ...props 
}: { 
  children: React.ReactNode,
  [key: string]: any
}) {
  const isDark = document.documentElement.classList.contains('dark');
  
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        isDark 
          ? "text-white hover:bg-[rgb(39,46,79)] data-[highlighted]:bg-[rgb(39,46,79)]" 
          : "text-slate-950 hover:bg-slate-100 data-[highlighted]:bg-slate-100"
      )}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}