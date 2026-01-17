import React, { useState, useEffect } from 'react';
import { CountrySelector } from './country-selector';
import { Input } from './input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import "@/styles/flags.css";
import "@/styles/phone-input.css";

interface Country {
  name: string;
  code: string;
  dialCode: string;
}

// Componente para formularios tipo react-hook-form
export const SimpleFormPhoneInput = React.forwardRef<
  HTMLDivElement,
  {
    form: any;
    field: {
      name: string;
      onChange: (value: any) => void;
      value: string;
    };
    label?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
  }
>(({ form, field, label, placeholder = "Ingresa tu número de teléfono", required, className, ...props }, ref) => {
  const errorMessage = form.formState.errors[field.name]?.message;
  const [selectedCountryCode, setSelectedCountryCode] = useState("+34");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // Actualizar el estado cuando cambia el valor del formulario
  useEffect(() => {
    if (field.value) {
      // Si el valor es un número de teléfono completo (con código de país)
      const match = field.value.match(/^(\+\d+)\s*(.*)$/);
      if (match) {
        setSelectedCountryCode(match[1]);
        setPhoneNumber(match[2]);
      } else {
        // Si solo hay un número sin código
        setPhoneNumber(field.value);
      }
    }
  }, [field.value]);

  // Actualizar el campo del formulario cuando cambia el código de país o el número
  const updateFormValue = (countryCode: string, number: string) => {
    const fullNumber = `${countryCode} ${number}`.trim();
    field.onChange(fullNumber);
  };

  // Manejar cambios en el selector de país
  const handleCountryChange = (dialCode: string, country: Country) => {
    setSelectedCountryCode(dialCode);
    updateFormValue(dialCode, phoneNumber);
  };

  // Manejar cambios en el input del número
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhoneNumber(newValue);
    updateFormValue(selectedCountryCode, newValue);
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
        <div className="flex items-center space-x-2">
          <CountrySelector
            value={selectedCountryCode}
            onChange={handleCountryChange}
            className="phone-country-selector"
          />
          <Input
            id={field.name}
            name={field.name}
            type="text"
            inputMode="tel"
            placeholder={placeholder}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            className={cn(
              "phone-number-input",
              errorMessage ? "border-destructive" : ""
            )}
            {...props}
          />
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
});

SimpleFormPhoneInput.displayName = 'SimpleFormPhoneInput';

export default SimpleFormPhoneInput;