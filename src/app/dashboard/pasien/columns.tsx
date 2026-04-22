"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export type Pasien = {
    id_pasien: string
    no_rm_4_digit: string
    nama_lengkap: string
    no_wa_primary: string
    kasus_carsinoma: string
    tipe_alat: string
    status_fase: string
    total_fraksi: number
}

// Callback yang akan di-set dari parent page
let onDetailClick: ((pasien: Pasien) => void) | null = null

export function setOnDetailClick(callback: (pasien: Pasien) => void) {
    onDetailClick = callback
}

export const columns: ColumnDef<Pasien>[] = [
    {
        accessorKey: "no_rm_4_digit",
        header: "4 Digit Kode RM",
        cell: ({ row }) => <div className="font-medium">{row.getValue("no_rm_4_digit")}</div>,
    },
    {
        accessorKey: "nama_lengkap",
        header: "Nama Pasien",
    },
    {
        accessorKey: "no_wa_primary",
        header: "No. WhatsApp",
    },
    {
        accessorKey: "kasus_carsinoma",
        header: "Kasus",
    },
    {
        accessorKey: "tipe_alat",
        header: "Alat",
    },
    {
        accessorKey: "status_fase",
        header: () => <div className="text-left">Status Fase</div>,
        cell: ({ row }) => {
            const status = row.getValue("status_fase") as string;
            return (
                <div className="flex justify-left">
                    <Badge variant={
                        status === 'Proses Fisikawan' ? 'secondary' :
                            status === 'Selesai Radiasi' ? 'default' :
                                status === 'Masa Radiasi' ? 'destructive' : 'outline'
                    }>
                        {status}
                    </Badge>
                </div>
            )
        }
    },
    {
        accessorKey: "total_fraksi",
        header: () => <div className="text-center">Total Fraksi</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("total_fraksi")}</div>,
    },
    {
        id: "aksi",
        header: () => <div className="text-center">Aksi</div>,
        cell: ({ row }) => {
            const pasien = row.original;
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => onDetailClick?.(pasien)}
                    >
                        <Eye className="h-4 w-4" />
                        Detail
                    </Button>
                </div>
            )
        }
    },
]