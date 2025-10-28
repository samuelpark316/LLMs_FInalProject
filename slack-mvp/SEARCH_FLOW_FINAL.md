# Search Flow - Two-Stage Implementation

## Overview
The search now works in two stages, matching Slack's exact behavior:
1. **Search Dropdown** - Quick suggestions and autocomplete
2. **Full Search Modal** - Detailed results with filters

## Search Flow

### Stage 1: Search Dropdown (Initial Click)

**Trigger:**
- Click search bar in purple top bar
- Press ⌘K / Ctrl+K

**What Appears:**
```
┌────────────────────────────────────────┐
│ 🔍 [search input]      Clear    ✕     │
├────────────────────────────────────────┤
│                                        │
│ 🔍  to                                 │
│     Search for this            [Enter] │
│                                        │
│ CHANNELS                               │
│ # towne-vacations                      │
│   Not in channel                       │
│                                        │
│ # sdr-topkey                          │
│   Not in channel                       │
│                                        │
│ MESSAGES                               │
│ frank  # gv-teammates                 │
│ Team, hope you all had a great...     │
│                                        │
│ See all 5 message results →          │
│                                        │
├────────────────────────────────────────┤
│ ↑↓ Select          Give feedback      │
└────────────────────────────────────────┘
```

**Features:**
- Floating dropdown (not full screen)
- Shows as you type suggestions:
  - **Search term option** with "Enter" button
  - **Matching channels** (up to 3)
  - **Message preview** (1 message shown)
  - **"See all X results"** link
- Click channel → Navigate to that channel
- Click "See all results" or press Enter → Opens full search modal

### Stage 2: Full Search Modal (After Clicking Search Term)

**Trigger:**
- Click the search term option in dropdown
- Press Enter in the dropdown
- Click "See all X results"

**What Appears:**
```
┌──────────────────────────────────────────────────────────┐
│ Search: [query]                          Give feedback    │
├──────────────────────────────────────────────────────────┤
│ [📨 Messages] [From] [In] [Only...] [Exclude...] [Sort] │
├──────────────────────────────────────────────────────────┤
│ 128 results                                               │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  👤  frank  # gv-teammates  Oct 3rd at 1:36 PM          │
│      Team, hope you all had a great week...              │
│                                                           │
│  👤  Ronit  austin, Rageena  Oct 15th at 12:19 PM       │
│      ronit@golden.vc & sagun@golden.vc                   │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Full search results view
- All filter options visible
- Sidebar remains visible on left
- Complete message list with highlighting

## UI Alignment

### Top Bar Navigation
- **Left/Right arrows and History button** are now aligned with the chat content
- Positioned at `ml-[328px] pl-5` (after sidebar width)
- Matches the alignment of the channel header below

### Layout Measurements
- TopBar height: `44px`
- Sidebar total width: `328px` (68px icon bar + 260px channels)
- Navigation buttons start at same X position as chat content

## Component Structure

### New Files
1. **`SearchDropdown.tsx`** - Stage 1 autocomplete dropdown

### Modified Files
1. **`WorkspaceContext.tsx`** - Added separate states for dropdown and modal
2. **`TopBar.tsx`** - Aligned navigation, opens dropdown on click
3. **`page.tsx`** - Renders both search components
4. **`ChatView.tsx`** - ⌘K opens dropdown
5. **`SearchModal.tsx`** - Receives initial query from context

## User Journey Examples

### Example 1: Quick Channel Navigation
1. User presses ⌘K
2. Dropdown appears
3. User types "software"
4. Sees "# software-engineering" in suggestions
5. Clicks on it
6. Navigates directly to that channel
7. Dropdown closes

### Example 2: Full Message Search
1. User clicks search bar
2. Dropdown appears
3. User types "database"
4. Sees preview of 1 message
5. Clicks "See all 5 message results"
6. Full search modal opens with all results
7. Can apply filters, sort, etc.
8. Clicks a result to navigate

### Example 3: Search Term Lookup
1. User presses ⌘K
2. Types "ronit"
3. Sees search term option with "Enter" button
4. Presses Enter
5. Full search modal opens with "ronit" already searched
6. Shows all 128 results

## Key Differences from Previous Implementation

| Aspect | Before | After |
|--------|--------|-------|
| Initial Click | Full modal immediately | Dropdown with suggestions |
| Search Input | In modal header | In dropdown |
| Quick Navigation | Not available | Click channel to go there |
| Full Results | Always shown | Only after clicking search term |
| Filters | Always visible | Only in full modal |
| Navigation Buttons | Left side of top bar | Aligned with chat content |

## Technical Details

### Context State Management
```typescript
- isSearchDropdownOpen: boolean  // Controls dropdown
- isSearchModalOpen: boolean     // Controls full modal
- searchQuery: string            // Passed from dropdown to modal
- openSearchDropdown()           // Opens dropdown
- openSearchModal(query)         // Opens modal with query
- closeSearchDropdown()
- closeSearchModal()
```

### Z-Index Layering
- Dropdown: `z-50` (top layer)
- Modal: `z-40` (below dropdown)
- Regular UI: `z-0` to `z-30`

### Positioning
- **Dropdown**: `top-[44px]` centered, max-width `680px`
- **Modal**: `top-[44px] left-[328px]` (after sidebar)
- **Navigation**: `ml-[328px] pl-5` (aligned with content)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| ⌘K / Ctrl+K | Open search dropdown |
| Enter | Open full search modal (from dropdown) |
| ESC | Close dropdown or modal |
| ↑↓ | Navigate suggestions (planned) |

## Visual Polish

### Colors
- Dropdown background: `#1A1D21`
- Search term highlight: `#444` gray background
- Enter button: Border with `#565856`
- Links: `#1164A3` blue

### Typography
- Dropdown labels: 12px uppercase semibold
- Search results: 15px for names, 14-15px for content
- Metadata: 13px gray

### Spacing
- Consistent padding: `px-4 py-3` for items
- Section headers: `px-4 py-2`
- Proper gaps between elements

## Testing Checklist
- [x] Click search bar opens dropdown
- [x] ⌘K opens dropdown
- [x] Typing shows suggestions
- [x] Channel suggestions appear
- [x] Message preview appears
- [x] Click channel navigates correctly
- [x] Enter opens full modal
- [x] Click search term opens modal
- [x] Query passes to modal correctly
- [x] Navigation buttons aligned with content
- [x] ESC closes dropdown
- [x] ESC closes modal
- [x] Clear button works
- [x] Sidebar stays visible throughout

