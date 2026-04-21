import Link from 'next/link'
import { Activity, LayoutDashboard, Users, CalendarDays, ChevronDown, MessageSquare } from 'lucide-react'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full bg-slate-50/50">
            {/* Sidebar Kiri */}
            <aside className="fixed hidden h-screen w-64 flex-col border-r bg-white md:flex">
                <div className="flex h-14 items-center border-b px-6">
                    <h1 className="text-lg font-bold text-slate-900">Ngoerah Care</h1>
                </div>
                <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                    <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900">
                        <LayoutDashboard className="h-5 w-5" />
                        Overview
                    </Link>

                    {/* Menu BARU: Live Triase (Skor Medis) */}
                    <Link href="/dashboard/triase" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900">
                        <Activity className="h-5 w-5" />
                        Live Triase
                    </Link>

                    {/* Menu LAMA: Diubah namanya menjadi Log Chat */}
                    <Link href="/dashboard/chat" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900">
                        <MessageSquare className="h-5 w-5" />
                        Log Chat
                    </Link>

                    <Link href="/dashboard/pasien" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900">
                        <Users className="h-5 w-5" />
                        Data Pasien
                    </Link>

                    {/* Dropdown Jadwal Radiasi */}
                    <details className="group [&_summary::-webkit-details-marker]:hidden">
                        <summary className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-900">
                            <CalendarDays className="h-5 w-5" />
                            <span className="flex-1">Jadwal Radiasi</span>
                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="mt-1 flex flex-col space-y-1 pl-11 pr-3">
                            <Link href="/dashboard/jadwal" className="block rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">Semua Jadwal</Link>
                            <Link href="/dashboard/jadwal?alat=CT Simulasi" className="block rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">CT Simulasi</Link>
                            <Link href="/dashboard/jadwal?alat=LINAC" className="block rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">LINAC</Link>
                            <Link href="/dashboard/jadwal?alat=COBALT" className="block rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">COBALT</Link>
                        </div>
                    </details>

                </nav>
            </aside>

            {/* Area Konten Utama */}
            <main className="flex w-full flex-col md:pl-64">
                <header className="flex h-14 items-center border-b bg-white px-6">
                    <p className="text-sm text-slate-500">Sistem Pemantauan Pasien Radioterapi</p>
                </header>
                <div className="flex-1 p-6">
                    {children}
                </div>
            </main>
        </div>
    )
}