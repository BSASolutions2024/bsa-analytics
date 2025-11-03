"use client"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatDate, parseDateString } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { BadgeCheckIcon, BadgeMinus } from "lucide-react"

export type Offboarding = {
    employee_id: string
    employee_name: string
    separation_category: string
    separation_reason: string
    client_name: string
    department_manager: string
    sla: number
    last_working_day: Date
    date_of_initiation: Date
    completed_workflow: string[]
    pending_workflow: string[]
    date_of_last_pay_release?: Date
}

export const columns: ColumnDef<Offboarding>[] = [
    {
        accessorKey: 'employee_id',
        header: "Employee ID",
        cell: ({ row }) => (
            <div className="min-w-[100px] truncate">{row.getValue("employee_id")}</div>
        ),
    },
    {
        accessorKey: 'employee_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Employee Name" />
        ),
        cell: ({ row }) => (
            <div className="min-w-[100px] truncate">{row.getValue("employee_name")}</div>
        ),
    },
    {
        accessorKey: 'separation_category',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Separation Category" />
        ),
    },
    {
        accessorKey: 'separation_reason',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Separation Reason" />
        ),
    },
    {
        accessorKey: 'client_name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Client/Department Name" />
        ),
    },
    {
        accessorKey: "department_manager",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Department Manager" />
        ),
    },
    {
        accessorKey: "sla",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="SLA" />
        ),
    },
    {
        accessorKey: "last_working_day",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Last Working Day" />
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const a = parseDateString(rowA.getValue(columnId));
            const b = parseDateString(rowB.getValue(columnId));
            return a.getTime() - b.getTime();
        },
    },
    {
        accessorKey: "date_of_initiation",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Date of Initiation" />
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const a = parseDateString(rowA.getValue(columnId));
            const b = parseDateString(rowB.getValue(columnId));
            return a.getTime() - b.getTime();
        },
        filterFn: (row, columnId, filterValue) => {
            // filterValue = { from: Date, to: Date }
            const date = parseDateString(row.getValue(columnId));
            const from = filterValue?.from;
            const to = filterValue?.to;

            if (from && date < from) return false;
            if (to && date > to) return false;
            return true;
        },

    },
    {
        accessorKey: "completed_workflow",
        header: () => <p className="text-center">Completed Workflow</p>,
        cell: ({ row }) => {
            const values = row.getValue("completed_workflow") as string[];
            return (
                <div className="flex justify-center">
                    {values.length === 0 ? (
                        <Badge className="cursor-pointer" variant="outline">Completed</Badge>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Badge className="bg-green-800 cursor-pointer">{values.length}</Badge>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto flex flex-col gap-1">
                                {values.map((val: string, idx: number) => (
                                    <Badge key={idx} className="bg-green-800 text-white dark:bg-green-600">
                                        <BadgeCheckIcon />
                                        {val}
                                    </Badge>
                                ))}
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "pending_workflow",
        header: () => <p className="text-center">Pending Workflow</p>,
        cell: ({ row }) => {
            const values = row.getValue("pending_workflow") as string[];
            return (
                <div className="flex justify-center">
                    {values.length === 0 ? (
                        <Badge className="cursor-pointer" variant="secondary">Completed</Badge>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Badge className="cursor-pointer" variant="destructive">{values.length}</Badge>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto flex flex-col gap-1">
                                {values.map((val: string, idx: number) => (
                                    <Badge key={idx} variant="destructive">
                                        <BadgeMinus />
                                        {val}
                                    </Badge>
                                ))}
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "date_of_last_pay_release",
        header: "Date of Last Pay Release"
    }
]