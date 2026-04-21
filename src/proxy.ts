import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    // Buat response awal yang akan kita modifikasi
    let supabaseResponse = NextResponse.next({ request })

    // Buat Supabase client khusus untuk middleware
    // Client ini membaca & menulis cookies dari/ke request/response
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    // Update cookies di request (untuk downstream)
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    // Buat response baru dengan cookies yang sudah diupdate
                    supabaseResponse = NextResponse.next({ request })
                    // Set cookies di response (untuk browser)
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // PENTING: Gunakan getUser() bukan getSession() untuk keamanan
    // getUser() selalu memverifikasi token ke server Supabase
    // getSession() hanya membaca dari cookies yang bisa dimanipulasi
    const { data: { user } } = await supabase.auth.getUser()

    // Jika belum login dan mencoba akses dashboard → redirect ke login
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // Jika sudah login dan mencoba akses login → redirect ke dashboard
    if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/')) {
        const url = request.nextUrl.clone()
        url.pathname = '/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

// Middleware hanya berjalan pada rute-rute yang diperlukan
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/login',
        '/',
    ],
}
