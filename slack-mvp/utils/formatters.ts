// Utility functions for formatting data

/**
 * Formats an ISO timestamp to a human-readable time format
 * @param isoString - ISO 8601 timestamp string
 * @returns Formatted time string (e.g., "10:15 AM" or "Yesterday at 3:30 PM")
 */
export const formatTimestamp = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  // If within the last 24 hours, show time only
  if (diffInHours < 24 && date.getDate() === now.getDate()) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // If yesterday
  if (diffInDays < 2 && diffInDays >= 1) {
    return `Yesterday at ${date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  }

  // If within the last week, show day name
  if (diffInDays < 7) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  // Otherwise, show full date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Processes message content to highlight mentions
 * @param content - The raw message content
 * @returns Array of content segments with mention flags
 */
export const parseMessageContent = (content: string): Array<{ text: string; isMention: boolean }> => {
  const mentionRegex = /@(\w+)/g;
  const segments: Array<{ text: string; isMention: boolean }> = [];
  let lastIndex = 0;
  let match;

  while ((match = mentionRegex.exec(content)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      segments.push({
        text: content.substring(lastIndex, match.index),
        isMention: false,
      });
    }

    // Add mention
    segments.push({
      text: match[0],
      isMention: true,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    segments.push({
      text: content.substring(lastIndex),
      isMention: false,
    });
  }

  return segments.length > 0 ? segments : [{ text: content, isMention: false }];
};

