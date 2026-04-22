"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"

interface FilterConfig {
    columnId: string
    title: string
    options: string[]
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchPlaceholder?: string
    filterConfigs?: FilterConfig[]
    dateFilterColumn?: string // <-- Properti baru untuk Filter Tanggal
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = "Cari data...",
    filterConfigs = [],
    dateFilterColumn,
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = React.useState("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter !== ""

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="flex flex-1 flex-wrap items-center gap-3">
                    {/* 1. Global Search */}
                    <div className="flex w-full max-w-sm items-center gap-2 md:w-auto">
                        <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(String(event.target.value))}
                            className="w-full md:w-[250px]"
                        />
                    </div>

                    {/* 2. Filter Tanggal (Jika ada) */}
                    {dateFilterColumn && (
                        <Input
                            type="date"
                            value={(table.getColumn(dateFilterColumn)?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(dateFilterColumn)?.setFilterValue(event.target.value || undefined)
                            }
                            className="w-full md:w-[150px] bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                        />
                    )}

                    {/* 3. Custom Select Filters */}
                    {filterConfigs.map((filter) => (
                        <Select
                            key={filter.columnId}
                            value={(table.getColumn(filter.columnId)?.getFilterValue() as string) ?? "all"}
                            onValueChange={(value) => {
                                table.getColumn(filter.columnId)?.setFilterValue(value === "all" ? undefined : value)
                            }}
                        >
                            <SelectTrigger className="h-9 w-[150px] bg-white dark:bg-slate-900 dark:border-slate-800">
                                <SelectValue placeholder={`Semua ${filter.title}`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua {filter.title}</SelectItem>
                                {filter.options.map((opt) => (
                                    <SelectItem key={opt} value={opt}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    ))}

                    {/* 4. Tombol Reset */}
                    {isFiltered && (
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setGlobalFilter("")
                                table.resetColumnFilters()
                            }}
                            className="h-9 px-2 text-slate-500 hover:text-slate-900 lg:px-3"
                        >
                            Reset
                            <X className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* 5. Rows Per Page */}
                <div className="flex items-center space-x-2">
                    <p className="hidden text-sm text-slate-500 md:block">Tampilkan</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger className="h-9 w-[70px] bg-white dark:bg-slate-900 dark:border-slate-800">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[5, 10, 20, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <p className="hidden text-sm text-slate-500 md:block">data</p>
                </div>
            </div>

            {/* Tabel Data */}
            <div className="rounded-md border dark:border-slate-800 bg-white dark:bg-slate-900">
                <Table>
                    {/* Header & Body Table (Tetap sama seperti sebelumnya) */}
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center text-slate-500">
                                    Tidak ada jadwal di tanggal atau pencarian ini.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-slate-500">
                    Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
                </div>
                <div className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Sebelumnya</Button>
                    <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Selanjutnya</Button>
                </div>
            </div>
        </div>
    )
}