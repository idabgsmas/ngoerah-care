"use client"

import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
    const router = useRouter()

    const handleLogout = async () => {
        await supabase.auth.signOut() // Menghapus sesi
        router.push('/login')
    }

    return (
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-all hover:bg-red-50 hover:text-red-600">
            <LogOut className="h-5 w-5" />
            Keluar (Logout)
        </button>
    )
}