'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ErrorMessage } from '@/components/ui/error-message'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { SEO } from '@/components/SEO'

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '')
            setEmail(session.user.email || '')
        }
    }, [session])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch('/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            if (response.ok) {
                await update({ name, email })
                setPassword('')
                setConfirmPassword('')
            } else {
                const data = await response.json()
                setError(data.error || 'Failed to update profile')
            }
        } catch (err) {
            setError('An error occurred while updating your profile')
        } finally {
            setIsLoading(false)
        }
    }

    if (!session) {
        return <LoadingSpinner />
    }

    return (
        <>
            <SEO
                title="Profile | AI Prompt Platform"
                description="Manage your AI Prompt Platform profile settings."
            />
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    {error && <ErrorMessage message={error} />}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Profile'}
                    </Button>
                </form>
            </div>
        </>
    )
}