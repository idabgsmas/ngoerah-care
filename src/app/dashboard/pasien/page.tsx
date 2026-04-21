import { supabase } from '@/lib/supabaseClient'
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

async function getPasien() {
    const { data, error } = await supabase
        .from('pasien')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching pasien:", error)
        return []
    }
    return data
}

export default async function DataPasienPage() {
    const dataPasien = await getPasien()

    // MENGAMBIL DATA UNIK UNTUK MENU DROPDOWN FILTER SECARA OTOMATIS
    // Array.from(new Set(...)) digunakan untuk membuang data yang ganda/duplikat
    const uniqueAlat = Array.from(new Set(dataPasien.map((p: any) => p.tipe_alat))).filter(Boolean) as string[];
    const uniqueFase = Array.from(new Set(dataPasien.map((p: any) => p.status_fase))).filter(Boolean) as string[];
    const uniqueKasus = Array.from(new Set(dataPasien.map((p: any) => p.kasus_carsinoma))).filter(Boolean) as string[];

    // Mengirimkan struktur filter ke DataTable
    const filterConfigs = [
        {
            columnId: "status_fase",
            title: "Fase",
            options: uniqueFase,
        },
        {
            columnId: "tipe_alat",
            title: "Alat",
            options: uniqueAlat,
        },
        {
            columnId: "kasus_carsinoma",
            title: "Kasus",
            options: uniqueKasus,
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Data Pasien</h2>
                <p className="text-slate-500">Daftar seluruh pasien radioterapi yang terdaftar di sistem.</p>
            </div>

            <DataTable
                columns={columns}
                data={dataPasien}
                searchPlaceholder="Cari Nama, No RM, atau No WA..."
                filterConfigs={filterConfigs} // <-- Menyuntikkan filter ke dalam tabel
            />
        </div>
    )
}