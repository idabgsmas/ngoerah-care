"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, MessageCircle, CheckCircle } from 'lucide-react'

export default function RadarAlert({ log }: { log: any }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Fungsi 1: Redirect ke WhatsApp
    const hubungiPasien = () => {
        const phone = log.pasien?.no_wa_primary;
        if (phone) {
            const waUrl = `https://wa.me/${phone}?text=Halo Bapak/Ibu ${log.pasien?.nama_lengkap}, kami dari RSUP Prof. dr. I.G.N.G. Ngoerah melihat keluhan Anda mengenai: ${log.detail_keluhan}. Bagaimana kondisi Anda saat ini?`;
            window.open(waUrl, '_blank');
        }
    }

    // Fungsi 2: Update status di Database
    const tandaiDitangani = async () => {
        setLoading(true)
        const { error } = await supabase
            .from('triage_logs')
            .update({ is_handled: true })
            .eq('id_log', log.id_log)

        if (!error) {
            router.refresh() // Memperbarui data di halaman Overview secara instan
        }
        setLoading(false)
    }

    return (
        <Card className="border-red-200 bg-red-50/50 shadow-md animate-pulse">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shrink-0">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <CardTitle className="text-red-900 text-lg">Peringatan Triase: Kasus Berat!</CardTitle>
                    <CardDescription className="text-red-700 font-medium">
                        Pasien {log.pasien?.nama_lengkap} (RM: {log.pasien?.no_rm_4_digit}) memerlukan perhatian segera.
                    </CardDescription>
                </div>
                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                    <Button
                        onClick={hubungiPasien}
                        variant="outline"
                        size="sm"
                        className="flex-1 md:flex-none gap-2 border-red-200 text-red-700 hover:bg-red-100"
                    >
                        <MessageCircle className="h-4 w-4" />
                        Hubungi
                    </Button>
                    <Button
                        onClick={tandaiDitangani}
                        disabled={loading}
                        size="sm"
                        className="flex-1 md:flex-none gap-2 bg-red-600 hover:bg-red-700 text-white"
                    >
                        <CheckCircle className="h-4 w-4" />
                        {loading ? "Proses..." : "Selesai"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-red-800 bg-white/60 p-3 rounded-md border border-red-100">
                    <span className="font-bold">Keluhan:</span> {log.detail_keluhan}
                </div>
            </CardContent>
        </Card>
    )
}