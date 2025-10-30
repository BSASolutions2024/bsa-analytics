"use client"
import { Badge } from "@/components/ui/badge"
import { ColumnDef } from "@tanstack/react-table"

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
        header: "Employee Name",
        cell: ({ row }) => (
            <div className="min-w-[100px] truncate">{row.getValue("employee_name")}</div>
        ),
    },
    {
        accessorKey: 'separation_category',
        header: "Separation Category"
    },
    {
        accessorKey: 'separation_reason',
        header: "Separation Reason"
    },
    {
        accessorKey: 'client_name',
        header: "Client/Department Name"
    },
    {
        accessorKey: "department_manager",
        header: "Department Manager"
    },
    {
        accessorKey: "sla",
        header: "SLA",
    },
    {
        accessorKey: "last_working_day",
        header: "Last Working Day"
    },
    {
        accessorKey: "date_of_initiation",
        header: "Date of Initiation"
    },
    {
        accessorKey: "completed_workflow",
        header: "Completed Workflow",
        cell: ({ row }) => {
            const values = row.getValue("completed_workflow") as string[];
            return (
                <div className="flex flex-wrap gap-1">
                    {values.map((val: string, idx: number) => (
                        <Badge key={idx} className="bg-green-800 text-white dark:bg-green-600">
                            {val}
                        </Badge>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: "pending_workflow",
        header: "Pending Workflow",
        cell: ({ row }) => {
            const values = row.getValue("pending_workflow") as string[];
            return (
                <div className="flex flex-wrap gap-1">
                    {values.map((val: string, idx: number) => (
                        <Badge key={idx} variant="destructive">
                            {val}
                        </Badge>
                    ))}
                </div>
            );
        },
    },
    {
        accessorKey: "date_of_last_pay_release",
        header: "Date of Last Pay Release"
    }
]