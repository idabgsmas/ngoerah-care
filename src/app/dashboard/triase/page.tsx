import { supabase } from '@/lib/supabaseClient'
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Activity } from 'lucide-react'

async function getTriageLogs() {
    const { data, error } = await supabase
        .from('triage_logs')
        .select('*, pasien(nama_lengkap, no_rm_4_digit)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching triage logs:", error)
        return []
    }
    return data
}

export default async function TriaseMedisPage() {
    const triageLogs = await getTriageLogs()

    // Filter dinamis untuk memfilter berdasarkan tingkat keparahan
    const filterConfigs = [
        {
            columnId: "skor_triage",
            title: "Skor Keparahan",
            options: ["Berat", "Sedang", "Ringan"],
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-sm">
                    <Activity className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Live Triase Medis</h2>
                    <p className="text-slate-500">Ringkasan evaluasi otomatis keparahan keluhan pasien.</p>
                </div>
            </div>

            {/* PERBAIKAN DI SINI: Menghapus class 'bg-white', 'shadow-sm', dan 'border' dari pembungkus luar */}
            <div className="w-full">
                <DataTable
                    columns={columns}
                    data={triageLogs}
                    searchPlaceholder="Cari keluhan atau nama pasien..."
                    filterConfigs={filterConfigs}
                    dateFilterColumn="created_at"
                />
            </div>
        </div>
    )
}