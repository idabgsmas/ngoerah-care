import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Activity, CalendarDays, CheckCircle2, Clock } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import RealtimeTriaseRadar from '@/components/RealtimeTriaseRadar'
import type { TriageLog, Jadwal, ChatHistory } from '@/types/database.types'

export const dynamic = 'force-dynamic'

async function getDashboardData() {
    const supabase = await createSupabaseServerClient();
    const today = new Date().toISOString().split('T')[0];

    // 1. Statistik Utama
    const { count: totalPasien } = await supabase.from('pasien').select('*', { count: 'exact', head: true })
    const { count: pasienAktif } = await supabase.from('pasien').select('*', { count: 'exact', head: true }).eq('status_fase', 'Masa Radiasi')
    const { count: pasienSelesai } = await supabase.from('pasien').select('*', { count: 'exact', head: true }).eq('status_fase', 'Selesai Radiasi')
    const { count: jadwalHariIniCount } = await supabase.from('jadwal').select('*', { count: 'exact', head: true }).eq('tgl_tindakan', today)

    // 2. Radar Triase Darurat (Khusus Skor: Berat DAN is_handled: false yang terjadi HARI INI)
    const { data: triaseDarurat } = await supabase
        .from('triage_logs')
        .select('*, pasien(nama_lengkap, no_rm_4_digit, no_wa_primary)')
        .eq('skor_triage', 'Berat')
        .eq('is_handled', false) // Filter hanya yang belum ditangani
        .gte('created_at', `${today}T00:00:00`)
        .order('created_at', { ascending: false })

    // 3. Antrean Hari Ini (Lengkap dengan Kategori Alat)
    const { data: antreanHariIni } = await supabase
        .from('jadwal')
        .select('*, pasien(nama_lengkap, no_rm_4_digit, tipe_alat)')
        .eq('tgl_tindakan', today)
        .order('no_antrean', { ascending: true })

    // 4. Log Chat Terbaru (Untuk Widget Kanan)
    const { data: chatTerbaru } = await supabase
        .from('chat_history')
        .select('*, pasien(nama_lengkap)')
        .order('created_at', { ascending: false })
        .limit(5)

    return {
        stats: {
            totalPasien: totalPasien || 0,
            pasienAktif: pasienAktif || 0,
            pasienSelesai: pasienSelesai || 0,
            jadwalHariIni: jadwalHariIniCount || 0
        },
        triaseDarurat: (triaseDarurat || []) as TriageLog[],
        antreanHariIni: (antreanHariIni || []) as Jadwal[],
        chatTerbaru: (chatTerbaru || []) as ChatHistory[]
    }
}

export default async function DashboardOverview() {
    const data = await getDashboardData()

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Overview Dashboard</h2>
                <p className="text-slate-500">Sistem Pemantauan Chatbot Pasien Radioterapi RSUP Prof. Dr. I.G.N.G. Ngoerah.</p>
            </div>

            {/* Radar Triase Darurat - Realtime Client Component */}
            <RealtimeTriaseRadar initialData={data.triaseDarurat} />

            {/* Kartu Statistik Utama */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-blue-500 shadow-sm hover-lift bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pasien Aktif (Radiasi)</CardTitle>
                        <Activity className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.pasienAktif}</div>
                        <p className="text-xs text-slate-500">Sedang dalam masa tindakan</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500 shadow-sm hover-lift bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-900 dark:to-amber-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jadwal Hari Ini</CardTitle>
                        <CalendarDays className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.jadwalHariIni}</div>
                        <p className="text-xs text-slate-500">Antrean radiasi masuk</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500 shadow-sm hover-lift bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-900 dark:to-emerald-950/20">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Selesai Radiasi</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.pasienSelesai}</div>
                        <p className="text-xs text-slate-500">Masuk masa kontrol/restaging</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-slate-400 shadow-sm hover-lift bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Database Pasien</CardTitle>
                        <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.stats.totalPasien}</div>
                        <p className="text-xs text-slate-500">Seluruh data terekam</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">

                {/* Antrean Hari Ini */}
                <Card className="lg:col-span-4 shadow-md hover-lift transition-all duration-300 border-slate-200/60 dark:border-slate-800/60">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Antrean Radiasi Hari Ini</CardTitle>
                            <CardDescription>Daftar pasien berdasarkan nomor antrean di setiap alat.</CardDescription>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                            <Clock className="h-4 w-4 text-slate-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                                <TableRow>
                                    <TableHead className="w-[80px] text-center">Antrean</TableHead>
                                    <TableHead>Pasien</TableHead>
                                    <TableHead>Alat / Mesin</TableHead>
                                    <TableHead className="text-center">Jam Sinar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.antreanHariIni.length > 0 ? (
                                    data.antreanHariIni.map((jadwal) => (
                                        <TableRow key={jadwal.id_jadwal} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                                            <TableCell className="text-center">
                                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-bold text-xs mx-auto">
                                                    {jadwal.no_antrean || '-'}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium text-sm">{jadwal.pasien?.nama_lengkap}</div>
                                                <div className="text-xs text-slate-400 dark:text-slate-500">RM: {jadwal.pasien?.no_rm_4_digit}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="font-normal bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                                                    {jadwal.pasien?.tipe_alat || '-'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center font-medium text-slate-600 dark:text-slate-300 text-sm">
                                                {jadwal.jam_sinar || '--:--'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-slate-400 italic">
                                            Tidak ada jadwal tindakan untuk hari ini.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Log Chat Terbaru */}
                <Card className="lg:col-span-3 shadow-md hover-lift transition-all duration-300 border-slate-200/60 dark:border-slate-800/60">
                    <CardHeader>
                        <CardTitle>Log Percakapan Terakhir</CardTitle>
                        <CardDescription>Aktivitas pesan terbaru dari bot Ngoerah Care.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.chatTerbaru.map((chat) => (
                                <div key={chat.id_chat} className="flex items-start gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 last:border-0 last:pb-0 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30 p-2 rounded-lg">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                            {chat.pasien?.nama_lengkap || 'Unknown'}
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                                            &quot;{chat.pesan}&quot;
                                        </p>
                                    </div>
                                    <div className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase">
                                        {new Date(chat.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}