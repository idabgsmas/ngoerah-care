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
        <div className="space-y-8">
            <div className="mb-2">
                <h2 className="text-[28px] font-heading font-bold text-slate-900 dark:text-white">Selamat Datang, Admin Ngoerah Care</h2>
                <p className="text-slate-500 mt-1">Berikut adalah ringkasan operasional klinis hari ini di RSUP Prof. dr. I.G.N.G. Ngoerah.</p>
            </div>

            {/* Radar Triase Darurat - Realtime Client Component */}
            <RealtimeTriaseRadar initialData={data.triaseDarurat} />

            {/* Kartu Statistik Utama */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm hover-lift border-0 bg-white dark:bg-slate-900 rounded-xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#E8F4FE] text-ngoerah-primary dark:bg-ngoerah-primary/20">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Total Database Pasien</p>
                        <h3 className="font-heading text-4xl font-extrabold text-slate-900 dark:text-white">{data.stats.totalPasien}</h3>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover-lift border-0 bg-[#FFEBEB] dark:bg-rose-950/40 rounded-xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/50 text-rose-600 dark:bg-rose-900/50">
                                <Activity className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1">Pasien Aktif (Radiasi)</p>
                        <h3 className="font-heading text-4xl font-extrabold text-rose-700 dark:text-rose-300">{data.stats.pasienAktif}</h3>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover-lift border-0 bg-white dark:bg-slate-900 rounded-xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-ngoerah-tertiary dark:bg-amber-900/20">
                                <CalendarDays className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Jadwal Hari Ini</p>
                        <h3 className="font-heading text-4xl font-extrabold text-slate-900 dark:text-white">{data.stats.jadwalHariIni}</h3>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover-lift border-0 bg-white dark:bg-slate-900 rounded-xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20">
                                <CheckCircle2 className="h-6 w-6" />
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">Selesai Radiasi</p>
                        <h3 className="font-heading text-4xl font-extrabold text-slate-900 dark:text-white">{data.stats.pasienSelesai}</h3>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">

                {/* Antrean Hari Ini */}
                <Card className="lg:col-span-4 shadow-sm border-0 bg-white dark:bg-slate-900 rounded-xl">
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
                            <TableHeader className="bg-transparent border-b-2 border-slate-100 dark:border-slate-800">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[80px] text-center text-xs font-bold text-slate-400 uppercase tracking-wider h-12">Antrean</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider h-12">Pasien</TableHead>
                                    <TableHead className="text-xs font-bold text-slate-400 uppercase tracking-wider h-12">Alat / Mesin</TableHead>
                                    <TableHead className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider h-12">Jam Sinar</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.antreanHariIni.length > 0 ? (
                                    data.antreanHariIni.map((jadwal) => (
                                        <TableRow key={jadwal.id_jadwal} className="transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border-b border-slate-50 dark:border-slate-800/30">
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
                <Card className="lg:col-span-3 shadow-sm border-0 bg-white dark:bg-slate-900 rounded-xl">
                    <CardHeader>
                        <CardTitle>Log Percakapan Terakhir</CardTitle>
                        <CardDescription>Aktivitas pesan terbaru dari bot Ngoerah Care.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.chatTerbaru.map((chat) => (
                                <div key={chat.id_chat} className="flex items-start gap-4 border-b border-slate-50 dark:border-slate-800/30 py-3 last:border-0 last:pb-0 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30 px-3 rounded-lg -mx-3">
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