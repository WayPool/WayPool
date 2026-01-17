import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import "@/styles/flags.css";
import "@/styles/phone-input.css";

// Componente muy básico que solo permite la entrada de teléfono
// sin ninguna validación o procesamiento que pueda interferir

interface BasicPhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
  countryCode?: string;
}

export const BasicPhoneInput: React.FC<BasicPhoneInputProps> = ({
  value = '',
  onChange,
  label,
  placeholder = 'Ingresa tu número de teléfono',
  className,
  id,
  required = false,
  disabled = false,
  name,
  countryCode = '+34', // Default a España
}) => {
  // Estado interno para manejar el valor
  const [inputValue, setInputValue] = useState(value || '');
  
  // Actualizar el estado cuando cambia el prop value
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // Manejar cambios en el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div className={cn("phone-input-container", className)}>
      {label && (
        <div className="phone-input-label mb-2">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </div>
      )}
      
      <div className="flex items-center gap-2 phone-input-wrapper">
        {/* Prefijo de país fijo */}
        <div className="phone-country-prefix px-3 py-2 border border-input rounded-md bg-background text-foreground">
          {countryCode}
        </div>
        
        {/* Input básico sin restricciones */}
        <input
          id={id}
          name={name}
          type="text"
          inputMode="tel"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "phone-number-input"
          )}
          disabled={disabled}
          required={required}
        />
      </div>
    </div>
  );
};

export default BasicPhoneInput;