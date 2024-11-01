import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Prompt } from '@/models/Prompt';
import dbConnect from '@/lib/mongoose';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use optional chaining and provide a fallback for tests
    const searchParams = req.nextUrl?.searchParams || new URLSearchParams();
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    try {
        const filter: any = { archived: false };
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { focus: { $regex: search, $options: 'i' } },
            ];
        }

        const [prompts, total] = await Promise.all([
            Prompt.find(filter)
                .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Prompt.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            prompts,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
            },
        });
    } catch (error) {
        console.error('Error fetching prompts:', error);
        return NextResponse.json({ error: 'Error fetching prompts' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { title, focus, prefixRecommendation, promptContent, attachments } = body;
        const newPrompt = new Prompt({
            title,
            focus,
            prefixRecommendation,
            promptContent,
            attachments,
            author: session.user.id,
        });
        await newPrompt.save();
        return NextResponse.json(newPrompt, { status: 201 });
    } catch (error) {
        console.error('Error creating prompt:', error);
        return NextResponse.json({ error: 'Error creating prompt' }, { status: 500 });
    }
}