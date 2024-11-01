import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { User } from '@/models/User'
import dbConnect from '@/lib/mongoose'
import { hash } from 'bcrypt'
import { authOptions } from '@/lib/auth'

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    try {
        const { name, email, password } = await req.json()
        const user = await User.findById(session.user.id)

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        user.name = name
        user.email = email

        if (password) {
            user.password = await hash(password, 10)
        }

        await user.save()

        return NextResponse.json({ message: 'Profile updated successfully' })
    } catch (error) {
        console.error('Error updating user profile:', error)
        return NextResponse.json({ error: 'Error updating profile' }, { status: 500 })
    }
}