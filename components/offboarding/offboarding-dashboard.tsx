"use client"
import { columns, Offboarding } from "@/app/offboarding/columns";
import { OffboardingDataTable } from "@/app/offboarding/data-table";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { downloadExcel, monthNames } from "@/lib/utils";
import { Label } from "../ui/label";
import { MonthYearPicker } from "../month-year-picker";
import { Input } from "../ui/input";
import { OffboardingChartPieInteractive } from "./offboarding-chart-pie";
import { OffboardingAnalyticsCard } from "./offboarding-analytics";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

export default function OffboardingDashboard() {
    const router = useRouter();
    const [data, setData] = useState<Offboarding[]>([]);
    const [fetchedAt, setFetchedAt] = useState<String>()
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [filteredData, setFilteredData] = useState<Offboarding[]>([])

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/offboarding/get-data`, {
                cache: "no-store",
            });
            const result = await res.json();
            if (res.ok) {
                setFetchedAt((new Date(result.fetchedAt)).toDateString() + " " + (new Date(result.fetchedAt)).toLocaleTimeString())
                setData(result.response ?? []);
            }
        } catch (err) {
            console.error("Error fetching offboarding data:", err);
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        fetchData();
    }, [])

    const syncOffboarding = async () => {
        setIsSyncing(true)
        try {
            const res = await fetch('/api/offboarding/sync-data')

            if (res.ok) {
                await fetchData()
                toast.success("Data is sync successfully")
                router.refresh();
            }
        } catch (error: any) {
            toast.error("Something went wrong", {
                description: error.message
            })
        } finally {
            setIsSyncing(false)
        }
    }

    const onFilterData = (filter: any) => {
        setFilteredData(filter)
    }
    

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col space-y-6">
                <div className="w-auto self-end flex flex-row gap-2">
                    <Label>Last Sync: {isLoading ? <Spinner /> : fetchedAt} </Label>
                    <Button disabled={isSyncing} onClick={syncOffboarding}>Sync Data {isSyncing ? <Spinner /> : <RefreshCw />}</Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <OffboardingChartPieInteractive data={filteredData} isLoading={isLoading} />
                    <div className="grid col-span-2">
                        <OffboardingAnalyticsCard data={filteredData} isLoading={isLoading}/>
                    </div>
                </div>
                <OffboardingDataTable columns={columns} data={data} isLoading={isLoading} onFilteredDataChange={onFilterData} />
            </div>
        </div>
    )
}