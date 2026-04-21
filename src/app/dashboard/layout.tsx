import Link from 'next/link'
// Tambahkan BellRing di sini
import { Activity, LayoutDashboard, Users, CalendarDays, ChevronDown, MessageSquare, BellRing } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'
import LogoutButton from '@/components/LogoutButton'
import Image from 'next/image'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen w-full bg-slate-50/50">
                <aside className="fixed hidden h-screen w-64 flex-col border-r bg-white md:flex">
                    <div className="flex h-14 items-center gap-3 border-b px-6">
                        <Image src="/logo_rsup_ngoerah.png" alt="Logo RSUP Ngoerah" width={28} height={28} />
                        <h1 className="text-lg font-bold text-slate-900">Ngoerah Care</h1>
                    </div>
                    <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><LayoutDashboard className="h-5 w-5" />Overview</Link>
                        <Link href="/dashboard/triase" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><Activity className="h-5 w-5" />Live Triase</Link>
                        <Link href="/dashboard/chat" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><MessageSquare className="h-5 w-5" />Log Chat</Link>
                        <Link href="/dashboard/pasien" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><Users className="h-5 w-5" />Data Pasien</Link>

                        {/* MENU BARU: Pengingat Otomatis */}
                        <Link href="/dashboard/pengingat" className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                            <BellRing className="h-5 w-5" />
                            Pengingat Otomatis
                        </Link>

                        <details className="group [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                                <CalendarDays className="h-5 w-5" /><span className="flex-1">Jadwal Radiasi</span><ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="mt-1 flex flex-col space-y-1 pl-11 pr-3">
                                <Link href="/dashboard/jadwal" className="block rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">Semua Jadwal</Link>
                                <Link href="/dashboard/jadwal?alat=CT Simulasi" className="block rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">CT Simulasi</Link>
                                <Link href="/dashboard/jadwal?alat=LINAC" className="block rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">LINAC</Link>
                                <Link href="/dashboard/jadwal?alat=COBALT" className="block rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900">COBALT</Link>
                            </div>
                        </details>
                    </nav>
                    <div className="border-t p-4">
                        <LogoutButton />
                    </div>
                </aside>

                <main className="flex w-full flex-col md:pl-64">
                    <header className="flex h-14 items-center border-b bg-white px-6">
                        <p className="text-sm text-slate-500">Sistem Pemantauan Pasien Radioterapi RSUP Ngoerah</p>
                    </header>
                    <div className="flex-1 p-6">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}