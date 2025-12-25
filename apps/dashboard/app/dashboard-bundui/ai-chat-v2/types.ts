export type AIChatMessage = {
    id: string;
    content: string;
    translatedContent?: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    language: string; // 'en', 'es', etc.
};

export type AIChatSession = {
    id: string;
    messages: AIChatMessage[];
    summary?: string;
    languages: string[]; // Languages involved in the session
};
