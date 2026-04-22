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
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
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
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-pulse text-slate-500 text-lg font-medium tracking-wide">Memuat Ngoerah Care...</div>
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            {/* Dynamic Abstract Background Glows */}
            <div className="absolute -top-[20%] -left-[10%] h-[70%] w-[50%] rounded-full bg-blue-400/30 dark:bg-blue-700/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-[60%] right-[5%] h-[50%] w-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
            <div className="absolute top-[20%] left-[60%] h-[40%] w-[30%] rounded-full bg-cyan-400/20 dark:bg-cyan-600/10 blur-[100px] mix-blend-multiply dark:mix-blend-screen" />

            <div className="z-10 w-full max-w-md px-4">
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] animate-in fade-in zoom-in-95 duration-700">
                    <CardHeader className="space-y-3 text-center pb-6">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 hover-lift">
                            <Image
                                src="/logo_rsup_ngoerah.png"
                                alt="Logo RSUP Ngoerah"
                                width={56}
                                height={56}
                                priority
                                className="drop-shadow-sm"
                            />
                        </div>

                        <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            Ngoerah <span className="text-gradient">Care</span>
                        </CardTitle>
                        <CardDescription className="text-slate-500 dark:text-slate-400 text-sm px-2 leading-relaxed">
                            Akses panel pemantauan cerdas pasien radioterapi RSUP Prof. dr. I.G.N.G. Ngoerah.
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
                                                Silakan hubungi <strong className="text-slate-800">Admin Ngoerah Care</strong> atau Radiologi RSUP Prof. dr. I.G.N.G. Ngoerah untuk meminta perubahan kata sandi akun Anda.
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

                        <Button type="submit" className="w-full h-11 text-base font-semibold shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700" disabled={loading}>
                            {loading ? "Otentikasi Berjalan..." : "Masuk ke Sistem"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
            </div>
        </div>
    )
}