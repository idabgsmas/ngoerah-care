"use client"

import { useEffect, useCallback } from 'react'

export function useNotification() {
    useEffect(() => {
        // Cek apakah browser mendukung Notification API
        if (!('Notification' in window)) return

        // Minta izin jika belum pernah diminta
        if (Notification.permission === 'default') {
            Notification.requestPermission()
        }
    }, [])

    const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (!('Notification' in window)) return
        
        // Pengecekan realtime langsung ke API browser
        if (Notification.permission !== 'granted') return

        // Mencegah error keamanan cross-origin atau ekstensi memblokir
        try {
            // Kirim notifikasi browser
            const notification = new Notification(title, {
                icon: '/logo_rsup_ngoerah.png',
                badge: '/logo_rsup_ngoerah.png',
                ...options,
            })

            // Klik notifikasi → fokus ke tab dashboard
            notification.onclick = () => {
                window.focus()
                notification.close()
            }

            // Auto-close setelah 10 detik
            setTimeout(() => notification.close(), 10000)
        } catch (error) {
            console.error("Gagal mengirim notifikasi push:", error)
        }
    }, [])

    return { sendNotification }
}
