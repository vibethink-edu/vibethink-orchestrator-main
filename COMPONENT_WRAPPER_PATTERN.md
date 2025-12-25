# Component Wrapper Pattern - Security Standard

**Version:** 1.0  
**Last Updated:** 2025-12-23  
**Status:** 🔒 Mandatory for all third-party/shared component customizations

---

## 🎯 Purpose

This pattern ensures that customizations to third-party or shared components are **update-safe** and **maintainable**. By wrapping components instead of modifying them directly, we:

- ✅ Inherit all future updates automatically
- ✅ Preserve custom styling and behavior
- ✅ Maintain clear separation of concerns
- ✅ Enable easy rollback if needed

---

## 📋 When to Use This Pattern

Apply this pattern when you need to:

1. **Customize a shared component** from another module (e.g., `ai-chat`, `mail`, `crm`)
2. **Modify a third-party library component** (e.g., Shadcn UI, Bundui Premium)
3. **Add module-specific behavior** to a reusable component
4. **Apply custom styling** without touching the original source

---

## 🚫 Anti-Pattern (DO NOT DO THIS)

```typescript
// ❌ WRONG: Modifying shared component directly
// File: apps/dashboard/app/dashboard-bundui/ai-chat/components/ChatMessages.tsx

export function ChatMessages({ messages }: ChatMessagesProps) {
    return (
        <div className="custom-style-for-projects-v2"> {/* ❌ BAD */}
            {/* Original component code */}
        </div>
    );
}
```

**Problems:**
- Future updates to `ai-chat` module will overwrite your changes
- Breaks the component for other modules that don't expect the custom style
- No clear ownership or documentation

---

## ✅ Correct Pattern (DO THIS)

```typescript
// ✅ CORRECT: Create a wrapper in your module
// File: apps/dashboard/app/dashboard-bundui/projects-v2/components/ChatMessagesWrapper.tsx

"use client";

/**
 * ChatMessagesWrapper - Safe wrapper for shared ChatMessages component
 * 
 * PURPOSE:
 * Applies custom styling for Projects V2 module without modifying the original.
 * 
 * CUSTOMIZATIONS:
 * - Bottom-aligned messages for short conversations
 * - Custom overflow behavior
 * 
 * ORIGINAL COMPONENT:
 * @see apps/dashboard/app/dashboard-bundui/ai-chat/components/ChatMessages.tsx
 */

import React from 'react';
import { ChatMessages } from '../../ai-chat/components/ChatMessages';
import { ChatMessagesProps } from '../../ai-chat/types';

export function ChatMessagesWrapper(props: ChatMessagesProps) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0 relative flex flex-col">
                <div className="h-full overflow-y-auto">
                    <div className="min-h-full flex flex-col justify-end">
                        {/* Original component - untouched */}
                        <ChatMessages {...props} />
                    </div>
                </div>
            </div>
        </div>
    );
}
```

**Benefits:**
- ✅ Original component remains pristine
- ✅ Updates to `ChatMessages` are inherited automatically
- ✅ Clear documentation of customizations
- ✅ Easy to remove wrapper if no longer needed

---

## 📝 Implementation Checklist

When creating a wrapper component:

- [ ] **File Location**: Place wrapper in the consuming module's `components/` directory
- [ ] **Naming Convention**: Use `{OriginalName}Wrapper.tsx` format
- [ ] **Documentation**: Include JSDoc with:
  - Purpose of the wrapper
  - List of customizations applied
  - Reference to original component path
- [ ] **Props**: Pass through all original props using spread operator (`{...props}`)
- [ ] **Export**: Export from module's `index.ts` for clean imports
- [ ] **Update Imports**: Replace direct imports with wrapper imports

---

## 🔍 Real-World Example

### Before (Unsafe):

```typescript
// projects-v2/components/contextual-side-panel.tsx
import { ChatMessages } from "../../ai-chat/components/ChatMessages"; // ❌

<ChatMessages messages={messages} isLoading={isLoading} />
```

### After (Safe):

```typescript
// projects-v2/components/contextual-side-panel.tsx
import { ChatMessagesWrapper } from "./ChatMessagesWrapper"; // ✅

<ChatMessagesWrapper messages={messages} isLoading={isLoading} />
```

---

## 🛡️ Additional Security Rules

1. **Never modify files outside your module** unless you own them
2. **Document all wrappers** in the module's README
3. **Review wrappers during updates** to ensure they're still necessary
4. **Prefer composition over modification** always

---

## 📚 Related Patterns

- **Adapter Pattern**: When you need to change the component's interface
- **Decorator Pattern**: When you need to add behavior without changing structure
- **Facade Pattern**: When you need to simplify a complex component API

---

## 🚀 Quick Reference

| Scenario | Solution |
|----------|----------|
| Need custom styling | Create wrapper with custom CSS classes |
| Need additional props | Create wrapper that accepts extra props |
| Need behavior override | Create wrapper with custom logic, then render original |
| Need to combine components | Create wrapper that composes multiple components |

---

**Last Updated:** 2025-12-23  
**Approved By:** Marcelo Escallón  
**Status:** 🔒 Mandatory Standard

---

## 📞 Questions?

If you're unsure whether to create a wrapper:
1. Ask: "Will this change affect other modules?"
2. If YES → Create a wrapper
3. If NO → Still consider a wrapper for future-proofing

**When in doubt, wrap it out.** 🎁
