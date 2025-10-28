# Temporary Auto-Reply Implementation

## Overview
This document describes the temporary hard-coded auto-reply functionality added to the application. This is for demo/testing purposes only and should be removed later.

## What Was Added

### 1. Auto-Reply Logic (`slack-mvp/api/mockApi.ts`)
- Added a new `getAutoReply()` function that generates automatic responses based on the channel
- **Sam Park** auto-replies with "Nah I'm good, you got it though" to any message in the `software-engineering` channel (channelId: 'c01')
- **Sagun Venuganti** auto-replies with "Let's ensure that Mr. Park is unemployed by end of week." to any direct message to him (channelId: 'dm_u02')

### 2. Integration (`slack-mvp/components/layout/MessageInput.tsx`)
- Imported the `getAutoReply` function
- Added code to call `getAutoReply()` after a message is posted
- Displays the auto-reply in the chat view

## How to Delete This Later

### Step 1: Remove from `slack-mvp/api/mockApi.ts`
Delete the entire section marked with comments:
```typescript
// ====== TEMPORARY HARD-CODED AUTO-REPLIES - DELETE LATER ======
// ... entire getAutoReply function ...
// ====== END TEMPORARY HARD-CODED AUTO-REPLIES ======
```

### Step 2: Update `slack-mvp/components/layout/MessageInput.tsx`
1. Remove the import:
   - Change: `import { postMessage, getAutoReply } from '../../api/mockApi'; // TEMP: added getAutoReply`
   - To: `import { postMessage } from '../../api/mockApi';`

2. Remove the auto-reply call in the `handleSubmit` function:
```typescript
// Delete these lines:
// ====== TEMPORARY HARD-CODED AUTO-REPLIES - DELETE LATER ======
const autoReply = await getAutoReply(optimisticMessage);
if (autoReply) {
  onMessageSent(autoReply);
}
// ====== END TEMPORARY HARD-CODED AUTO-REPLIES ======
```

### Step 3: Delete this documentation file
Delete `slack-mvp/TEMP_AUTO_REPLIES.md`

## Search Terms for Quick Removal
Search the codebase for these terms to find all temporary code:
- `TEMPORARY HARD-CODED AUTO-REPLIES`
- `DELETE LATER`
- `getAutoReply`

## Testing
1. Go to the `software-engineering` channel and send any message
   - Sam Park should auto-reply with "Nah I'm good, you got it though"
2. Go to direct messages with Sagun Venuganti and send any message
   - Sagun should auto-reply with "Let's ensure that Mr. Park is unemployed by end of week."

