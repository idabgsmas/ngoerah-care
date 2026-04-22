"use client"

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Activity, LayoutDashboard, Users, CalendarDays, ChevronDown, MessageSquare, BellRing, Menu, ShieldCheck } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'
import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface NavItem {
    href: string
    label: string
    icon: React.ReactNode
    // Jika true, aktif hanya jika pathname exact match (untuk Overview)
    exact?: boolean
}

const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="h-5 w-5" />, exact: true },
    { href: '/dashboard/triase', label: 'Live Triase', icon: <Activity className="h-5 w-5" /> },
    { href: '/dashboard/chat', label: 'Log Chat', icon: <MessageSquare className="h-5 w-5" /> },
    { href: '/dashboard/pasien', label: 'Data Pasien', icon: <Users className="h-5 w-5" /> },
    { href: '/dashboard/pengingat', label: 'Pengingat Otomatis', icon: <BellRing className="h-5 w-5" /> },
    { href: '/dashboard/users', label: 'Manajemen User', icon: <ShieldCheck className="h-5 w-5" /> },
]

const jadwalSubItems = [
    { href: '/dashboard/jadwal', label: 'Semua Jadwal', exact: true },
    { href: '/dashboard/jadwal?alat=CT Simulasi', label: 'CT Simulasi' },
    { href: '/dashboard/jadwal?alat=LINAC', label: 'LINAC' },
    { href: '/dashboard/jadwal?alat=COBALT', label: 'COBALT' },
]

function NavLink({ item, pathname, onClick }: { item: NavItem; pathname: string; onClick?: () => void }) {
    const isActive = item.exact
        ? pathname === item.href
        : pathname.startsWith(item.href)

    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 px-4 py-3 text-[15px] font-medium transition-all duration-200",
                isActive
                    ? "bg-[#E8F4FE] text-ngoerah-primary border-l-4 border-ngoerah-primary dark:bg-ngoerah-primary/10 dark:text-ngoerah-primary"
                    : "text-ngoerah-secondary hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 border-l-4 border-transparent"
            )}
        >
            {item.icon}
            {item.label}
        </Link>
    )
}

function JadwalDropdown({ pathname, onClick }: { pathname: string; onClick?: () => void }) {
    const isJadwalActive = pathname.startsWith('/dashboard/jadwal')
    const searchParams = useSearchParams()
    const [isOpen, setIsOpen] = useState(isJadwalActive)

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-[15px] font-medium transition-all duration-200",
                    isJadwalActive
                        ? "bg-[#E8F4FE] text-ngoerah-primary border-l-4 border-ngoerah-primary dark:bg-ngoerah-primary/10 dark:text-ngoerah-primary"
                        : "text-ngoerah-secondary hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800/50 dark:hover:text-slate-200 border-l-4 border-transparent"
                )}
            >
                <CalendarDays className="h-5 w-5" />
                <span className="flex-1 text-left">Jadwal Radiasi</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div className="mt-1 flex flex-col space-y-1 pl-11 pr-3">
                    {jadwalSubItems.map((sub) => {
                        const alatParam = searchParams.get('alat');
                        let isSubActive = false;
                        
                        if (sub.exact) {
                            isSubActive = pathname === sub.href && !alatParam;
                        } else {
                            // Bandingkan nilainya secara langsung (bebas dari isu %20 URL encoding)
                            isSubActive = alatParam ? sub.href.includes(`alat=${alatParam}`) : false;
                        }

                        return (
                            <Link
                                key={sub.href}
                                href={sub.href}
                                onClick={onClick}
                                className={cn(
                                    "block px-4 py-2 text-sm font-medium transition-colors border-l-4",
                                    isSubActive
                                        ? "text-ngoerah-primary border-ngoerah-primary bg-[#E8F4FE]/50 dark:bg-ngoerah-primary/5"
                                        : "text-ngoerah-secondary hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-800/50 border-transparent"
                                )}
                            >
                                {sub.label}
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname()

    return (
        <>
            <div className="flex flex-col items-center gap-2 border-b border-slate-100 dark:border-slate-800/50 px-6 py-8 bg-transparent">
                <Image src="/logo_rsup_ngoerah.png" alt="Logo RSUP Ngoerah" width={48} height={48} className="drop-shadow-sm" />
                <h1 className="text-xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">Ngoerah <span className="text-ngoerah-primary">Care</span></h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-6">
                {navItems.map((item) => (
                    <NavLink key={item.href} item={item} pathname={pathname} onClick={onNavigate} />
                ))}
                <JadwalDropdown pathname={pathname} onClick={onNavigate} />
            </nav>
            <div className="border-t dark:border-slate-800 p-4">
                <LogoutButton />
            </div>
        </>
    )
}

// Desktop sidebar (static)
export function DesktopSidebar() {
    return (
        <aside className="fixed hidden h-screen w-[260px] flex-col border-r border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-950 shadow-sm md:flex transition-all z-40">
            <SidebarContent />
        </aside>
    )
}

// Mobile sidebar (sheet/drawer)
export function MobileSidebar() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="sr-only">
                    <SheetTitle>Menu Navigasi</SheetTitle>
                </SheetHeader>
                <div className="flex h-full flex-col">
                    <SidebarContent onNavigate={() => setOpen(false)} />
                </div>
            </SheetContent>
        </Sheet>
    )
}
