import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'
import { SEO } from '@/components/SEO'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

export default function SignUp() {
    return (
        <>
            <SEO
                title="Sign Up | AI Prompt Platform"
                description="Create a new account on AI Prompt Platform to start sharing and discovering AI prompts."
            />
            <div className="container mx-auto flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Create a new account</CardTitle>
                        <CardDescription className="text-center">Sign up to start sharing and discovering AI prompts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RegisterForm />
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link href="/auth/signin" className="text-sm text-primary hover:underline">
                            Already have an account? Sign in
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}