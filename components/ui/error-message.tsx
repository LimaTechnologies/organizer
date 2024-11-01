import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
    message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
    return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <AlertCircle className="inline-block mr-2" />
            <span className="block sm:inline">{message}</span>
        </div>
    )
}