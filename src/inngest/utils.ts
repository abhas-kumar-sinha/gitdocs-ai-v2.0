import { AgentResult, Message } from "@inngest/agent-kit";

/**
 * Type guard to check if a message has content
 */
function hasContent(message: Message): message is Message & { content: string | Array<{ type: string; text: string }> } {
  return 'content' in message && message.content !== undefined;
}

/**
 * Extract all text content from an agent result
 * Handles both string and array content formats, and multiple assistant messages
 */
export function extractAgentText(result: AgentResult): string | undefined {
  const assistantMessages = result.output.filter(
    (message) => message.role === "assistant" && hasContent(message)
  );

  if (assistantMessages.length === 0) {
    return undefined;
  }

  const textContent = assistantMessages
    .map((message) => {
      if (!hasContent(message)) return '';

      const content = message.content;

      // Handle string content
      if (typeof content === "string") {
        return content;
      }

      // Handle array of content blocks
      if (Array.isArray(content)) {
        return content
          .filter((block) => block.type === 'text')
          .map((block) => block.text)
          .join('\n');
      }

      return '';
    })
    .filter(Boolean)
    .join('\n\n');

  return textContent || undefined;
}

/**
 * Get only the last assistant message text (original function)
 */
export function lastAssistantTextMessage(result: AgentResult): string | undefined {
  const lastAssistantMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant" && hasContent(message)
  );

  if (lastAssistantMessageIndex === -1) {
    return undefined;
  }

  const message = result.output[lastAssistantMessageIndex];

  if (!hasContent(message)) {
    return undefined;
  }

  const content = message.content;

  // Handle string content
  if (typeof content === "string") {
    return content;
  }

  // Handle array of content blocks
  if (Array.isArray(content)) {
    return content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');
  }

  return undefined;
}