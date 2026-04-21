"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// Activity dlm import dihapus, tambah Image dr next/image
import { ShieldAlert } from 'lucide-react'
import Image from 'next/image' // Impor komponen Image

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [isChecking, setIsChecking] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push('/dashboard')
            } else {
                setIsChecking(false)
            }
        }
        checkSession()
    }, [router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError("Email atau password tidak valid!")
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    if (isChecking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="animate-pulse text-slate-500">Memuat Ngoerah Care...</div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-2 text-center">

                    {/* BAGIAN DIUBAH: Hapus heartbeat icon, ganti dg logo Image */}
                    <div className="mx-auto flex h-16 w-16 items-center justify-center">
                        <Image
                            src="/logo_rsup_ngoerah.png"
                            alt="Logo RSUP Ngoerah"
                            width={64} // sesuaikan ukuran
                            height={64}
                            priority
                        />
                    </div>

                    <CardTitle className="text-2xl font-bold">Ngoerah Care</CardTitle>
                    <CardDescription>
                        Masukkan kredensial admin untuk mengakses sistem pemantauan radioterapi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@ngoerah.care"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <span className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors">
                                            Lupa Password?
                                        </span>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="flex items-center gap-2 text-slate-800">
                                                <ShieldAlert className="h-5 w-5 text-amber-500" />
                                                Reset Password
                                            </DialogTitle>
                                            <DialogDescription className="pt-3 text-slate-600 leading-relaxed">
                                                Demi menjaga keamanan dan kerahasiaan data rekam medis pasien, reset password tidak dapat dilakukan secara otomatis.
                                                <br /><br />
                                                Silakan hubungi <strong className="text-slate-800">Super Admin (Gus)</strong> atau Tim IT RSUP Ngoerah untuk meminta perubahan kata sandi akun Anda.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex justify-end pt-2">
                                            <DialogTrigger asChild>
                                                <Button variant="secondary">Tutup</Button>
                                            </DialogTrigger>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="text-sm font-medium text-red-500">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Memeriksa..." : "Masuk ke Dashboard"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}