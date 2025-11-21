import { ColumnDef } from "@tanstack/react-table";

export type User = {
    name: string,
    email: string,
    role: string,
    permissions: string[]
}

export const userColumns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
        header: "Name"
    },
    {
        accessorKey: 'email',
        header: "Email"
    },
    {
        accessorFn: (row:any) => row?.role?.name,
        header: "Role",
        cell: ({ row }) => {
            const role:any = row.original.role
            const roleName = role?.name ?? ""
            return roleName
        }
    },
]