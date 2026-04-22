"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Users, UserPlus, Trash2, AlertCircle, ShieldCheck } from 'lucide-react'

interface UserData {
    id: string
    email: string
    created_at: string
    last_sign_in_at: string | null
    email_confirmed_at: string | null
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [newEmail, setNewEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [createLoading, setCreateLoading] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/users')
            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Gagal memuat data user')
                return
            }

            setUsers(data.users || [])
        } catch {
            setError('Gagal menghubungi server')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault()
        setCreateLoading(true)
        setCreateError(null)

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newEmail, password: newPassword }),
            })
            const data = await res.json()

            if (!res.ok) {
                setCreateError(data.error || 'Gagal membuat user baru')
                return
            }

            setNewEmail('')
            setNewPassword('')
            setDialogOpen(false)
            fetchUsers()
        } catch {
            setCreateError('Gagal menghubungi server')
        } finally {
            setCreateLoading(false)
        }
    }

    const handleDeleteUser = async (userId: string, userEmail: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus akun ${userEmail}? Tindakan ini tidak dapat dibatalkan.`)) {
            return
        }

        try {
            const res = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            })
            const data = await res.json()

            if (!res.ok) {
                alert(data.error || 'Gagal menghapus user')
                return
            }

            fetchUsers()
        } catch {
            alert('Gagal menghubungi server')
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Manajemen User</h2>
                        <p className="text-slate-500">Kelola akun admin dan perawat yang memiliki akses ke dashboard.</p>
                    </div>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Tambah User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Tambah User Baru</DialogTitle>
                            <DialogDescription>
                                Buat akun baru untuk perawat atau admin yang perlu mengakses dashboard.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 mt-2">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="perawat@rsup-ngoerah.go.id"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimal 6 karakter"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            {createError && (
                                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    {createError}
                                </div>
                            )}
                            <Button type="submit" className="w-full" disabled={createLoading}>
                                {createLoading ? 'Membuat akun...' : 'Buat Akun'}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Daftar User ({users.length})
                    </CardTitle>
                    <CardDescription>Semua akun yang terdaftar di sistem Ngoerah Care.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error ? (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <AlertCircle className="h-8 w-8 text-amber-500" />
                            <p className="text-sm text-slate-500">{error}</p>
                            <p className="text-xs text-slate-400">
                                Pastikan <code className="bg-slate-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code> sudah dikonfigurasi di <code className="bg-slate-100 px-1 rounded">.env.local</code>
                            </p>
                            <Button variant="outline" size="sm" onClick={fetchUsers}>Coba Lagi</Button>
                        </div>
                    ) : loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="skeleton h-14 w-full rounded-md"></div>
                            ))}
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Dibuat</TableHead>
                                    <TableHead>Login Terakhir</TableHead>
                                    <TableHead className="text-center">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length > 0 ? (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={
                                                    user.email_confirmed_at
                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                }>
                                                    {user.email_confirmed_at ? 'Aktif' : 'Pending'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-500">
                                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </TableCell>
                                            <TableCell className="text-sm text-slate-500">
                                                {user.last_sign_in_at
                                                    ? new Date(user.last_sign_in_at).toLocaleString('id-ID', {
                                                        day: '2-digit', month: 'short',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })
                                                    : '-'
                                                }
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteUser(user.id, user.email || '')}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-slate-400">
                                            Belum ada user terdaftar.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
