"use client"

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabaseClient'
import RadarAlert from '@/components/RadarAlert'
import type { TriageLog } from '@/types/database.types'
import { useNotification } from '@/hooks/useNotification'
import { Radio } from 'lucide-react'

interface RealtimeTriaseRadarProps {
    initialData: TriageLog[]
}

export default function RealtimeTriaseRadar({ initialData }: RealtimeTriaseRadarProps) {
    const [triaseDarurat, setTriaseDarurat] = useState<TriageLog[]>(initialData)
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
    const { sendNotification } = useNotification()
    const prevCountRef = useRef(initialData.length)

    // Fallback: Jika router.refresh() dipanggil, pastikan komponen sinkronisasi dengan data server
    useEffect(() => {
        setTriaseDarurat(initialData)
        prevCountRef.current = initialData.length
    }, [initialData])

    useEffect(() => {
        // Subscribe ke perubahan realtime pada tabel triage_logs
        const channel = supabase
            .channel('realtime-triage')
            .on(
                'postgres_changes',
                {
                    event: '*', // Dengarkan INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'triage_logs',
                },
                async () => {
                    // Saat ada perubahan, fetch ulang data triase darurat hari ini
                    const today = new Date().toISOString().split('T')[0]
                    const { data } = await supabase
                        .from('triage_logs')
                        .select('*, pasien(nama_lengkap, no_rm_4_digit, no_wa_primary)')
                        .eq('skor_triage', 'Berat')
                        .eq('is_handled', false)
                        .gte('created_at', `${today}T00:00:00`)
                        .order('created_at', { ascending: false })

                    if (data) {
                        // Kirim browser notification jika ada triase darurat baru
                        if (data.length > prevCountRef.current) {
                            const newest = data[0] as TriageLog
                            sendNotification('⚠️ Triase Darurat Baru!', {
                                body: `Pasien ${newest.pasien?.nama_lengkap || 'Unknown'} memerlukan perhatian segera.\nKeluhan: ${newest.detail_keluhan}`,
                                tag: 'triage-darurat', // Mencegah notifikasi duplikat
                            })
                        }
                        prevCountRef.current = data.length
                        setTriaseDarurat(data as TriageLog[])
                        setLastUpdate(new Date())
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    if (triaseDarurat.length === 0) return null

    return (
        <div className="space-y-3">
            {/* Header dengan indikator realtime */}
            <div className="flex items-center gap-2 text-sm text-red-600">
                <Radio className="h-4 w-4 animate-pulse" />
                <span className="font-medium">Peringatan Triase Darurat — Live</span>
                <span className="text-xs text-slate-400 ml-auto">
                    Terakhir diperbarui: {lastUpdate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
            </div>

            {/* Daftar alert */}
            <div className="grid gap-4">
                {triaseDarurat.map((log) => (
                    <RadarAlert 
                        key={log.id_log} 
                        log={log} 
                        onHandled={() => {
                            // Hapus instan dari UI tanpa nunggu realtime/refresh lambat
                            setTriaseDarurat(prev => prev.filter(l => l.id_log !== log.id_log))
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
