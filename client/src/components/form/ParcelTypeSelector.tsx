import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FileText, Package, Laptop, Shirt, Wine, HelpCircle } from "lucide-react";

export type ParcelType = "documents" | "small_package" | "electronics" | "apparel" | "fragile" | "other";

interface ParcelTypeOption {
  value: ParcelType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const parcelTypes: ParcelTypeOption[] = [
  {
    value: "documents",
    label: "Documents",
    icon: <FileText className="h-5 w-5" />,
    description: "Papers, contracts, letters"
  },
  {
    value: "small_package",
    label: "Small Package",
    icon: <Package className="h-5 w-5" />,
    description: "Books, gifts, accessories"
  },
  {
    value: "electronics",
    label: "Electronics",
    icon: <Laptop className="h-5 w-5" />,
    description: "Phones, laptops, tablets"
  },
  {
    value: "apparel",
    label: "Apparel",
    icon: <Shirt className="h-5 w-5" />,
    description: "Clothing, shoes, accessories"
  },
  {
    value: "fragile",
    label: "Fragile",
    icon: <Wine className="h-5 w-5" />,
    description: "Glass, ceramics, artwork"
  },
  {
    value: "other",
    label: "Other",
    icon: <HelpCircle className="h-5 w-5" />,
    description: "Anything else"
  }
];

interface ParcelTypeSelectorProps {
  value: ParcelType[];
  onChange: (value: ParcelType[]) => void;
  required?: boolean;
  error?: string;
  className?: string;
  singleSelect?: boolean;
}

export function ParcelTypeSelector({
  value,
  onChange,
  required = false,
  error,
  className,
  singleSelect = false
}: ParcelTypeSelectorProps) {
  const handleChange = (type: ParcelType, checked: boolean) => {
    if (singleSelect) {
      onChange(checked ? [type] : []);
    } else {
      if (checked) {
        onChange([...value, type]);
      } else {
        onChange(value.filter(v => v !== type));
      }
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label>
        Package Type{!singleSelect && "s"} {required && <span className="text-destructive">*</span>}
      </Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {parcelTypes.map(type => {
          const isSelected = value.includes(type.value);
          
          return (
            <label
              key={type.value}
              className={cn(
                "relative flex cursor-pointer rounded-lg border p-4 hover:bg-accent/50 transition-colors",
                isSelected && "border-primary bg-primary/5",
                error && "border-destructive"
              )}
            >
              <div className="flex items-start gap-3 w-full">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleChange(type.value, !!checked)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {type.icon}
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}