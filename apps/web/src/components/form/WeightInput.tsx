import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { locationService } from "@/lib/locationService";

interface WeightInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  required?: boolean;
  error?: string;
  className?: string;
}

export function WeightInput({
  label = "Weight",
  value,
  onChange,
  min = 0,
  max = 30,
  required = false,
  error,
  className
}: WeightInputProps) {
  const [unit, setUnit] = useState<"kg" | "lb">(locationService.getWeightUnitPreference());
  const [displayValue, setDisplayValue] = useState("");

  // Convert weight to display unit
  useEffect(() => {
    if (!value || value === 0) {
      setDisplayValue("");
    } else {
      const numValue = typeof value === 'number' ? value : parseFloat(value);
      if (!isNaN(numValue)) {
        const converted = unit === "lb" ? numValue * 2.20462 : numValue;
        setDisplayValue(converted.toFixed(1));
      }
    }
  }, [value, unit]);

  const handleValueChange = useCallback((newValue: string) => {
    setDisplayValue(newValue);
    
    const numValue = parseFloat(newValue);
    if (!isNaN(numValue)) {
      // Convert to kg for storage
      const kgValue = unit === "lb" ? numValue / 2.20462 : numValue;
      onChange(kgValue);
    } else if (newValue === "") {
      onChange(0);
    }
  }, [unit, onChange]);

  const handleUnitToggle = useCallback(() => {
    const newUnit = unit === "kg" ? "lb" : "kg";
    setUnit(newUnit);
    locationService.setWeightUnitPreference(newUnit);
    
    // Recalculate display value
    if (value && value > 0) {
      const numValue = typeof value === 'number' ? value : parseFloat(value);
      if (!isNaN(numValue)) {
        const converted = newUnit === "lb" ? numValue * 2.20462 : numValue;
        setDisplayValue(converted.toFixed(1));
      }
    }
  }, [unit, value]);

  const maxDisplay = unit === "lb" ? max * 2.20462 : max;

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor="weight-input">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            id="weight-input"
            type="number"
            placeholder="0"
            value={displayValue}
            onChange={(e) => handleValueChange(e.target.value)}
            min={min}
            max={maxDisplay}
            step="0.1"
            className={cn("pr-12", error && "border-destructive")}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {unit}
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUnitToggle}
          className="px-3"
        >
          {unit === "kg" ? "→ lb" : "→ kg"}
        </Button>
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <p className="text-xs text-muted-foreground">
        Max allowed: {maxDisplay.toFixed(1)} {unit}
      </p>
    </div>
  );
}