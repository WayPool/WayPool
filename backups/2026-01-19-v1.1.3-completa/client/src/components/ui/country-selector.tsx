import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import "@/styles/flags.css";

interface Country {
  name: string;
  code: string;
  dialCode: string;
}

interface CountrySelectorProps {
  value?: string;
  onChange: (dialCode: string, country: Country) => void;
  className?: string;
  placeholder?: string;
}

// Lista de países con sus códigos de marcación
const countries: Country[] = [
  { name: "Argentina", code: "ar", dialCode: "+54" },
  { name: "Australia", code: "au", dialCode: "+61" },
  { name: "Brasil", code: "br", dialCode: "+55" },
  { name: "Canadá", code: "ca", dialCode: "+1" },
  { name: "Chile", code: "cl", dialCode: "+56" },
  { name: "China", code: "cn", dialCode: "+86" },
  { name: "Colombia", code: "co", dialCode: "+57" },
  { name: "República Checa", code: "cz", dialCode: "+420" },
  { name: "Dinamarca", code: "dk", dialCode: "+45" },
  { name: "Ecuador", code: "ec", dialCode: "+593" },
  { name: "Egipto", code: "eg", dialCode: "+20" },
  { name: "Finlandia", code: "fi", dialCode: "+358" },
  { name: "Francia", code: "fr", dialCode: "+33" },
  { name: "Alemania", code: "de", dialCode: "+49" },
  { name: "Grecia", code: "gr", dialCode: "+30" },
  { name: "Hong Kong", code: "hk", dialCode: "+852" },
  { name: "Hungría", code: "hu", dialCode: "+36" },
  { name: "India", code: "in", dialCode: "+91" },
  { name: "Indonesia", code: "id", dialCode: "+62" },
  { name: "Irlanda", code: "ie", dialCode: "+353" },
  { name: "Israel", code: "il", dialCode: "+972" },
  { name: "Italia", code: "it", dialCode: "+39" },
  { name: "Japón", code: "jp", dialCode: "+81" },
  { name: "Kenya", code: "ke", dialCode: "+254" },
  { name: "Corea del Sur", code: "kr", dialCode: "+82" },
  { name: "Malasia", code: "my", dialCode: "+60" },
  { name: "México", code: "mx", dialCode: "+52" },
  { name: "Marruecos", code: "ma", dialCode: "+212" },
  { name: "Países Bajos", code: "nl", dialCode: "+31" },
  { name: "Nueva Zelanda", code: "nz", dialCode: "+64" },
  { name: "Nigeria", code: "ng", dialCode: "+234" },
  { name: "Noruega", code: "no", dialCode: "+47" },
  { name: "Pakistán", code: "pk", dialCode: "+92" },
  { name: "Perú", code: "pe", dialCode: "+51" },
  { name: "Filipinas", code: "ph", dialCode: "+63" },
  { name: "Polonia", code: "pl", dialCode: "+48" },
  { name: "Portugal", code: "pt", dialCode: "+351" },
  { name: "Romania", code: "ro", dialCode: "+40" },
  { name: "Rusia", code: "ru", dialCode: "+7" },
  { name: "Arabia Saudita", code: "sa", dialCode: "+966" },
  { name: "Singapur", code: "sg", dialCode: "+65" },
  { name: "Sudáfrica", code: "za", dialCode: "+27" },
  { name: "España", code: "es", dialCode: "+34" },
  { name: "Suecia", code: "se", dialCode: "+46" },
  { name: "Suiza", code: "ch", dialCode: "+41" },
  { name: "Taiwán", code: "tw", dialCode: "+886" },
  { name: "Tailandia", code: "th", dialCode: "+66" },
  { name: "Turquía", code: "tr", dialCode: "+90" },
  { name: "Ucrania", code: "ua", dialCode: "+380" },
  { name: "Emiratos Árabes Unidos", code: "ae", dialCode: "+971" },
  { name: "Reino Unido", code: "gb", dialCode: "+44" },
  { name: "Estados Unidos", code: "us", dialCode: "+1" },
  { name: "Vietnam", code: "vn", dialCode: "+84" },
];

export const CountrySelector: React.FC<CountrySelectorProps> = ({ 
  value, 
  onChange, 
  className = "", 
  placeholder = "Seleccionar país"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Encontrar el país por defecto basado en el valor proporcionado
  useEffect(() => {
    if (value) {
      const country = countries.find(c => c.dialCode === value);
      if (country) {
        setSelectedCountry(country);
      }
    } else {
      // Si no hay valor, usar España como país por defecto
      const defaultCountry = countries.find(c => c.code === "es");
      if (defaultCountry) {
        setSelectedCountry(defaultCountry);
        onChange(defaultCountry.dialCode, defaultCountry);
      }
    }
  }, [value, onChange]);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Enfocar el campo de búsqueda cuando se abre el dropdown
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setSearchTerm("");
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    onChange(country.dialCode, country);
    setIsOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCountries = searchTerm
    ? countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        country.dialCode.includes(searchTerm) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : countries;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="toggle-country-dropdown"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedCountry ? (
          <>
            <img 
              src={`/flags/${selectedCountry.code}.svg`} 
              alt={selectedCountry.name} 
              className="country-selector-flag"
            />
            <span>{selectedCountry.dialCode}</span>
          </>
        ) : (
          <span>{placeholder}</span>
        )}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>

      {isOpen && (
        <div className="country-dropdown absolute left-0 mt-1">
          <div className="country-search">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar país o código"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {filteredCountries.length > 0 ? (
            <div role="listbox">
              {filteredCountries.map((country) => (
                <div
                  key={country.code}
                  role="option"
                  aria-selected={selectedCountry?.code === country.code}
                  className={`country-dropdown-item ${
                    selectedCountry?.code === country.code ? "selected" : ""
                  }`}
                  onClick={() => handleSelectCountry(country)}
                >
                  <img 
                    src={`/flags/${country.code}.svg`} 
                    alt={country.name} 
                    className="country-flag"
                  />
                  <span className="country-name">{country.name}</span>
                  <span className="country-code">{country.dialCode}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-countries-found">
              No se encontraron países
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;