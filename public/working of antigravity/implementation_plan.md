# Snippet Logic Refactor

Goal: Enable global access to snippet generation for Shortcuts and Context Menu.

## Plan

1.  **Move State to App.tsx**:
    *   `framework`, `property`, `format` state variables will be moved from `SnippetGenerator` to `App.tsx`.
    *   `App.tsx` will pass these as props to `SnippetGenerator`.

2.  **Export Generation Logic**:
    *   Create `src/utils/snippetUtils.ts` containing the `generateSnippet(color, framework, property, format)` function.
    *   This allows both `App.tsx` and `SnippetGenerator` (or just App) to use it.

3.  **Update App.tsx**:
    *   Implement `handleCopySnippet` using the new utility and current state.
    *   Update `Ctrl+C` logic: If `activeTab === 'code'`, call `handleCopySnippet`.

4.  **Update ContextMenu**:
    *   Pass `handleCopySnippet` to `onCopySnippet`.

## Logic
```typescript
// utils/snippetUtils.ts
export const generateSnippet = (color: string, framework: string, property: string, format: string) => { ... }
```
