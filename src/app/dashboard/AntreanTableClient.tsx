"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import type { Jadwal } from '@/types/database.types'

export const antreanColumns: ColumnDef<Jadwal>[] = [
    {
        accessorKey: "no_antrean",
        header: "Antrean",
        cell: ({ row }) => (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-xs mx-auto">
                {row.getValue("no_antrean") || '-'}
            </div>
        )
    },
    {
        id: "pasien",
        header: "Pasien",
        accessorFn: (row) => `${row.pasien?.nama_lengkap || ''} ${row.pasien?.no_rm_4_digit || ''}`,
        cell: ({ row }) => {
            const jadwal = row.original;
            return (
                <div>
                    <div className="font-medium text-sm">{jadwal.pasien?.nama_lengkap}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500">RM: {jadwal.pasien?.no_rm_4_digit}</div>
                </div>
            )
        }
    },
    {
        id: "alat_mesin",
        header: "Alat / Mesin",
        accessorFn: (row) => row.pasien?.tipe_alat || '-',
        filterFn: (row, columnId, filterValue) => {
            return row.getValue(columnId) === filterValue;
        },
        cell: ({ row }) => (
            <Badge variant="outline" className="font-normal bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                {row.getValue("alat_mesin") as string}
            </Badge>
        )
    },
    {
        accessorKey: "jam_sinar",
        header: () => <div className="text-center">Jam Sinar</div>,
        cell: ({ row }) => {
            const jam = row.getValue("jam_sinar") as string;
            return (
                <div className="text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                    {jam ? jam.substring(0, 5) : '--:--'}
                </div>
            )
        }
    }
]

export default function AntreanTableClient({ data }: { data: Jadwal[] }) {
    const filterConfigs = [
        { columnId: 'alat_mesin', title: 'Alat / Mesin', options: ['LINAC', 'COBALT', 'CT SIMULASI'] }
    ]

    return (
        <DataTable
            columns={antreanColumns}
            data={data}
            searchPlaceholder="Cari nama pasien atau No RM..."
            filterConfigs={filterConfigs}
        />
    )
}
