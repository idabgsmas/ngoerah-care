"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type TriageLog = {
    id_log: string
    created_at: string
    skor_triage: string
    detail_keluhan: string
    saran_sistem: string
    pasien: {
        nama_lengkap: string
        no_rm_4_digit: string
    } | null
}

export const columns: ColumnDef<TriageLog>[] = [
    {
        accessorKey: "created_at",
        header: "Waktu",
        filterFn: (row, columnId, filterValue) => {
            if (!filterValue) return true;
            const dateStr = new Date(row.getValue(columnId) as string).toISOString().split('T')[0];
            return dateStr === filterValue;
        },
        cell: ({ row }) => {
            return (
                <div className="font-medium text-slate-600 whitespace-nowrap align-top">
                    {new Date(row.getValue("created_at")).toLocaleString('id-ID', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    })}
                </div>
            )
        }
    },
    {
        id: "pasien_info",
        accessorFn: (row) => `${row.pasien?.nama_lengkap || 'Tidak Diketahui'} ${row.pasien?.no_rm_4_digit || ''}`,
        header: "Pasien (RM)",
        cell: ({ row }) => {
            const log = row.original;
            return (
                <div className="align-top min-w-[150px]">
                    <div className="font-medium">{log.pasien?.nama_lengkap || 'Sistem / Anonim'}</div>
                    <div className="text-xs text-slate-500">RM: {log.pasien?.no_rm_4_digit || '-'}</div>
                </div>
            )
        }
    },
    {
        accessorKey: "skor_triage",
        header: () => <div className="text-center">Skor Triase</div>,
        cell: ({ row }) => {
            const skor = row.getValue("skor_triage") as string;

            let badgeStyle = "bg-slate-100 text-slate-800";
            if (skor === 'Berat') badgeStyle = "bg-red-100 text-red-800 hover:bg-red-200 border-transparent";
            else if (skor === 'Sedang') badgeStyle = "bg-amber-100 text-amber-800 hover:bg-amber-200 border-transparent";
            else if (skor === 'Ringan') badgeStyle = "bg-green-100 text-green-800 hover:bg-green-200 border-transparent";

            return (
                <div className="flex justify-center align-top">
                    <Badge variant="outline" className={badgeStyle}>
                        {skor || 'Tidak Ada'}
                    </Badge>
                </div>
            )
        }
    },
    {
        accessorKey: "detail_keluhan",
        header: "Detail Keluhan",
        cell: ({ row }) => {
            const keluhan = row.getValue("detail_keluhan") as string;
            return (
                <div className="align-top max-w-xs md:max-w-sm">
                    <p className="text-sm whitespace-pre-wrap break-words text-slate-700">
                        {keluhan || '-'}
                    </p>
                </div>
            )
        }
    },
    {
        accessorKey: "saran_sistem",
        header: "Saran dr. Daksa (AI)",
        cell: ({ row }) => {
            const saran = row.getValue("saran_sistem") as string;
            return (
                <div className="align-top max-w-xs md:max-w-sm">
                    <p className="text-sm whitespace-pre-wrap break-words text-slate-600">
                        {saran || '-'}
                    </p>
                </div>
            )
        }
    }
]