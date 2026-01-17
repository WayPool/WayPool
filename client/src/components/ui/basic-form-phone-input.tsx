import React from 'react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BasicPhoneInput } from './basic-phone-input';

/**
 * Versión básica del FormPhoneInput que usa BasicPhoneInput
 * Pensada específicamente para resolver problemas de entrada de números
 */
export const BasicFormPhoneInput = React.forwardRef<
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
>(({ form, field, label, placeholder, required, className, ...props }, ref) => {
  const errorMessage = form.formState.errors[field.name]?.message;
  
  const handleChange = (value: string) => {
    field.onChange(value);
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
        <BasicPhoneInput
          id={field.name}
          name={field.name}
          value={field.value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          {...props}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
});

BasicFormPhoneInput.displayName = 'BasicFormPhoneInput';

export default BasicFormPhoneInput;