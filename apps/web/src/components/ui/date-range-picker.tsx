import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
  placeholder = "Select dates",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeCalendar, setActiveCalendar] = React.useState<"start" | "end">(
    "start"
  );

  const handleStartSelect = (date: Date | undefined) => {
    onStartDateChange(date);
    if (date) {
      setActiveCalendar("end");
      // If end date is before start date, clear it
      if (endDate && endDate < date) {
        onEndDateChange(undefined);
      }
    }
  };

  const handleEndSelect = (date: Date | undefined) => {
    onEndDateChange(date);
    if (date) {
      setIsOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!startDate && !endDate) return placeholder;

    const formatOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    if (startDate && endDate) {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const currentYear = new Date().getFullYear();

      // Add year if different years or not current year
      if (startYear !== endYear) {
        return `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
      } else if (startYear !== currentYear) {
        return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
      } else {
        return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}`;
      }
    }

    if (startDate) return `${format(startDate, "MMM d")} - Any`;
    if (endDate) return `Any - ${format(endDate, "MMM d")}`;

    return placeholder;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal h-9 text-sm px-3",
            !startDate && !endDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
          <span className="truncate">{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Preset Ranges */}
          <div className="border-r p-3 space-y-1">
            <p className="text-sm font-medium mb-2">Quick Select</p>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => {
                const today = new Date();
                const nextWeek = new Date();
                nextWeek.setDate(today.getDate() + 7);
                onStartDateChange(today);
                onEndDateChange(nextWeek);
              }}
            >
              Next 7 days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => {
                const today = new Date();
                const nextMonth = new Date();
                nextMonth.setDate(today.getDate() + 30);
                onStartDateChange(today);
                onEndDateChange(nextMonth);
              }}
            >
              Next 30 days
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => {
                const today = new Date();
                const thisMonth = new Date(
                  today.getFullYear(),
                  today.getMonth(),
                  1
                );
                const nextMonth = new Date(
                  today.getFullYear(),
                  today.getMonth() + 1,
                  0
                );
                onStartDateChange(thisMonth);
                onEndDateChange(nextMonth);
              }}
            >
              This month
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs"
              onClick={() => {
                const today = new Date();
                const nextMonth = new Date(
                  today.getFullYear(),
                  today.getMonth() + 1,
                  1
                );
                const endNextMonth = new Date(
                  today.getFullYear(),
                  today.getMonth() + 2,
                  0
                );
                onStartDateChange(nextMonth);
                onEndDateChange(endNextMonth);
              }}
            >
              Next month
            </Button>
          </div>

          {/* Calendars */}
          <div className="flex">
            <div className="border-r">
              <div className="p-3 text-sm font-medium text-center border-b">
                Start Date
              </div>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={handleStartSelect}
                initialFocus={activeCalendar === "start"}
              />
            </div>
            <div>
              <div className="p-3 text-sm font-medium text-center border-b">
                End Date
              </div>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={handleEndSelect}
                disabled={date => (startDate ? date < startDate : false)}
                initialFocus={activeCalendar === "end"}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onStartDateChange(undefined);
              onEndDateChange(undefined);
              setActiveCalendar("start");
            }}
          >
            Clear
          </Button>
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Done
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
