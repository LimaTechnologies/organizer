'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertCircle, Upload } from 'lucide-react'
import { Attachment } from '@/types'

interface FileUploadProps {
    onUploadComplete: (files: Attachment[]) => void
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState('')

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        setError('')

        const formData = new FormData()
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i])
        }

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            const uploadedFiles: Attachment[] = data.files.map((file: any) => ({
                fileName: file.fileName,
                fileUrl: file.fileUrl,
                fileType: file.fileType || 'unknown' // Add fileType here
            }))
            onUploadComplete(uploadedFiles)
        } catch (err) {
            setError('File upload failed. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-4">
            <Input
                type="file"
                onChange={handleFileUpload}
                disabled={isUploading}
                multiple
                accept="image/*,.pdf,.doc,.docx"
            />
            {isUploading && <p>Uploading...</p>}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <AlertCircle className="inline-block mr-2" />
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            <Button type="button" disabled={isUploading}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
            </Button>
        </div>
    )
}