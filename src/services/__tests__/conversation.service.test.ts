import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConversationService, Conversation, Message } from '../conversation.service';
import { ConversationLimitExceededError } from '../errors';

// Mocks
const mockDb = {
    conversations: {
        findUnique: vi.fn(),
        update: vi.fn(),
    }
};

const mockAlertService = {
    send: vi.fn(),
};

// Helper
function createConversationWithMessages(count: number): Conversation {
    return {
        id: 'conv-123',
        messages: Array(count).fill(null).map((_, i) => ({
            id: `msg-${i}`,
            role: 'user',
            content: 'hello',
            timestamp: new Date()
        })),
        message_count: count,
        updated_at: new Date(),
        is_archived: false
    };
}

const newMessage: Message = {
    id: 'new-msg',
    role: 'user',
    content: 'new message',
    timestamp: new Date()
};

describe('ConversationService', () => {
    let service: ConversationService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new ConversationService(mockDb, mockAlertService);
    });

    describe('addMessage', () => {
        it('should allow adding message when below limit', async () => {
            const conversation = createConversationWithMessages(500);
            mockDb.conversations.findUnique.mockResolvedValue(conversation);
            mockDb.conversations.update.mockImplementation(async ({ data }) => ({
                ...conversation,
                messages: data.messages,
                message_count: data.messages.length
            }));

            const result = await service.addMessage(conversation.id, newMessage);

            expect(result.messages.length).toBe(501);
            expect(mockDb.conversations.update).toHaveBeenCalled();
        });

        it('should reject message when limit reached (1000)', async () => {
            const conversation = createConversationWithMessages(1000);
            mockDb.conversations.findUnique.mockResolvedValue(conversation);

            await expect(
                service.addMessage(conversation.id, newMessage)
            ).rejects.toThrow(ConversationLimitExceededError);

            expect(mockDb.conversations.update).not.toHaveBeenCalled();
        });

        it('should send alert when approaching limit (900+)', async () => {
            const conversation = createConversationWithMessages(900);

            mockDb.conversations.findUnique.mockResolvedValue(conversation);
            mockDb.conversations.update.mockImplementation(async ({ data }) => ({
                ...conversation,
                messages: data.messages, // 901
                message_count: 901
            }));

            await service.addMessage(conversation.id, newMessage);

            expect(mockAlertService.send).toHaveBeenCalledWith(
                expect.objectContaining({
                    severity: 'WARNING',
                    message: expect.stringContaining('approaching message limit')
                })
            );
        });

        it('should NOT send alert when well below limit', async () => {
            const conversation = createConversationWithMessages(100);

            mockDb.conversations.findUnique.mockResolvedValue(conversation);
            mockDb.conversations.update.mockImplementation(async ({ data }) => ({
                ...conversation,
                messages: data.messages, // 101
                message_count: 101
            }));

            await service.addMessage(conversation.id, newMessage);

            expect(mockAlertService.send).not.toHaveBeenCalled();
        });
    });
});
