"use client"
import { columns, Offboarding } from "@/app/offboarding/columns";
import { OffboardingDataTable } from "@/app/offboarding/data-table";
import { useEffect, useState } from "react";

export default function OffboardingDashboard() {
    const [data, setData] = useState<Offboarding[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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
        <div>
            <OffboardingDataTable columns={columns} data={data} isLoading={isLoading}/>
        </div>
    )
}