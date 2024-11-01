// types/index.ts
import { DefaultSession } from 'next-auth';

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
        }
    }
}

export interface Attachment {
    fileName: string;
    fileUrl: string;
    fileType: string;
}

export interface Prompt {
    _id: string;
    title: string;
    focus: string;
    prefixRecommendation: string;
    promptContent: string;
    author: string | { _id: string; name: string; email: string };
    attachments: Attachment[];
    archived: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}