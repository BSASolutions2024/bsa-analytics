"use client"

import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DateRangeFilter } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { downloadExcel, formatDateWithTime } from "@/lib/utils"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState
} from "@tanstack/react-table"
import { useEffect, useState } from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading: boolean,
    onFilteredDataChange?: (filtered: TData[]) => void
}

export function OffboardingDataTable<TData, TValue>({
    columns,
    data,
    isLoading,
    onFilteredDataChange
}: DataTableProps<TData, TValue>) {
    const [filteredData, setFilteredData] = useState<any>([])
    const [globalFilter, setGlobalFilter] = useState<any>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        state: {
            columnFilters,
            sorting,
            globalFilter,
            columnVisibility
        },
    })

    useEffect(() => {
        let isMounted = true;

        const visibleColumns = table
            .getAllLeafColumns()
            .filter(col => col.getIsVisible())
            .map(col => col.id);

        const filtered = table.getSortedRowModel().rows.map(row => {
            const rowData: Record<string, any> = {};
            const original = row.original as Record<string, any>;

            visibleColumns.forEach(colId => {
                rowData[colId] = original[colId];
            });

            return rowData;
        });

        onFilteredDataChange?.(table.getSortedRowModel().rows.map(row => row.original as TData))

        if (isMounted) setFilteredData(filtered);

        return () => {
            isMounted = false;
        };
    }, [
        table.options.data,
        globalFilter,
        sorting,
        columnFilters,
        columnVisibility
    ]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between py-4">
                <Input
                    placeholder="Search..."
                    onChange={(event) =>
                        table.setGlobalFilter(String(event.target.value))
                    }
                    className="max-w-sm"
                />
                <div className="flex flex-row space-x-2">
                    <Label htmlFor="terms">Data as of:</Label>
                    <DateRangeFilter column={table.getColumn("date_of_initiation")} />
                    <Button className="w-auto self-end" onClick={() =>
                        downloadExcel(filteredData,
                            `Offboarding-${formatDateWithTime(new Date())}.xlsx`
                        )}>Export</Button>
                </div>
            </div>
            <div className="overflow-x-auto rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-4">
                                    Loading…
                                </td>
                            </tr>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="min-w-[100px]">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
        </div>
    )
}