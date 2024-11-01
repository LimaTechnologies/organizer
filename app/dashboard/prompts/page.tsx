'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination } from '@/components/ui/pagination'
import { Search, Edit, Trash } from 'lucide-react'
import promptsApi, { PaginationParams } from '@/lib/api'
import { Prompt } from '@/types'
import { SEO } from '@/components/SEO'
import { ErrorMessage } from '@/components/ui/error-message'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function PromptsPage() {
    const [prompts, setPrompts] = useState<Prompt[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchPrompts = async (params: PaginationParams) => {
        setIsLoading(true)
        setError('')
        try {
            const response = await promptsApi.getAll(params)
            setPrompts(response.prompts)
            setTotalPages(response.pagination.totalPages)
        } catch (error) {
            console.error('Failed to fetch prompts:', error)
            setError('Failed to fetch prompts. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPrompts({ page: currentPage, search: searchTerm })
    }, [currentPage, searchTerm])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        fetchPrompts({ page: 1, search: searchTerm })
    }

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this prompt?')) {
            try {
                await promptsApi.archive(id)
                fetchPrompts({ page: currentPage, search: searchTerm })
            } catch (error) {
                console.error('Failed to delete prompt:', error)
                setError('Failed to delete prompt. Please try again.')
            }
        }
    }

    return (
        <>
            <SEO
                title="My Prompts | AI Prompt Platform"
                description="View and manage your AI prompts."
            />
            <div className="space-y-6">
                <h1 className="text-3xl font-bold">My Prompts</h1>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
                    <Input
                        type="search"
                        placeholder="Search prompts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow"
                    />
                    <Button type="submit">
                        <Search className="mr-2 h-4 w-4" />
                        Search
                    </Button>
                </form>
                {isLoading ? (
                    <LoadingSpinner />
                ) : error ? (
                    <ErrorMessage message={error} />
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {prompts.map((prompt) => (
                            <Card key={prompt._id}>
                                <CardHeader>
                                    <CardTitle>{prompt.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600">{prompt.focus}</p>
                                    <p className="mt-2 text-sm">{prompt.promptContent.substring(0, 100)}...</p>
                                </CardContent>
                                <CardFooter className="justify-between">
                                    <Button asChild variant="outline">
                                        <Link href={`/dashboard/prompts/${prompt._id}`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button variant="destructive" onClick={() => handleDelete(prompt._id)}>
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </>
    )
}