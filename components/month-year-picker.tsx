"use client";

import * as React from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { monthNames } from "@/lib/utils";

type MonthYearPickerProps = {
    value?: string;
    onChangeAction?: (value: string) => void;
    startYear?: number;
    endYear?: number;
};

export function MonthYearPicker({
    value,
    onChangeAction,
    startYear = (new Date()).getFullYear(),
    endYear = new Date().getFullYear(),
}: MonthYearPickerProps) {

    const now = new Date();
    const defaultValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const selectedValue = value || defaultValue;
    return (
        <Select
            value={selectedValue}
            onValueChange={(val) => onChangeAction?.(val)}
        >
            <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
                {Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)
                    .flatMap((year) =>
                        monthNames.map((month, idx) => {
                            const monthValue = `${year}-${String(idx + 1).padStart(2, "0")}`;
                            return (
                                <SelectItem key={monthValue} value={monthValue}>
                                    {month} {year}
                                </SelectItem>
                            );
                        })
                    )}
            </SelectContent>
        </Select>
    );
}
