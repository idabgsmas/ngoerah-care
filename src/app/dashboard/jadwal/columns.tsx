"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type Jadwal = {
    id_jadwal: string
    tgl_tindakan: string
    no_antrean: number
    fraksi_ke: number
    jam_sinar: string
    is_reminded_k5: boolean
    pasien: {
        nama_lengkap: string
        no_rm_4_digit: string
        tipe_alat: string
    }
}

export const columns: ColumnDef<Jadwal>[] = [
    {
        accessorKey: "tgl_tindakan",
        header: "Tanggal",
        // Mengajari tabel cara memfilter tanggal yang spesifik
        filterFn: (row, columnId, filterValue) => {
            if (!filterValue) return true;
            // Memotong string ISO hanya mengambil bagian 'YYYY-MM-DD'
            const dateStr = new Date(row.getValue(columnId) as string).toISOString().split('T')[0];
            return dateStr === filterValue;
        },
        cell: ({ row }) => {
            return (
                <div className="font-medium whitespace-nowrap">
                    {new Date(row.getValue("tgl_tindakan")).toLocaleDateString('id-ID', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                    })}
                </div>
            )
        }
    },
    {
        accessorKey: "no_antrean",
        header: () => <div className="text-center">No. Antrean</div>,
        cell: ({ row }) => {
            const antrean = row.getValue("no_antrean") as number;
            return <div className="text-center font-bold text-blue-600">{antrean === 0 ? '-' : antrean}</div>
        }
    },
    {
        id: "no_rm",
        accessorFn: (row) => row.pasien?.no_rm_4_digit,
        header: "No. RM",
    },
    {
        id: "nama_pasien",
        accessorFn: (row) => row.pasien?.nama_lengkap,
        header: "Nama Pasien",
    },
    {
        id: "tipe_alat",
        accessorFn: (row) => row.pasien?.tipe_alat,
        header: "Alat",
    },
    {
        accessorKey: "fraksi_ke",
        header: () => <div className="text-center">Fraksi Ke</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("fraksi_ke")}</div>
    },
    {
        accessorKey: "jam_sinar",
        header: "Jam Sinar",
    },
    {
        id: "status_pengingat",
        accessorFn: (row) => row.is_reminded_k5 ? "Terkirim" : "Belum",
        header: () => <div className="text-center">Pengingat K-5</div>,
        cell: ({ row }) => {
            const isReminded = row.getValue("status_pengingat") === "Terkirim";
            return (
                <div className="flex justify-center">
                    {isReminded ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">Terkirim</Badge>
                    ) : (
                        <Badge variant="outline" className="text-slate-400">Belum</Badge>
                    )}
                </div>
            )
        }
    },
]