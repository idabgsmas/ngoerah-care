export type Pasien = {
    id_pasien: string
    created_at: string
    nama_lengkap: string
    no_rm_4_digit: string
    no_wa_primary: string
    kasus_carsinoma: string
    tipe_alat: string
    status_fase: string
    total_fraksi: number
}

export type TriageLog = {
    id_log: string
    created_at: string
    id_pasien: string
    skor_triage: string
    detail_keluhan: string
    saran_sistem: string
    is_handled: boolean
    pasien?: Partial<Pasien> // Jika di-join
}

export type ChatHistory = {
    id_chat: string
    created_at: string
    id_pasien: string
    pesan: string
    role: 'user' | 'assistant' | 'system'
    pasien?: Partial<Pasien> // Jika di-join
}

export type Jadwal = {
    id_jadwal: string
    created_at: string
    id_pasien: string
    tgl_tindakan: string
    no_antrean: number
    fraksi_ke: number
    jam_sinar: string
    is_reminded_k5: boolean
    pasien?: Partial<Pasien> // Jika di-join
}
