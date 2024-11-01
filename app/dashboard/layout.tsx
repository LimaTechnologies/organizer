'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Home, PlusCircle, List, User, LogOut, Compass } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ThemeProvider } from 'next-themes'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <LoadingSpinner />
    }

    if (!session) {
        return <div>Access Denied</div>
    }

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen bg-background">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                    <div className="container mx-auto p-6 space-y-8">{children}</div>
                </main>
            </div>
        </ThemeProvider>
    )
}

function Sidebar() {
    const pathname = usePathname()

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/dashboard/create', label: 'Create Prompt', icon: PlusCircle },
        { href: '/dashboard/prompts', label: 'My Prompts', icon: List },
        { href: '/dashboard/profile', label: 'Profile', icon: User },
        { href: '/dashboard/explore', label: 'Explore', icon: Compass },
    ]

    return (
        <aside className="w-64 border-r border-border/50 bg-card" aria-label="Sidebar">
            <div className="flex flex-col h-full">
                <div className="p-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            AI Prompt
                        </span>
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Button
                            key={item.href}
                            asChild
                            variant={pathname === item.href ? 'default' : 'ghost'}
                            className="w-full justify-start hover:glow-effect"
                        >
                            <Link href={item.href}>
                                <item.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                                {item.label}
                            </Link>
                        </Button>
                    ))}
                </nav>
                <div className="p-4 border-t border-border/50">
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </aside>
    )
}