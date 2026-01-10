import { ConversationNotFoundError, ConversationLimitExceededError } from './errors';

// ------------------------------------------------------------------
// INTERFACES (Ideally imported from shared types)
// ------------------------------------------------------------------

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface Conversation {
    id: string;
    messages: Message[];
    message_count: number;
    updated_at: Date;
    is_archived: boolean;
}

interface AlertService {
    send(alert: { severity: string; message: string }): Promise<void>;
}

interface DatabaseMock {
    conversations: {
        findUnique(args: { where: { id: string } }): Promise<Conversation | null>;
        update(args: { where: { id: string }; data: Partial<Conversation | any> }): Promise<Conversation>;
    }
}

// ------------------------------------------------------------------
// CONVERSATION SERVICE
// ------------------------------------------------------------------

const MAX_MESSAGES_PER_CONVERSATION = 1000;

export class ConversationService {
    constructor(
        private db: DatabaseMock,
        private alertService: AlertService
    ) { }

    async getConversation(id: string): Promise<Conversation> {
        const conversation = await this.db.conversations.findUnique({ where: { id } });
        if (!conversation) {
            throw new ConversationNotFoundError(id);
        }
        return conversation;
    }

    async addMessage(conversationId: string, message: Message): Promise<Conversation> {
        const conversation = await this.getConversation(conversationId);

        // ----------------------------------------------------------------
        // PREVENTIVE VALIDATION: MESSAGE LIMIT
        // ----------------------------------------------------------------
        if (conversation.messages.length >= MAX_MESSAGES_PER_CONVERSATION) {
            throw new ConversationLimitExceededError(
                `Conversation ${conversationId} has reached the maximum of ${MAX_MESSAGES_PER_CONVERSATION} messages. ` +
                `Please archive this conversation and start a new one.`
            );
        }

        // Simulate updating the conversation
        // In a real Prisma app: data: { messages: { push: message } }
        const updatedMessages = [...conversation.messages, message];

        const updatedConversation = await this.db.conversations.update({
            where: { id: conversationId },
            data: {
                messages: updatedMessages, // Simulated DB push
                message_count: updatedMessages.length,
                updated_at: new Date()
            }
        });

        // ----------------------------------------------------------------
        // MONITORING: APPROAСHING LIMIT ALERT
        // ----------------------------------------------------------------
        // Alert if approaching limit (90%)
        if (updatedConversation.messages.length >= MAX_MESSAGES_PER_CONVERSATION * 0.9) {
            // Avoid spamming logic would go here (e.g. check if already alerted)
            await this.alertService.send({
                severity: 'WARNING',
                message: `Conversation ${conversationId} is approaching message limit (${updatedConversation.messages.length}/${MAX_MESSAGES_PER_CONVERSATION})`
            });
        }

        return updatedConversation;
    }
}
