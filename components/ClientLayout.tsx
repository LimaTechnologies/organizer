'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/ThemeToggle'
import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'

function NavLinks() {
    const { data: session } = useSession()
    const pathname = usePathname()

    return (
        <ul className="flex space-x-6">
            <li><Link href="/" className={`font-bold ${pathname === '/' ? 'text-primary' : 'text-foreground/80'} hover:text-primary transition-colors`}>AI Prompt Platform</Link></li>
            {session ? (
                <>
                    <li><Link href="/dashboard" className={`${pathname.startsWith('/dashboard') ? 'text-primary' : 'text-foreground/80'} hover:text-primary transition-colors`}>Dashboard</Link></li>
                    <li><Link href="/dashboard/prompts" className={`${pathname.startsWith('/dashboard/prompts') ? 'text-primary' : 'text-foreground/80'} hover:text-primary transition-colors`}>My Prompts</Link></li>
                </>
            ) : (
                <li><Link href="/explore" className={`${pathname === '/explore' ? 'text-primary' : 'text-foreground/80'} hover:text-primary transition-colors`}>Explore</Link></li>
            )}
        </ul>
    )
}

function AuthLinks() {
    const { data: session } = useSession()

    return (
        <div className="flex items-center space-x-4">
            <ThemeToggle />
            {session ? (
                <Link href="/api/auth/signout" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">Sign Out</Link>
            ) : (
                <>
                    <Link href="/auth/signin" className="text-foreground/80 hover:text-foreground transition-colors">Sign In</Link>
                    <Link href="/auth/signup" className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">Sign Up</Link>
                </>
            )}
        </div>
    )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <div className="min-h-screen flex flex-col">
                <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4 py-4">
                        <nav className="flex justify-between items-center">
                            <NavLinks />
                            <AuthLinks />
                        </nav>
                    </div>
                </header>
                <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
                <footer className="border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4 py-6 text-center text-sm text-foreground/60">
                        © 2023 AI Prompt Platform. All rights reserved.
                    </div>
                </footer>
            </div>
        </SessionProvider>
    )
}