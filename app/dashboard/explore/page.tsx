'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Sparkles, Search, Star } from 'lucide-react'
import { SEO } from '@/components/SEO'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import promptsApi from '@/lib/api'
import { Prompt, PaginatedResponse } from '@/types'
import Link from 'next/link'

export default function ExplorePage() {
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])


    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const response = await promptsApi.getAll({ limit: 20 })
                setPrompts(response.prompts as Prompt[])
            } catch (error) {
                console.error('Failed to fetch prompts:', error)
                setError('Failed to load prompts. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchPrompts()
    }, [searchTerm])

    useEffect(() => {
        if (prompts.length !== 0 && !loading) {
            setFilteredPrompts(
                prompts.filter((prompt) =>
                    prompt.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
            )
        }
    }, [prompts, searchTerm, loading])

    return (
        <>
            <SEO
                title="Explore Prompts | AI Prompt Platform"
                description="Discover and explore AI prompts created by our community."
            />
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                        Explore Prompts
                    </h1>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search prompts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                </div>

                {loading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <div className="text-center text-red-500">{error}</div>
                ) : filteredPrompts.length === 0 ? (
                    <div className="text-center text-muted-foreground">No prompts found.</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPrompts.map((prompt) => (
                            <PromptCard key={prompt._id} prompt={prompt} />
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

function PromptCard({ prompt }: { prompt: Prompt }) {
    return (
        <Card className="ai-card flex flex-col relative">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold">{prompt.title}</h3>
                    <p className="text-sm text-muted-foreground">{prompt.focus}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
            </div>
            <p className="text-sm mb-4 flex-grow">{prompt.promptContent.substring(0, 100)}...</p>
            <div className="flex justify-between items-center mt-auto relative z-10">
                <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium">N/A</span>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/explore/${prompt._id}`}>
                        View Details
                    </Link>
                </Button>
            </div>
        </Card>
    )
}