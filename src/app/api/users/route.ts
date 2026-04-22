import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

// Supabase Admin client — hanya untuk server-side (TIDAK terekspos ke browser)
function getAdminClient() {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!serviceRoleKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di .env.local')
    }
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey,
        { auth: { autoRefreshToken: false, persistSession: false } }
    )
}

// Middleware: pastikan yang mengakses API ini adalah user yang sudah login
async function verifyAuth() {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// GET /api/users — Daftar semua user
export async function GET() {
    const currentUser = await verifyAuth()
    if (!currentUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const admin = getAdminClient()
        const { data, error } = await admin.auth.admin.listUsers()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Kirim data user yang sudah disederhanakan
        const users = data.users.map((u) => ({
            id: u.id,
            email: u.email,
            created_at: u.created_at,
            last_sign_in_at: u.last_sign_in_at,
            email_confirmed_at: u.email_confirmed_at,
        }))

        return NextResponse.json({ users })
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// POST /api/users — Invite user baru
export async function POST(request: NextRequest) {
    const currentUser = await verifyAuth()
    if (!currentUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email dan password wajib diisi' },
                { status: 400 }
            )
        }

        const admin = getAdminClient()
        const { data, error } = await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Langsung verifikasi
        })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ user: data.user })
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}

// DELETE /api/users — Hapus user
export async function DELETE(request: NextRequest) {
    const currentUser = await verifyAuth()
    if (!currentUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { userId } = await request.json()

        if (!userId) {
            return NextResponse.json({ error: 'userId wajib diisi' }, { status: 400 })
        }

        // Cegah user menghapus dirinya sendiri
        if (userId === currentUser.id) {
            return NextResponse.json(
                { error: 'Tidak dapat menghapus akun Anda sendiri' },
                { status: 400 }
            )
        }

        const admin = getAdminClient()
        const { error } = await admin.auth.admin.deleteUser(userId)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Unknown error'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
