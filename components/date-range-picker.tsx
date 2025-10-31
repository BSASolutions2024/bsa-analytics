"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export function DateRangeFilter({ column }: { column: any }) {
    const [dateRange, setDateRange] = useState({
        from: undefined,
        to: undefined,
    });

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation(); // ✅ prevents opening the popover
        setDateRange({ from: undefined, to: undefined });
        column.setFilterValue(undefined);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative">
                    <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                    {dateRange.from && (
                        <button
                            onClick={handleClear}
                            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range: any) => {
                        setDateRange(range);
                        column.setFilterValue(range); // sets TanStack table filter value
                    }}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
}
