"use client"
import { columns, Offboarding } from "@/app/offboarding/columns";
import { OffboardingDataTable } from "@/app/offboarding/data-table";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { downloadExcel, monthNames } from "@/lib/utils";
import { Label } from "../ui/label";
import { MonthYearPicker } from "../month-year-picker";

export default function OffboardingDashboard() {
    const [data, setData] = useState<Offboarding[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const now = new Date();
    const defaultValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const [selectedDate, setSelectedDate] = useState<string>(defaultValue);
    
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/offboarding/get-data`, {
                    cache: "no-store",
                });
                const result = await res.json();
                setData(result.response ?? []); // set fetched data
            } catch (err) {
                console.error("Error fetching offboarding data:", err);
            } finally {
                setIsLoading(false)
            }
        }

        fetchData();
    }, [])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center space-x-2 self-end">
                <Label htmlFor="terms">Date as of:</Label>
                <MonthYearPicker
                    value={selectedDate}
                    onChangeAction={setSelectedDate}
                />
                <Button className="w-auto self-end" onClick={() => downloadExcel(data, "table-data.xlsx")}>Export</Button>
            </div>
            <OffboardingDataTable columns={columns} data={data} isLoading={isLoading} />
        </div>
    )
}