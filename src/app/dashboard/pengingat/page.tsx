import { supabase } from '@/lib/supabaseClient'
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { BellRing, CalendarClock } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Fungsi 1: Mengambil Riwayat Terkirim
async function getBroadcastLogs() {
    const { data, error } = await supabase
        .from('chat_history')
        .select('*, pasien(nama_lengkap, no_rm_4_digit)')
        .ilike('pesan', '%PENGINGAT OTOMATIS:%')
        .order('created_at', { ascending: false })
        .limit(500)

    if (error) {
        console.error("Error fetching broadcasts:", error)
        return []
    }
    return data
}

// Fungsi 2: Mengambil Jadwal Besok (Untuk Prediksi Antrean Pengingat)
async function getAntreanBesok() {
    // Mencari tanggal besok
    const besok = new Date()
    besok.setDate(besok.getDate() + 1)
    const besokStr = besok.toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('jadwal')
        .select('*, pasien(nama_lengkap, no_rm_4_digit)')
        .eq('tgl_tindakan', besokStr)
        .order('no_antrean', { ascending: true })

    if (error) {
        console.error("Error fetching antrean:", error)
        return []
    }
    return data
}

export default async function PengingatOtomatisPage() {
    const broadcastLogs = await getBroadcastLogs()
    const antreanBesok = await getAntreanBesok()

    const filterConfigs = [
        {
            columnId: "jenis_pengingat",
            title: "Kategori",
            options: ["Evaluasi Rutin (K-5)", "Kontrol Restaging", "Info CT Simulasi", "Lainnya"],
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm">
                    <BellRing className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Pengingat Otomatis</h2>
                    <p className="text-slate-500">Pusat pemantauan antrean dan riwayat pesan broadcast WhatsApp.</p>
                </div>
            </div>

            {/* SECTION 1: Antrean Pengingat Besok */}
            <Card className="border-amber-200/50 shadow-sm">
                <CardHeader className="bg-amber-50/30 pb-4">
                    <div className="flex items-center gap-2">
                        <CalendarClock className="h-5 w-5 text-amber-500" />
                        <CardTitle className="text-lg text-amber-900">Antrean Pengingat (Tindakan Besok)</CardTitle>
                    </div>
                    <CardDescription>
                        Prediksi pasien yang akan menerima notifikasi dari Ngoerah Care berdasarkan jadwal tindakan esok hari.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="rounded-md border bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">No. RM</TableHead>
                                    <TableHead>Nama Pasien</TableHead>
                                    <TableHead className="text-center">Fraksi Besok</TableHead>
                                    <TableHead>Prediksi Jenis Pengingat</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {antreanBesok && antreanBesok.length > 0 ? (
                                    antreanBesok.map((jadwal: any) => {
                                        // Logika prediksi: Jika fraksi besok adalah kelipatan 5, maka itu evaluasi K-5
                                        const fraksiBesok = jadwal.fraksi_ke;
                                        const isK5 = fraksiBesok > 0 && fraksiBesok % 5 === 0;

                                        return (
                                            <TableRow key={jadwal.id_jadwal}>
                                                <TableCell className="font-medium">{jadwal.pasien?.no_rm_4_digit || '-'}</TableCell>
                                                <TableCell>{jadwal.pasien?.nama_lengkap || 'Unknown'}</TableCell>
                                                <TableCell className="text-center font-semibold text-blue-600">{fraksiBesok}</TableCell>
                                                <TableCell>
                                                    {isK5 ? (
                                                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                                            📢 Evaluasi Rutin (K-5)
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-slate-400">
                                                            Jadwal Radiasi Rutin
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                            Tidak ada data jadwal untuk besok.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 2: Riwayat Terkirim */}
            <Card className="shadow-sm">
                <CardHeader className="border-b pb-4">
                    <CardTitle className="text-lg">Riwayat Pengingat Terkirim</CardTitle>
                    <CardDescription>Log pesan broadcast otomatis yang sudah berhasil dikirimkan oleh sistem.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <DataTable
                        columns={columns}
                        data={broadcastLogs}
                        searchPlaceholder="Cari nama pasien atau isi pesan..."
                        filterConfigs={filterConfigs}
                        dateFilterColumn="created_at"
                    />
                </CardContent>
            </Card>

        </div>
    )
}