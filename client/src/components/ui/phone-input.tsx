import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountrySelector } from "@/components/ui/country-selector";
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import "@/styles/phone-input.css";

// Componente de input específico para teléfonos que evita problemas de validación de entrada
const PhoneNumberInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const [inputValue, setInputValue] = useState(props.value || '');
  
  useEffect(() => {
    // Actualizar el valor interno cuando cambia el prop value
    if (props.value !== undefined) {
      setInputValue(props.value);
    }
  }, [props.value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Llamar al onChange proporcionado por props si existe
    if (props.onChange) {
      // Crear un evento sintético para mantener la compatibilidad
      const syntheticEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue
        }
      };
      props.onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <input
      {...props}
      type="text"
      inputMode="tel"
      value={inputValue}
      onChange={handleInputChange}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        props.className
      )}
      ref={ref}
    />
  );
});

PhoneNumberInput.displayName = "PhoneNumberInput";

interface PhoneInputProps {
  value?: string;
  onChange: (value: string, formattedValue: string, countryCode: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  name?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  label,
  placeholder = 'Ingresa tu número de teléfono',
  error,
  className,
  id,
  required = false,
  disabled = false,
  name,
}) => {
  const [countryCode, setCountryCode] = useState("+34"); // Código de España por defecto
  const [phoneNumber, setPhoneNumber] = useState('');

  // Inicializar el valor del teléfono cuando se proporciona un valor
  useEffect(() => {
    if (value) {
      // Si el valor comienza con un código de país, extraerlo
      const match = value.match(/^\+(\d+)/);
      if (match) {
        const dialCode = `+${match[1]}`;
        const numberPart = value.slice(dialCode.length).trim();
        setCountryCode(dialCode);
        setPhoneNumber(numberPart);
      } else {
        // Si no tiene código de país, usar el valor completo como número
        setPhoneNumber(value);
      }
    }
  }, [value]);

  // Manejar cambios en el código de país
  const handleCountryChange = (dialCode: string) => {
    setCountryCode(dialCode);
    updateParentValue(phoneNumber, dialCode);
  };

  // Manejar cambios en el número de teléfono
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Solo permitir dígitos, espacios, paréntesis, guiones y puntos
    // Nota: Eliminamos esta sanitización que podría estar bloqueando la entrada en algunos navegadores
    // const sanitizedValue = newValue.replace(/[^\d\s\(\)\-\.]/g, '');
    const sanitizedValue = newValue;
    setPhoneNumber(sanitizedValue);
    updateParentValue(sanitizedValue, countryCode);
  };

  // Actualizar el valor completo (código + número)
  const updateParentValue = (phone: string, code: string) => {
    const fullNumber = `${code} ${phone}`.trim();
    // Garantizar que si el número tiene dígitos, estos se mantengan para el valor raw
    // pero no filtramos durante la edición para no afectar la experiencia del usuario
    let rawNumber;
    if (phone.match(/\d/)) {
      // Sólo aplicamos reemplazo si hay al menos un dígito
      rawNumber = `${code}${phone.replace(/[^\d]/g, '')}`;
    } else {
      // Si no hay dígitos, usamos el valor original para permitir la entrada
      rawNumber = `${code}${phone}`;
    }
    onChange(rawNumber, fullNumber, code);
  };

  return (
    <div className={cn("phone-input-container", className)}>
      {label && (
        <Label 
          htmlFor={id} 
          className="phone-input-label"
        >
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
      )}
      
      <div className="phone-input-wrapper">
        <CountrySelector
          value={countryCode}
          onChange={(dialCode) => handleCountryChange(dialCode)}
          className="phone-country-selector"
        />
        
        <PhoneNumberInput
          id={id}
          name={name}
          placeholder={placeholder}
          value={phoneNumber}
          onChange={handlePhoneChange}
          className={cn(
            "phone-number-input",
            error ? "border-destructive" : ""
          )}
          disabled={disabled}
          required={required}
        />
      </div>
      
      {error && (
        <p className="text-destructive text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

// Versión para usar con react-hook-form
export const FormPhoneInput = React.forwardRef<
  HTMLDivElement,
  Omit<PhoneInputProps, 'onChange' | 'value' | 'error'> & {
    form: any;
    field: {
      name: string;
      onChange: (value: any) => void;
      value: string;
    };
  }
>(({ form, field, label, required, className, ...props }, ref) => {
  const errorMessage = form.formState.errors[field.name]?.message;
  
  const handleChange = (rawValue: string, formattedValue: string, countryCode: string) => {
    field.onChange(rawValue);
    
    // Almacenar metadatos del teléfono en un campo adicional para procesamiento posterior
    if (form.setValue) {
      form.setValue(`${field.name}_metadata`, {
        formatted: formattedValue,
        countryCode
      });
    }
  };

  return (
    <FormItem ref={ref} className={className}>
      {label && (
        <FormLabel htmlFor={field.name}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </FormLabel>
      )}
      <FormControl>
        <PhoneInput
          id={field.name}
          name={field.name}
          value={field.value}
          onChange={handleChange}
          error={errorMessage}
          required={required}
          {...props}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
});

FormPhoneInput.displayName = 'FormPhoneInput';

export default PhoneInput;