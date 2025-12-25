"use client";

/**
 * ChatMessagesWrapper - Safe wrapper for shared ChatMessages component
 * 
 * PURPOSE:
 * This wrapper applies custom styling to the shared ChatMessages component
 * without modifying the original. This ensures that future updates to the
 * ai-chat module are inherited automatically without breaking customizations.
 * 
 * CUSTOMIZATIONS:
 * - Bottom-aligned messages when conversation is short (justify-end)
 * - Maintains all original ChatMessages functionality
 * 
 * PATTERN:
 * Always wrap third-party/shared components instead of modifying them directly.
 * See: COMPONENT_WRAPPER_PATTERN.md for full guidelines.
 */

import React from 'react';
import { ChatMessages } from '../../ai-chat/components/ChatMessages';
import { ChatMessagesProps } from '../../ai-chat/types';

export function ChatMessagesWrapper(props: ChatMessagesProps) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0 relative flex flex-col">
                {/* Custom wrapper with bottom alignment for short conversations */}
                <div className="h-full overflow-y-auto">
                    <div className="min-h-full flex flex-col justify-end">
                        <ChatMessages {...props} />
                    </div>
                </div>
            </div>
        </div>
    );
}
