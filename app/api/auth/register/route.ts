import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongoose';

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const { name, email, password } = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ error: 'Error registering user' }, { status: 500 });
    }
}