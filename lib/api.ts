import { PaginatedResponse, Prompt } from '@/types';
import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
});

export interface PromptData {
    title: string;
    focus: string;
    prefixRecommendation: string;
    promptContent: string;
    attachments: Array<{
        fileName: string;
        fileUrl: string;
        fileType: string;
    }>;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

const promptsApi = {
    getAll: async (params: PaginationParams = {}) => {
        const response = await api.get('/prompts', { params });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/prompts/${id}`);
        return response.data;
    },

    create: async (promptData: PromptData) => {
        const response = await api.post('/prompts', promptData);
        return response.data;
    },

    update: async (id: string, promptData: Partial<PromptData> & { archived?: boolean }) => {
        try {
            const response = await api.put(`/prompts/${id}`, promptData);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 403) {
                    throw new Error('You do not have permission to edit this prompt');
                }
            }
            throw error;
        }
    },

    archive: async (id: string) => {
        try {
            const response = await api.delete(`/prompts/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 403) {
                    throw new Error('You do not have permission to archive this prompt');
                }
            }
            throw error;
        }
    },
    uploadAttachment: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default promptsApi;