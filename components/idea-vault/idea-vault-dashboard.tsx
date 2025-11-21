"use client"

import { useEffect, useState } from "react";
import { StandardDataTable } from "../data-table/data-table-standard";
import { ideaVaultColumns } from "@/app/(dashboard)/idea-vault/columns";

export default function IdeaVaultDashboard() {
    const [data, setData] = useState([]);
    const [fetchedAt, setFetchedAt] = useState<String>()
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [filteredData, setFilteredData] = useState([])

    const fetchData = async () => {
        try {
            const res = await fetch(`/api/idea-vault/get-data`, {
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

    const onFilterData = (filter: any) => {
        setFilteredData(filter)
    }
    return (
        <div className="flex flex-col gap-4">
            <StandardDataTable data={data} columns={ideaVaultColumns} isLoading={isLoading} onFilteredDataChange={onFilterData} />
        </div>
    )
}