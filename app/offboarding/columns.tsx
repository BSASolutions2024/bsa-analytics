import { ColumnDef } from "@tanstack/react-table"

export type Offboarding = {
    name: string
    department_manager: string
    sla: number
    last_working_day: Date
    date_of_initiation: Date
    completed_workflow: string[]
    pending_workflow: string[]
    date_of_last_pay_release: Date
}

export const columns: ColumnDef<Offboarding>[] = [
    {
        accessorKey: 'name',
        header: "Name"
    },
    {
        accessorKey: "department_manager",
        header: "Department Manager"
    },
    {
        accessorKey: "sla",
        header: "SLA"
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
        header: "Completed Workflow"
    },
    {
        accessorKey: "pending_workflow",
        header: "Pending Workflow"
    },
    {
        accessorKey: "date_of_last_pay_release",
        header: "Date of Last Pay Release"
    }
]