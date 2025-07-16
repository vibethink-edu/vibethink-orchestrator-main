
# UI/UX Standards for the Project

## Overview
This document establishes the mandatory UI/UX standards that must be followed throughout the entire project to ensure consistent user experience and accessibility.

## Tooltip Requirements (MANDATORY)

### Elements that MUST have tooltips:
- ✅ All buttons (action buttons, icon buttons, toggle buttons)
- ✅ All icons (especially standalone icons)
- ✅ Form inputs (explaining purpose or validation rules)
- ✅ Badges and status indicators
- ✅ Navigation items
- ✅ Filter and search controls
- ✅ Settings toggles and switches
- ✅ Action items in tables/lists
- ✅ Pagination controls
- ✅ View mode toggles (grid/list)

### Tooltip Best Practices:
1. **Descriptive**: Clearly explain what the element does
2. **Contextual**: Include current state when relevant (e.g., "Collapse sidebar" vs "Expand sidebar")
3. **Concise**: Keep messages short but informative
4. **Actionable**: Use action verbs for interactive elements
5. **Consistent**: Use standard terminology across the app

### Implementation:
- Use the `TooltipWrapper` component for consistent behavior
- Always wrap interactive elements with tooltips
- Use Spanish for tooltip messages (matching app language)
- Set appropriate positioning to avoid UI conflicts

## Component Standards

### Interactive Elements:
- All buttons must have tooltips explaining their action
- All icons must have tooltips explaining their meaning
- Form fields should have tooltips explaining validation or purpose
- Status indicators should explain what the status means

### Loading and Error States:
- Show loading spinners for async operations
- Display meaningful error messages with recovery actions
- Provide empty state messages with clear next steps

### Responsive Design:
- All components must work on mobile and desktop
- Tooltips should be disabled or adapted for touch devices
- Ensure touch targets are appropriately sized

### Accessibility:
- Keyboard navigation support for all interactive elements
- Proper ARIA labels and roles
- Sufficient color contrast
- Focus indicators for all interactive elements

## Code Examples

### Basic Tooltip Usage:
```tsx
import { TooltipWrapper } from '@/components/ui/TooltipWrapper';

// Button with tooltip
<TooltipWrapper content="Guardar cambios">
  <Button onClick={handleSave}>
    <Save className="w-4 h-4" />
  </Button>
</TooltipWrapper>

// Icon with tooltip
<TooltipWrapper content="Estado activo de la empresa">
  <Badge className="bg-green-500/20 text-green-400">
    ACTIVE
  </Badge>
</TooltipWrapper>
```

### Advanced Tooltip with State:
```tsx
<TooltipWrapper 
  content={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
>
  <Button onClick={toggleSidebar}>
    <Menu className="w-4 h-4" />
  </Button>
</TooltipWrapper>
```

## Enforcement
These standards are MANDATORY and should be applied to:
- All new components
- All existing components during updates
- All third-party component integrations

## Tools and Resources
- Use `src/utils/uiGuidelines.ts` for standard tooltip messages
- Use `TooltipWrapper` component for consistent implementation
- Reference `STANDARD_TOOLTIPS` object for common messages

Remember: Good UX is not optional - it's a fundamental requirement for professional applications.
