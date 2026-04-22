import ProtectedRoute from '@/components/ProtectedRoute'
import { DesktopSidebar, MobileSidebar } from '@/components/Sidebar'
import ThemeToggle from '@/components/ThemeToggle'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen w-full bg-slate-50/50 dark:bg-slate-950">
                {/* Sidebar Desktop */}
                <DesktopSidebar />

                <main className="flex w-full flex-col md:pl-64">
                    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200/50 bg-white/70 backdrop-blur-md dark:bg-slate-950/60 dark:border-slate-800/50 shadow-sm px-4 md:px-6 transition-all">
                        {/* Hamburger menu — hanya muncul di mobile */}
                        <MobileSidebar />
                        <p className="text-sm text-slate-500 dark:text-slate-400">Sistem Pemantauan Chatbot Pasien Radioterapi RSUP Prof. dr. I.G.N.G. Ngoerah</p>
                        <div className="ml-auto">
                            <ThemeToggle />
                        </div>
                    </header>
                    <div className="flex-1 p-4 md:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}