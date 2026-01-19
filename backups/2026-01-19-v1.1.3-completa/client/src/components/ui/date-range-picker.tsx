import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon, Check } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTranslation } from "@/hooks/use-translation"

export interface DateRangePickerProps {
  dateRange: DateRange | undefined
  setDateRange: (dateRange: DateRange | undefined) => void
  placeholder?: string
  className?: string
}

export function DateRangePicker({ dateRange, setDateRange, placeholder, className }: DateRangePickerProps) {
  const { t, language } = useTranslation()
  const [selectedRange, setSelectedRange] = React.useState<DateRange | undefined>(dateRange);
  const [open, setOpen] = React.useState(false);
  
  // Actualizar el estado interno cuando cambie el prop dateRange
  React.useEffect(() => {
    setSelectedRange(dateRange);
  }, [dateRange]);

  // Función para confirmar la selección
  const handleConfirmSelection = () => {
    setDateRange(selectedRange);
    setOpen(false);
  };
  
  // Función para limpiar el filtro
  const handleClearFilter = () => {
    setSelectedRange(undefined);
    setDateRange(undefined);
    setOpen(false);
  };
  
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy")
              )
            ) : (
              <span>{placeholder || t("Seleccionar rango de fechas")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={selectedRange?.from || new Date()}
            selected={selectedRange}
            onSelect={setSelectedRange}
            numberOfMonths={2}
          />
          <div className="flex items-center justify-between p-3 border-t border-border">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilter}
              className="text-muted-foreground hover:text-foreground"
            >
              {t("Limpiar")}
            </Button>
            <Button 
              onClick={handleConfirmSelection} 
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Check className="mr-2 h-4 w-4" />
              {t("Aplicar filtro")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}