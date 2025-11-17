"use client"
import { RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Spinner } from "../ui/spinner";
import WorkArrangementLineChart from "./work-arrangement-line-chart";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { WorkArrangementTrendData } from "@/lib/types";

export default function WorkArrangementDashboard() {
    const router = useRouter();
    const [data, setData] = useState<WorkArrangementTrendData[]>([]);
    const [fetchedAt, setFetchedAt] = useState<String>()
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/work-arrangement/get-data`, {
                cache: "no-store",
            });
            const result = await res.json();
            if (res.ok) {
                setFetchedAt((new Date(result.fetchedAt)).toDateString() + " " + (new Date(result.fetchedAt)).toLocaleTimeString())
                setData(result?.filtered ?? []);
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

    const syncWorkArrangementTrend = async () => {
        setIsSyncing(true)
        try {
            const res = await fetch('/api/work-arrangement/sync-data')

            const result = await res.json()
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
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col space-y-6">
                <div className="w-auto self-end flex flex-row gap-2">
                    <Label>Last Sync: {isLoading ? <Spinner /> : !fetchedAt ? "Not Sync" : fetchedAt} </Label>
                    <Button disabled={isSyncing} onClick={syncWorkArrangementTrend}>
                        {isSyncing ? (
                            <>
                                Syncing <Spinner />
                            </>
                        ) : (
                            <>
                                Sync Data<RefreshCw />
                            </>
                        )}</Button>
                </div>
                <WorkArrangementLineChart data={data} isLoading={isLoading}></WorkArrangementLineChart>
            </div>
        </div>
    )
}