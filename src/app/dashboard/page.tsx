import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Activity, CalendarDays, CheckCircle2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

async function getDashboardData() {
    const today = new Date().toISOString().split('T')[0];

    // 1. Menghitung Statistik (Sama seperti sebelumnya)
    const { count: totalPasien } = await supabase.from('pasien').select('*', { count: 'exact', head: true })
    const { count: pasienAktif } = await supabase.from('pasien').select('*', { count: 'exact', head: true }).eq('status_fase', 'Masa Radiasi')
    const { count: pasienSelesai } = await supabase.from('pasien').select('*', { count: 'exact', head: true }).eq('status_fase', 'Selesai Radiasi')
    const { count: jadwalHariIni } = await supabase.from('jadwal').select('*', { count: 'exact', head: true }).eq('tgl_tindakan', today)

    // 2. Mengambil 5 Jadwal Terbaru untuk Widget
    const { data: jadwalTerbaru } = await supabase
        .from('jadwal')
        .select('*, pasien(nama_lengkap)')
        .order('tgl_tindakan', { ascending: false })
        .limit(5)

    // 3. Mengambil 5 Log Triase Terbaru untuk Widget
    const { data: triaseTerbaru } = await supabase
        .from('chat_history')
        .select('*, pasien(nama_lengkap)')
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        stats: {
            totalPasien: totalPasien || 0,
            pasienAktif: pasienAktif || 0,
            pasienSelesai: pasienSelesai || 0,
            jadwalHariIni: jadwalHariIni || 0
        },
        jadwalTerbaru: jadwalTerbaru || [],
        triaseTerbaru: triaseTerbaru || []
    }
}

export default async function DashboardOverview() {
    const data = await getDashboardData()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Overview Dashboard</h2>
                <p className="text-slate-500">Selamat datang di Sistem Pemantauan Pasien Radioterapi RSUP Ngoerah.</p>
            </div>

            {/* Grid untuk Kartu Statistik (Bagian Atas) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pasien Aktif (Radiasi)</CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.pasienAktif}</div>
                        <p className="text-xs text-slate-500">Sedang dalam masa tindakan</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
                        <CalendarDays className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.jadwalHariIni}</div>
                        <p className="text-xs text-slate-500">Antrean radiasi hari ini</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Selesai Radiasi</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.pasienSelesai}</div>
                        <p className="text-xs text-slate-500">Masuk masa kontrol/restaging</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Database Pasien</CardTitle>
                        <Users className="h-4 w-4 text-slate-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.totalPasien}</div>
                        <p className="text-xs text-slate-500">Seluruh data terekam</p>
                    </CardContent>
                </Card>
            </div>

            {/* Grid untuk Widget Konten (Bagian Bawah) */}
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">

                {/* Widget Kiri: Jadwal Terbaru (Mengambil porsi 4 kolom) */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Jadwal Radiasi Terbaru</CardTitle>
                        <CardDescription>Menampilkan 5 jadwal pasien terakhir.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Pasien</TableHead>
                                    <TableHead>Jam</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.jadwalTerbaru.map((jadwal: any) => (
                                    <TableRow key={jadwal.id_jadwal}>
                                        <TableCell className="font-medium whitespace-nowrap">
                                            {new Date(jadwal.tgl_tindakan).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </TableCell>
                                        <TableCell>{jadwal.pasien?.nama_lengkap}</TableCell>
                                        <TableCell>{jadwal.jam_sinar}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Widget Kanan: Triase Terbaru (Mengambil porsi 3 kolom) */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Log Triase & Notifikasi</CardTitle>
                        <CardDescription>Aktivitas pesan terbaru.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.triaseTerbaru.map((chat: any) => {
                                const isSystem = chat.role === 'assistant' || chat.role === 'system';
                                return (
                                    <div key={chat.id_chat} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {chat.pasien?.nama_lengkap || 'Unknown'}
                                            </p>
                                            <p className="text-sm text-slate-500 line-clamp-2">
                                                <span className="font-semibold text-slate-700">{isSystem ? 'Sistem: ' : 'Pasien: '}</span>
                                                {chat.pesan}
                                            </p>
                                        </div>
                                        <div className="text-xs text-slate-400 whitespace-nowrap">
                                            {new Date(chat.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}