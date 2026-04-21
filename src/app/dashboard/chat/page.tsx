import { createSupabaseServerClient } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'
import { columns, type ChatPair } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { MessageSquareWarning } from 'lucide-react'

async function getChatHistory() {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
        .from('chat_history')
        .select('*, pasien(nama_lengkap, no_rm_4_digit)')
        .order('created_at', { ascending: false }) // Diurutkan dari yang terbaru
        .limit(500)

    if (error || !data) {
        console.error("Error fetching chat history:", error)
        return []
    }

    // LOGIKA PENGGABUNGAN PERCAKAPAN
    const pairedData: ChatPair[] = [];
    let skipNext = false;

    for (let i = 0; i < data.length; i++) {
        if (skipNext) {
            skipNext = false;
            continue;
        }

        const current = data[i];
        const isCurrentAssistant = current.role === 'assistant';
        const isCurrentSystem = current.role === 'system' || current.pesan?.includes('PENGINGAT OTOMATIS:');
        const isCurrentUser = !isCurrentAssistant && !isCurrentSystem;

        // Struktur dasar satu baris
        let pair = {
            id_chat: current.id_chat,
            created_at: current.created_at,
            pasien: current.pasien,
            pesan_pasien: isCurrentUser ? current.pesan : '-',
            pesan_sistem: isCurrentAssistant || isCurrentSystem ? current.pesan : '-',
        };

        // JIKA baris saat ini adalah balasan Ngoerah Care (AI)
        // KITA CEK baris berikutnya (pesan yang lebih lama)
        if (isCurrentAssistant && i + 1 < data.length) {
            const next = data[i + 1];
            const isNextUser = next.role !== 'assistant' && next.role !== 'system' && !next.pesan?.includes('PENGINGAT OTOMATIS:');

            // Jika pesan sebelumnya memang dari Pasien yang SAMA, gabungkan!
            if (isNextUser && current.id_pasien === next.id_pasien) {
                pair.pesan_pasien = next.pesan;
                pair.created_at = next.created_at; // Gunakan waktu saat pasien bertanya
                skipNext = true; // Lewati baris berikutnya karena sudah digabung
            }
        }

        pairedData.push(pair);
    }

    return pairedData;
}

export default async function ChatPage() {
    const chatHistory = await getChatHistory()

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <MessageSquareWarning className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Chat History</h2>
                    <p className="text-slate-500">Pemantauan interaksi chatbot pasien dengan Ngoerah Care dan notifikasi sistem.</p>
                </div>
            </div>

            <div className="rounded-md bg-white">
                <DataTable
                    columns={columns}
                    data={chatHistory}
                    searchPlaceholder="Cari isi pesan atau nama pasien..."
                    dateFilterColumn="created_at"
                />
            </div>
        </div>
    )
}