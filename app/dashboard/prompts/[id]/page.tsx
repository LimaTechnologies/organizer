'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Share2 } from 'lucide-react'
import promptsApi from '@/lib/api'
import { Prompt, Attachment } from '@/types'
import { FileUpload } from '@/components/FileUpload'
import { SEO } from '@/components/SEO'
import { ErrorMessage } from '@/components/ui/error-message'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function PromptDetailPage() {
    const [prompt, setPrompt] = useState<Prompt | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const params = useParams()

    useEffect(() => {
        const fetchPrompt = async () => {
            setIsLoading(true)
            try {
                const data = await promptsApi.getById(params.id as string)
                setPrompt(data)
            } catch (err) {
                setError('Failed to fetch prompt details.')
            } finally {
                setIsLoading(false)
            }
        }
        if (params.id) {
            fetchPrompt()
        }
    }, [params.id])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!prompt) return

        try {
            await promptsApi.update(params.id as string, prompt)
            setIsEditing(false)
        } catch (err) {
            setError('Failed to update prompt. Please try again.')
        }
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: prompt?.title,
                    text: prompt?.promptContent,
                    url: window.location.href,
                })
            } catch (err) {
                console.error('Error sharing:', err)
            }
        } else {
            // Fallback for browsers that don't support navigator.share
            alert('Sharing is not supported on this browser.')
        }
    }

    const handleFileUpload = (uploadedFiles: Attachment[]) => {
        if (prompt) {
            setPrompt({
                ...prompt,
                attachments: [...(prompt.attachments || []), ...uploadedFiles]
            })
        }
    }

    if (isLoading) {
        return <LoadingSpinner />
    }

    if (error) {
        return <ErrorMessage message={error} />
    }

    if (!prompt) {
        return <ErrorMessage message="Prompt not found" />
    }

    return (
        <>
            <SEO
                title={`${prompt.title} | AI Prompt Platform`}
                description={`View and edit the AI prompt: ${prompt.title}`}
            />
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">{isEditing ? 'Edit Prompt' : 'Prompt Details'}</h1>
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={prompt.title}
                            onChange={(e) => setPrompt({ ...prompt, title: e.target.value })}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="focus">Focus</Label>
                        <Input
                            id="focus"
                            value={prompt.focus}
                            onChange={(e) => setPrompt({ ...prompt, focus: e.target.value })}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="prefixRecommendation">Prefix Recommendation</Label>
                        <Input
                            id="prefixRecommendation"
                            value={prompt.prefixRecommendation}
                            onChange={(e) => setPrompt({ ...prompt, prefixRecommendation: e.target.value })}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="promptContent">Prompt Content</Label>
                        <Textarea
                            id="promptContent"
                            value={prompt.promptContent}
                            onChange={(e) => setPrompt({ ...prompt, promptContent: e.target.value })}
                            rows={6}
                            disabled={!isEditing}
                            required
                        />
                    </div>
                    {isEditing && (
                        <div>
                            <Label>Attachments</Label>
                            <FileUpload onUploadComplete={handleFileUpload} />
                        </div>
                    )}
                    {prompt.attachments && prompt.attachments.length > 0 && (
                        <div className="mt-2">
                            <h3 className="text-sm font-medium">Current Attachments:</h3>
                            <ul className="list-disc pl-5">
                                {prompt.attachments.map((attachment, index) => (
                                    <li key={index}>{attachment.fileName} ({attachment.fileType})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {error && <ErrorMessage message={error} />}
                    <div className="flex justify-between">
                        {isEditing ? (
                            <>
                                <Button type="submit">Save Changes</Button>
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button type="button" onClick={() => setIsEditing(true)}>
                                    Edit Prompt
                                </Button>
                                <Button type="button" variant="outline" onClick={handleShare}>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </>
    )
}