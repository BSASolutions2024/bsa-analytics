"use client"
import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"

export type IdeaVault = {
    date_received: Date
    status: string
    category: string
    suggestions: string
    suggestionWouldBenefit: string
    otherSuggestion: string
    response: string
    total_running_time: string
    decision: string
    timeline: Date
    department_owner: string
    completion_date: string
}
export const ideaVaultColumns: ColumnDef<IdeaVault>[] = [
    {
        accessorKey: 'date_received',
        header: "Date Received"
    },
    {
        accessorKey: 'status',
        header: "Status"
    },
    {
        accessorKey: 'category',
        header: "Category"
    },
    {
        accessorKey: 'suggestions',
        header: "Suggestions",
        cell: ({ row }) => {
            const [expanded, setExpanded] = useState(false)
            const text = row.getValue("suggestions") as string

            return (
                <div
                    className="w-[300px] cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                >
                    <p className={!expanded ? "truncate" : "whitespace-normal"}>
                        {text}
                    </p>

                    {!expanded && text.length > 100 && (
                        <span className="text-blue-600 text-xs">See more</span>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: 'response',
        header: "Response",
        cell: ({ row }) => {
            const [expanded, setExpanded] = useState(false);

            // Get the value safely and fallback to empty string
            const rawText = row.getValue("response");
            const text = typeof rawText === "string" ? rawText : "";

            return (
                <div
                    className="w-[300px] cursor-pointer"
                    onClick={() => setExpanded(!expanded)}
                >
                    <p className={!expanded ? "truncate" : "whitespace-normal"}>
                        {text}
                    </p>

                    {!expanded && text.length > 50 && (
                        <span className="text-blue-600 text-xs">See more</span>
                    )}
                </div>
            );
        }
    },
    {
        accessorKey: 'total_running_time',
        header: "Total Running Time",
        cell: ({ row }) => {
            return <p>{row.getValue("total_running_time")} day{Math.abs(row.getValue("total_running_time")) >= 1 ? "s" : ""}</p>
        }
    },
    {
        accessorKey: 'decision',
        header: "Decision"
    },
    {
        accessorKey: 'timeline',
        header: "Timeline"
    },
    {
        accessorKey: 'department_owner',
        header: "Department Owner"
    },
    {
        accessorKey: 'completion_date',
        header: "Completion Date"
    },
]