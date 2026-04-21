"use client"

import { ColumnDef } from "@tanstack/react-table"

export type ChatPair = {
    id_chat: string
    created_at: string
    pasien: {
        nama_lengkap: string
        no_rm_4_digit: string
    }
    pesan_pasien: string
    pesan_sistem: string
}

export const columns: ColumnDef<ChatPair>[] = [
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
        accessorFn: (row) => `${row.pasien?.nama_lengkap || 'Unknown'} ${row.pasien?.no_rm_4_digit || ''}`,
        header: "Pasien (RM)",
        cell: ({ row }) => {
            const chat = row.original;
            return (
                <div className="align-top min-w-[150px]">
                    <div className="font-medium">{chat.pasien?.nama_lengkap || 'Unknown'}</div>
                    <div className="text-xs text-slate-500">RM: {chat.pasien?.no_rm_4_digit || '-'}</div>
                </div>
            )
        }
    },
    {
        accessorKey: "pesan_pasien",
        header: "Pesan / Keluhan Pasien",
        cell: ({ row }) => {
            const pesan = row.getValue("pesan_pasien") as string | null;

            // JARING PENGAMAN: Jika pesan null, undefined, atau '-', tampilkan strip saja
            if (!pesan || pesan === '-') {
                return <div className="text-slate-300 italic align-top">-</div>
            }

            return (
                <div className="align-top max-w-xs md:max-w-sm">
                    <p className="text-sm whitespace-pre-wrap break-words text-slate-700">
                        {pesan}
                    </p>
                </div>
            )
        }
    },
    {
        accessorKey: "pesan_sistem",
        header: "Respon Ngoerah Care",
        cell: ({ row }) => {
            const pesan = row.getValue("pesan_sistem") as string | null;

            // JARING PENGAMAN: Mencegah crash membaca pesan kosong/null dari database
            if (!pesan || pesan === '-') {
                return <div className="text-slate-300 italic align-top">-</div>
            }

            // Karena !pesan sudah dilewati, kita aman menjalankan fungsi string seperti .includes dan .replace
            const isPengingat = pesan.includes('PENGINGAT OTOMATIS:');

            return (
                <div className="align-top max-w-xs md:max-w-sm">
                    <div className={`p-3 rounded-md text-sm whitespace-pre-wrap break-words ${isPengingat ? 'bg-amber-50 text-amber-800 border border-amber-100' : 'bg-blue-50/50 text-slate-700 border border-blue-100/50'}`}>
                        {isPengingat ? <span className="font-semibold block mb-1">📢 Broadcast Pengingat</span> : null}
                        {pesan.replace('PENGINGAT OTOMATIS: ', '')}
                    </div>
                </div>
            )
        }
    }
]