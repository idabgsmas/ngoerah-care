import { createSupabaseServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

async function getJadwal(alatFilter?: string) {
    const supabase = await createSupabaseServerClient();
    let query = supabase
        .from('jadwal')
        .select('*, pasien!inner(nama_lengkap, no_rm_4_digit, tipe_alat)')
        // Mengurutkan berdasarkan Tanggal dulu (terdekat), lalu berdasarkan No Antrean secara Menurun (1, 2, 3...)
        .order('tgl_tindakan', { ascending: false })
        .order('no_antrean', { ascending: true })

    if (alatFilter) {
        query = query.ilike('pasien.tipe_alat', alatFilter)
    }

    const { data, error } = await query

    if (error) {
        console.error("Error fetching jadwal:", error)
        return []
    }
    return data
}

export default async function JadwalRadiasiPage(props: {
    searchParams: Promise<{ alat?: string }>
}) {
    const searchParams = await props.searchParams;
    const alat = searchParams?.alat;
    const dataJadwal = await getJadwal(alat)

    const filterConfigs = [
        {
            columnId: "status_pengingat",
            title: "Status Pengingat",
            options: ["Terkirim", "Belum"],
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    {alat ? `Jadwal Radiasi: ${alat.toUpperCase()}` : "Semua Jadwal Radiasi"}
                </h2>
                <p className="text-slate-500">Daftar antrean dan jadwal tindakan radioterapi pasien.</p>
            </div>

            <div className="rounded-md bg-white dark:bg-transparent">
                <DataTable
                    columns={columns}
                    data={dataJadwal}
                    searchPlaceholder="Cari Nama Pasien atau 4 Digit Kode RM..."
                    filterConfigs={filterConfigs}
                    dateFilterColumn="tgl_tindakan" // <-- Mengaktifkan filter kalender untuk kolom Tanggal
                />
            </div>
        </div>
    )
}