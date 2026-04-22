"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type BroadcastLog = {
    id_chat: string
    created_at: string
    pesan: string
    pasien: {
        nama_lengkap: string
        no_rm_4_digit: string
    }
}

export const columns: ColumnDef<BroadcastLog>[] = [
    {
        accessorKey: "created_at",
        header: "Waktu Terkirim",
        filterFn: (row, columnId, filterValue) => {
            if (!filterValue) return true;
            const dateStr = new Date(row.getValue(columnId) as string).toISOString().split('T')[0];
            return dateStr === filterValue;
        },
        cell: ({ row }) => (
            <div className="font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap align-top">
                {new Date(row.getValue("created_at")).toLocaleString('id-ID', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                })}
            </div>
        )
    },
    {
        id: "pasien_info",
        accessorFn: (row) => `${row.pasien?.nama_lengkap || ''} ${row.pasien?.no_rm_4_digit || ''}`,
        header: "Penerima (Pasien)",
        cell: ({ row }) => {
            const data = row.original;
            return (
                <div className="align-top min-w-[150px]">
                    <div className="font-medium dark:text-slate-200">{data.pasien?.nama_lengkap || 'Unknown'}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">RM: {data.pasien?.no_rm_4_digit || '-'}</div>
                </div>
            )
        }
    },
    {
        id: "jenis_pengingat",
        header: "Kategori Pengingat",
        accessorFn: (row) => {
            const teks = row.pesan?.toLowerCase() || '';
            if (teks.includes('kelipatan 5') || teks.includes('radiasi ke-')) return 'Evaluasi Rutin (K-5)';
            if (teks.includes('restaging') || teks.includes('kontrol evaluasi')) return 'Kontrol Restaging';
            if (teks.includes('ct simulasi')) return 'Info CT Simulasi';
            return 'Lainnya';
        },
        cell: ({ row }) => {
            const kategori = row.getValue("jenis_pengingat") as string;
            return (
                <div className="align-top">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/40">
                        {kategori}
                    </Badge>
                </div>
            )
        }
    },
    {
        accessorKey: "pesan",
        header: "Isi Pesan Broadcast",
        cell: ({ row }) => {
            const pesan = row.getValue("pesan") as string;
            const teksBersih = pesan ? pesan.replace('PENGINGAT OTOMATIS: ', '') : '-';
            return (
                // BAGIAN DIPERBAIKI: Memastikan teks di-wrap dan lebarnya dibatasi
                <div className="align-top max-w-xs md:max-w-md lg:max-w-2xl">
                    <p className="text-sm whitespace-pre-wrap break-words text-slate-600 dark:text-slate-300">
                        {teksBersih}
                    </p>
                </div>
            )
        }
    }
]