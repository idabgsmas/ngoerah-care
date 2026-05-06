"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"

export default function RealtimeClock() {
    const [time, setTime] = useState<Date | null>(null)

    useEffect(() => {
        setTime(new Date())
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    if (!time) {
        return <div className="h-5 w-48 animate-pulse bg-slate-200 dark:bg-slate-800 rounded"></div>
    }

    const hari = time.toLocaleDateString('id-ID', { weekday: 'long', timeZone: 'Asia/Makassar' })
    const tanggal = time.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Makassar' })
    const jam = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Makassar' })

    return (
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
            <Calendar className="h-4 w-4 text-ngoerah-primary" />
            <span>{hari}, {tanggal}</span>
            <span className="mx-1 text-slate-300 dark:text-slate-600">|</span>
            <span className="text-ngoerah-primary font-bold">{jam} WITA</span>
        </div>
    )
}
