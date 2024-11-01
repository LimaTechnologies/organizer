import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Prompt } from '@/models/Prompt';
import { User } from '@/models/User';
import dbConnect from '@/lib/mongoose';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/').pop();
    console.log('GET request received for prompt ID:', id);
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        console.log('No session found');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const prompt = await Prompt.findById(id).populate('author', 'name email');
        if (!prompt) {
            console.log('Prompt not found in database');
            return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
        }
        console.log('Prompt found:', prompt);
        return NextResponse.json(prompt);
    } catch (error) {
        console.error('Error fetching prompt:', error);
        return NextResponse.json({ error: 'Error fetching prompt' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/').pop();
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const prompt = await Prompt.findById(id);
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if the user is an admin or the owner of the prompt
        if (!user.isAdmin && prompt.author.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden: You do not have permission to edit this prompt' }, { status: 403 });
        }

        const body = await req.json();
        const { title, focus, prefixRecommendation, promptContent, attachments, archived } = body;

        prompt.title = title;
        prompt.focus = focus;
        prompt.prefixRecommendation = prefixRecommendation;
        prompt.promptContent = promptContent;
        prompt.attachments = attachments;
        prompt.archived = archived;

        await prompt.save();
        return NextResponse.json(prompt);
    } catch (error) {
        console.error('Error updating prompt:', error);
        return NextResponse.json({ error: 'Error updating prompt' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const id = req.nextUrl.pathname.split('/').pop();
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const prompt = await Prompt.findById(id);
        if (!prompt) {
            return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if the user is an admin or the owner of the prompt
        if (!user.isAdmin && prompt.author.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden: You do not have permission to delete this prompt' }, { status: 403 });
        }

        // Instead of deleting, we'll archive the prompt
        prompt.archived = true;
        await prompt.save();

        return NextResponse.json({ message: 'Prompt archived successfully' });
    } catch (error) {
        console.error('Error archiving prompt:', error);
        return NextResponse.json({ error: 'Error archiving prompt' }, { status: 500 });
    }
}