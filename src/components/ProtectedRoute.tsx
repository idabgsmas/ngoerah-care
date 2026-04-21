"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const checkAuth = async () => {
            // Mengecek apakah ada "tiket" sesi yang sah di browser
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login') // Tendang ke login jika tidak ada tiket
            } else {
                setIsAuthenticated(true) // Izinkan masuk
            }
        }

        checkAuth()
    }, [router])

    // Tampilkan layar loading saat satpam sedang mengecek
    if (!isAuthenticated) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="animate-pulse text-slate-500 font-medium">Memeriksa akses keamanan...</div>
            </div>
        )
    }

    return <>{children}</>
}