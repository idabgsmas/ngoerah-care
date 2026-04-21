"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

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
        header: "Alat", // <-- Kolom baru
    },
    {
        accessorKey: "status_fase",
        header: () => <div className="text-left">Status Fase</div>, // Meratakan header ke tengah
        cell: ({ row }) => {
            const status = row.getValue("status_fase") as string;
            return (
                <div className="flex justify-left"> {/* Meratakan badge ke tengah */}
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
        header: () => <div className="text-center">Total Fraksi</div>, // Meratakan header ke tengah
        cell: ({ row }) => <div className="text-center">{row.getValue("total_fraksi")}</div>, // Meratakan angka ke tengah
    },
]