'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, Copy, Check, User, Tag, Calendar } from 'lucide-react'
import promptsApi from '@/lib/api'
import { Prompt } from '@/types'
import { SEO } from '@/components/SEO'
import { ErrorMessage } from '@/components/ui/error-message'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import ReactMarkdown from 'react-markdown'
import { motion } from 'framer-motion'

export default function PromptDetailPage() {
    const params = useParams()
    const id = params?.id as string
    const [prompt, setPrompt] = useState<Prompt | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [copiedPrefix, setCopiedPrefix] = useState(false)
    const [copiedPrompt, setCopiedPrompt] = useState(false)

    useEffect(() => {
        const fetchPrompt = async () => {
            if (!id) {
                setError('Invalid prompt ID')
                setLoading(false)
                return
            }

            try {
                const data = await promptsApi.getById(id)
                setPrompt(data)
            } catch (err) {
                console.error('Failed to fetch prompt:', err)
                setError('Failed to load prompt details. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchPrompt()
    }, [id])

    const handleCopy = (text: string, setCopiedState: (value: boolean) => void) => {
        navigator.clipboard.writeText(text)
        setCopiedState(true)
        setTimeout(() => setCopiedState(false), 2000)
    }

    if (loading) return <LoadingSpinner />
    if (error) return <ErrorMessage message={error} />
    if (!prompt) return <ErrorMessage message="Prompt not found" />

    return (
        <>
            <SEO
                title={`${prompt.title} | AI Prompt Platform`}
                description={`View details of the AI prompt: ${prompt.title}`}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-4"
            >
                <Card className="max-w-4xl mx-auto p-8 shadow-lg bg-background dark:bg-gray-800">
                    <div className="space-y-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 dark:from-blue-400 dark:to-blue-600">
                                    {prompt.title}
                                </h1>
                                <p className="text-lg text-muted-foreground dark:text-gray-300">{prompt.focus}</p>
                            </div>
                            <div className="p-3 bg-primary/10 dark:bg-blue-900/50 rounded-full">
                                <Sparkles className="h-8 w-8 text-primary dark:text-blue-400" />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground dark:text-gray-400">
                            <div className="flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                <span>Created by: {typeof prompt.author === 'string' ? prompt.author : prompt.author.name}</span>
                            </div>
                            <div className="flex items-center">
                                <Tag className="h-4 w-4 mr-2" />
                                <span>Focus: {prompt.focus}</span>
                            </div>
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>Created: {new Date(prompt.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <Card className="bg-muted dark:bg-gray-700 p-6 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Prefix Recommendation</h2>
                            <p className="mb-4 text-lg dark:text-gray-300">{prompt.prefixRecommendation}</p>
                            <Button
                                onClick={() => handleCopy(prompt.prefixRecommendation, setCopiedPrefix)}
                                variant="outline"
                                className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 transition-all duration-200 ease-in-out transform hover:scale-105"
                            >
                                {copiedPrefix ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                {copiedPrefix ? 'Copied!' : 'Copy Prefix'}
                            </Button>
                        </Card>

                        <Card className="bg-muted dark:bg-gray-700 p-6 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4 dark:text-white">Prompt Content</h2>
                            <div className="prose dark:prose-invert max-w-none mb-4">
                                <ReactMarkdown>{prompt.promptContent}</ReactMarkdown>
                            </div>
                            <Button
                                onClick={() => handleCopy(prompt.promptContent, setCopiedPrompt)}
                                variant="outline"
                                className="bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 transition-all duration-200 ease-in-out transform hover:scale-105"
                            >
                                {copiedPrompt ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                                {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
                            </Button>
                        </Card>
                    </div>
                </Card>
            </motion.div>
        </>
    )
}