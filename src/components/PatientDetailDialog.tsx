"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Activity, MessageSquare, Calendar, Stethoscope } from 'lucide-react'
import type { TriageLog, ChatHistory, Jadwal } from '@/types/database.types'

interface PatientDetailDialogProps {
    patientId: string | null
    patientName: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function PatientDetailDialog({
    patientId,
    patientName,
    open,
    onOpenChange,
}: PatientDetailDialogProps) {
    const [triageLogs, setTriageLogs] = useState<TriageLog[]>([])
    const [chatLogs, setChatLogs] = useState<ChatHistory[]>([])
    const [jadwalLogs, setJadwalLogs] = useState<Jadwal[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open || !patientId) return

        const fetchDetails = async () => {
            setLoading(true)

            const [triaseRes, chatRes, jadwalRes] = await Promise.all([
                supabase
                    .from('triage_logs')
                    .select('*')
                    .eq('id_pasien', patientId)
                    .order('created_at', { ascending: false })
                    .limit(10),
                supabase
                    .from('chat_history')
                    .select('*')
                    .eq('id_pasien', patientId)
                    .order('created_at', { ascending: false })
                    .limit(10),
                supabase
                    .from('jadwal')
                    .select('*')
                    .eq('id_pasien', patientId)
                    .order('tgl_tindakan', { ascending: false })
                    .limit(5),
            ])

            setTriageLogs((triaseRes.data || []) as TriageLog[])
            setChatLogs((chatRes.data || []) as ChatHistory[])
            setJadwalLogs((jadwalRes.data || []) as Jadwal[])
            setLoading(false)
        }

        fetchDetails()
    }, [open, patientId])

    const getSkorBadge = (skor: string) => {
        if (skor === 'Berat') return 'bg-red-100 text-red-800'
        if (skor === 'Sedang') return 'bg-amber-100 text-amber-800'
        return 'bg-green-100 text-green-800'
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5 text-blue-600" />
                        Detail Pasien: {patientName}
                    </DialogTitle>
                    <DialogDescription>
                        Riwayat triase, percakapan, dan jadwal tindakan pasien.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="space-y-4 py-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="skeleton h-24 w-full rounded-lg"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 py-2">
                        {/* Riwayat Triase */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-red-500" />
                                    Riwayat Triase ({triageLogs.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {triageLogs.length > 0 ? (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {triageLogs.map((log) => (
                                            <div key={log.id_log} className="flex items-start gap-3 rounded-md border p-3 text-sm">
                                                <Badge variant="outline" className={getSkorBadge(log.skor_triage)}>
                                                    {log.skor_triage}
                                                </Badge>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-slate-700 line-clamp-2">{log.detail_keluhan}</p>
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {new Date(log.created_at).toLocaleString('id-ID', {
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Belum ada riwayat triase.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Jadwal Tindakan */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    Jadwal Tindakan Terakhir ({jadwalLogs.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {jadwalLogs.length > 0 ? (
                                    <div className="space-y-2 max-h-36 overflow-y-auto">
                                        {jadwalLogs.map((j) => (
                                            <div key={j.id_jadwal} className="flex items-center gap-3 rounded-md border p-3 text-sm">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-xs shrink-0">
                                                    {j.fraksi_ke}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-slate-700 font-medium">
                                                        {new Date(j.tgl_tindakan + 'T00:00:00').toLocaleDateString('id-ID', {
                                                            weekday: 'short', day: '2-digit', month: 'short', year: 'numeric'
                                                        })}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Antrean #{j.no_antrean} • Jam: {j.jam_sinar || '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Belum ada jadwal tindakan.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Log Chat Terakhir */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4 text-green-500" />
                                    Percakapan Terakhir ({chatLogs.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {chatLogs.length > 0 ? (
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {chatLogs.map((chat) => (
                                            <div key={chat.id_chat} className="rounded-md border p-3 text-sm">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className={
                                                        chat.role === 'user'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                            : 'bg-slate-50 text-slate-600 border-slate-200'
                                                    }>
                                                        {chat.role === 'user' ? 'Pasien' : 'Ngoerah Care'}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(chat.created_at).toLocaleString('id-ID', {
                                                            day: '2-digit', month: 'short',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 line-clamp-3">{chat.pesan}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Belum ada riwayat percakapan.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
