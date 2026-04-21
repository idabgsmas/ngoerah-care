"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

// Safety net tambahan di client-side
// Proteksi utama sudah ditangani oleh middleware.ts di server-level
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
            } else {
                setIsAuthenticated(true)
            }
        }

        checkAuth()

        // Subscribe ke perubahan auth state (misal: session expired)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!session) {
                    router.push('/login')
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [router])

    if (!isAuthenticated) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600"></div>
                    <p className="text-sm text-slate-500 font-medium">Memverifikasi akses...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}