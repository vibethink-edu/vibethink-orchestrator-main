
import { recordCurrentConversationDecisions } from './conversationTracker';

// Auto-initialize documentation for current conversation
export const initializeCurrentConversationDocumentation = () => {
  // This will be called when the app loads to ensure current decisions are recorded
  recordCurrentConversationDecisions();
  
  // TODO: log en cada punto donde había console.log, console.error o console.warn
};

// Call this when the app loads
setTimeout(() => {
  initializeCurrentConversationDocumentation();
}, 1000);
