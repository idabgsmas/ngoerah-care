import ProtectedRoute from '@/components/ProtectedRoute'
import { DesktopSidebar, MobileSidebar } from '@/components/Sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <ProtectedRoute>
            <div className="flex min-h-screen w-full bg-slate-50/50">
                {/* Sidebar Desktop */}
                <DesktopSidebar />

                <main className="flex w-full flex-col md:pl-64">
                    <header className="flex h-14 items-center gap-3 border-b bg-white px-4 md:px-6">
                        {/* Hamburger menu — hanya muncul di mobile */}
                        <MobileSidebar />
                        <p className="text-sm text-slate-500">Sistem Pemantauan Chatbot Pasien Radioterapi RSUP Prof. dr. I.G.N.G. Ngoerah</p>
                    </header>
                    <div className="flex-1 p-4 md:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    )
}