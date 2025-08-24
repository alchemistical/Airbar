import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface InstantQuoteMiniProps {
  origin?: string;
  destination?: string;
  itemValue?: number;
  size?: string;
  onSubmit: (form: {
    origin: string;
    destination: string;
    itemValue: number;
    size: string;
  }) => void;
}

export const InstantQuoteMini: React.FC<InstantQuoteMiniProps> = ({
  origin = "",
  destination = "",
  itemValue = 0,
  size = "",
  onSubmit,
}) => {
  const [form, setForm] = useState({ origin, destination, itemValue, size });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Get instant quote
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="origin" className="sr-only">
              From
            </label>
            <Input
              id="origin"
              type="text"
              placeholder="From (e.g., Tehran)"
              value={form.origin}
              onChange={e => setForm({ ...form, origin: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="destination" className="sr-only">
              To
            </label>
            <Input
              id="destination"
              type="text"
              placeholder="To (e.g., Toronto)"
              value={form.destination}
              onChange={e => setForm({ ...form, destination: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="itemValue" className="sr-only">
              Item value
            </label>
            <Input
              id="itemValue"
              type="number"
              placeholder="Item value ($USD)"
              value={form.itemValue || ""}
              onChange={e =>
                setForm({ ...form, itemValue: Number(e.target.value) })
              }
              min="1"
              required
            />
          </div>
          <div>
            <label htmlFor="size" className="sr-only">
              Package size
            </label>
            <Select
              value={form.size}
              onValueChange={value => setForm({ ...form, size: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small (under 2kg)</SelectItem>
                <SelectItem value="medium">Medium (2-10kg)</SelectItem>
                <SelectItem value="large">Large (10-23kg)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Get Quote
        </Button>
      </form>
    </div>
  );
};
