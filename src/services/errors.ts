
export class ConversationLimitExceededError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConversationLimitExceededError';
    }
}

export class ConversationNotFoundError extends Error {
    constructor(conversationId: string) {
        super(`Conversation not found: ${conversationId}`);
        this.name = 'ConversationNotFoundError';
    }
}
