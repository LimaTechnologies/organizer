import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

export default function SignIn() {
    return (
        <>
            <SEO
                title="Sign In | AI Prompt Platform"
                description="Sign in to your AI Prompt Platform account to create, share, and discover AI prompts."
            />
            <div className="container mx-auto flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Sign in to your account</CardTitle>
                        <CardDescription className="text-center">Access your AI Prompt Platform account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm />
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link href="/auth/signup" className="text-sm text-primary hover:underline">
                            Don't have an account? Sign up
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}