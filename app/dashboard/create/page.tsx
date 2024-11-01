'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import promptsApi from '@/lib/api'
import { FileUpload } from '@/components/FileUpload'
import { SEO } from '@/components/SEO'
import { Attachment } from '@/types'

export default function CreatePromptPage() {
    const [title, setTitle] = useState('')
    const [focus, setFocus] = useState('')
    const [prefixRecommendation, setPrefixRecommendation] = useState('')
    const [promptContent, setPromptContent] = useState('')
    const [attachments, setAttachments] = useState<Attachment[]>([])
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            await promptsApi.create({
                title,
                focus,
                prefixRecommendation,
                promptContent,
                attachments,
            })
            router.push('/dashboard/prompts')
        } catch (err) {
            setError('Failed to create prompt. Please try again.')
        }
    }

    const handleFileUpload = (uploadedFiles: Attachment[]) => {
        setAttachments(prevAttachments => [...prevAttachments, ...uploadedFiles])
    }

    return (
        <>
            <SEO
                title="Create New Prompt | AI Prompt Platform"
                description="Create a new AI prompt to share with the community."
            />
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Create New Prompt</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="focus">Focus</Label>
                        <Input
                            id="focus"
                            value={focus}
                            onChange={(e) => setFocus(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="prefixRecommendation">Prefix Recommendation</Label>
                        <Input
                            id="prefixRecommendation"
                            value={prefixRecommendation}
                            onChange={(e) => setPrefixRecommendation(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="promptContent">Prompt Content</Label>
                        <Textarea
                            id="promptContent"
                            value={promptContent}
                            onChange={(e) => setPromptContent(e.target.value)}
                            rows={6}
                            required
                        />
                    </div>
                    <div>
                        <Label>Attachments</Label>
                        <FileUpload onUploadComplete={handleFileUpload} />
                    </div>
                    {attachments.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium">Uploaded Attachments:</h3>
                            <ul className="list-disc pl-5">
                                {attachments.map((attachment, index) => (
                                    <li key={index}>{attachment.fileName} ({attachment.fileType})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <AlertCircle className="inline-block mr-2" />
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <Button type="submit">Create Prompt</Button>
                </form>
            </div>
        </>
    )
}