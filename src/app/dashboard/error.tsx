"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw } from "lucide-react"

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">Gagal Memuat Data</h2>
                <p className="text-sm text-slate-500 max-w-md">
                    Terjadi kesalahan saat menghubungi server. Pastikan koneksi internet Anda stabil
                    dan coba muat ulang halaman.
                </p>
                {error.message && (
                    <p className="text-xs text-slate-400 font-mono bg-slate-50 rounded px-3 py-1.5 mt-2 inline-block">
                        {error.message}
                    </p>
                )}
            </div>
            <Button onClick={reset} variant="outline" className="gap-2 mt-2">
                <RefreshCcw className="h-4 w-4" />
                Coba Lagi
            </Button>
        </div>
    )
}
