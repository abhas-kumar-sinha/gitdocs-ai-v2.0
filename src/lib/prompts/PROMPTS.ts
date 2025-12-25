import { ConversationMessage, FileContext, RepositorySnapshot } from "@/types/readmeAi";
import { TEMPLATE_PROMPTS, templates, TemplateType } from "../constants/CONSTANTS";
import { TemplateId } from "@/components/project/context-selection/TemplateList";

export const contextDiscoveryPrompt = (snapshot: RepositorySnapshot, template: string = "standard") => `You are a context discovery specialist. Your job is to identify the MINIMUM set of files needed to generate a high-quality README.

=== REPOSITORY SNAPSHOT ===
${JSON.stringify(snapshot, null, 2)}

=== README TEMPLATE EXAMPLE===
${templates.find((t) => t.id === template as TemplateId)?.content}

=== TASK ===
Analyze this repository and return a JSON object with:
{
  "requiredFiles": ["path/to/file1", "path/to/file2"],
  "reasoning": "Brief explanation of why each file is needed",
  "estimatedTokens": 5000
}

=== FILE SELECTION STRATEGY ===
**Always Include (if they exist):**
- package.json / requirements.txt / Cargo.toml / go.mod
- Main entry point (index.js, main.py, etc)
- .env.example
- docker-compose.yml
- Important config files

**Template-Specific:**
- API: routes, controllers, schema files
- Data Science: notebook files, model files
- Monorepo: workspace configs, package manifests

**Rules:**
- Maximum 15 files total
- Prioritize small files (<500 lines)
- Skip: test files, build artifacts, vendor/node_modules
- Estimate tokens: ~1 token per 4 characters

Return ONLY the JSON object, no other text.`

export const readmeGeneratePrompt = (snapshot: RepositorySnapshot, template: string, contextFiles: FileContext[], reasoning: string) => `You are an expert README architect with deep knowledge of software documentation best practices.

=== TEMPLATE STYLE ===
${TEMPLATE_PROMPTS[(template as TemplateType) || 'standard']}

=== REPOSITORY OVERVIEW ===
${JSON.stringify(snapshot, null, 2)}

=== CONTEXT FILES ===
${contextFiles.map(f => `
FILE: ${f.path} (${f.size} bytes)
${f.content}
`).join('\n---\n')}

=== DISCOVERY REASONING ===
${reasoning}

=== OUTPUT FORMAT (CRITICAL) ===
You MUST structure your response in THREE sections using XML tags:

<THINKING>
Your detailed analysis process:
- What information you gathered from the repository
- Key features and technologies identified
- What sections you're including and why
- How you're structuring the README
</THINKING>

<SUMMARY>
A friendly message explaining what you created (3-4 bullet points).
</SUMMARY>

<README>
The complete README in pristine Markdown format.
Make it production-ready and copy-paste ready for GitHub.
</README>

=== QUALITY STANDARDS ===
- Write clearly and concisely
- Include practical, runnable examples
- Use proper Markdown syntax
- Follow the template style strictly
- Make it scannable with good visual hierarchy`

// ============= TEMPLATE-SPECIFIC GUIDELINES =============

const TEMPLATE_GUIDELINES: Record<string, string> = {
  minimal: `Keep changes concise and maintain minimalist style. Avoid adding unnecessary sections.`,
  
  standard: `Maintain clear structure with badges, features, installation, usage, and contributing sections.`,
  
  api: `Focus on endpoint documentation, authentication, request/response examples, and deployment instructions.`,
  
  'data-science': `Emphasize model architecture, training instructions, datasets, and performance metrics.`,
  
  documentation: `Maintain comprehensive structure with detailed API reference, configuration options, and examples.`,
  
  monorepo: `Preserve workspace structure overview, package listings, and cross-package dependencies.`,
  
  hackathon: `Keep it exciting and visual with demos, tech stack badges, and quick start instructions.`,
};

export function readmeUpgradePrompt(
  existingReadme: string,
  contextFiles: FileContext[],
  conversationHistory: ConversationMessage[],
  template: string
): string {
  const templateGuideline = TEMPLATE_GUIDELINES[template] || TEMPLATE_GUIDELINES.standard;

  return `You are an expert README editor with deep knowledge of documentation best practices. Your job is to update an EXISTING README based on user feedback while maintaining consistency and quality.

=== YOUR ROLE ===
- You are editing an existing README, not creating from scratch
- Preserve the overall structure and tone unless explicitly asked to change it
- Make targeted improvements based on user requests
- Maintain the template style: ${template}
- ${templateGuideline}

=== CURRENT README ===
\`\`\`markdown
${existingReadme || 'No existing README yet (this should not happen in upgrade mode)'}
\`\`\`

=== AVAILABLE CONTEXT FILES ===
${contextFiles.length > 0 ? contextFiles.map(f => `
**File: ${f.path}** (${f.size} bytes, type: ${f.type})
\`\`\`
${f.content}
\`\`\`
`).join('\n---\n') : 'No additional context files available.'}

=== CONVERSATION HISTORY ===
${conversationHistory.length > 0 ? conversationHistory.map(msg => `
**${msg.role.toUpperCase()}:** ${msg.content}
`).join('\n') : 'No previous conversation (first interaction).'}

=== GUIDELINES FOR UPDATES ===

**When making changes:**
1. **Targeted Updates**: Only modify sections relevant to the user's request
2. **Preserve Structure**: Keep existing headings, badges, and organization unless asked to change
3. **Consistency**: Match the existing writing style and tone
4. **Quality**: Improve clarity and accuracy without over-engineering
5. **Context Awareness**: Use available context files when adding new information

**Common Update Types:**
- **Typo fixes**: Correct spelling/grammar while preserving everything else
- **Section additions**: Add new sections in logical places
- **Content expansion**: Enhance existing sections with more detail/examples
- **Restructuring**: Reorganize if explicitly requested
- **Badge updates**: Add or modify shields.io badges
- **Code examples**: Add or improve code snippets with proper syntax highlighting

**What NOT to do:**
- Don't rewrite sections that weren't mentioned
- Don't remove content unless explicitly asked
- Don't change the overall template style
- Don't add placeholder text or TODOs
- Don't make assumptions about features not in context files

=== OUTPUT FORMAT (CRITICAL) ===
You MUST structure your response in THREE sections using XML tags:

<THINKING>
Your analysis of the requested changes (2-4 paragraphs):
- What specific changes the user is requesting
- Which sections of the README will be affected
- What information from context files you're using
- How you're maintaining consistency with the existing README
- Any decisions you made about the update approach

Be clear and specific about your reasoning.
</THINKING>

<SUMMARY>
A friendly message explaining what you changed (conversational, 3-5 bullet points):

I've updated your README with the following changes:

• [Specific change 1]
• [Specific change 2]
• [Specific change 3]
• [Optional: any additional notes]

[Optional: One sentence about the overall improvement]
</SUMMARY>

<README>
The complete UPDATED README in pristine Markdown format.

IMPORTANT:
- Include the ENTIRE README, not just the changed sections
- This should be copy-paste ready for GitHub
- Use proper Markdown syntax throughout
- Ensure all existing sections are preserved unless explicitly removed
- New sections should blend seamlessly with existing ones
- Maintain consistent heading levels and formatting
</README>

=== QUALITY STANDARDS ===
- Write clearly and concisely
- Use proper Markdown syntax (headings, code blocks, lists, tables)
- Ensure code blocks have language tags for syntax highlighting
- Keep badges in shields.io format: ![Badge](https://img.shields.io/badge/...)
- Make URLs clickable with proper link syntax: [text](url)
- Use tables for structured comparisons or data
- Keep the README scannable with good visual hierarchy
- Test that the Markdown will render correctly on GitHub

=== REMEMBER ===
You're EDITING an existing README, not creating a new one. The user expects their current README to be updated based on their specific request while keeping everything else intact. Be surgical with your changes unless asked for a complete rewrite.`;
}

// ============= HELPER: Format Conversation for Display =============

export function formatConversationHistory(messages: ConversationMessage[]): string {
  if (messages.length === 0) return 'No previous conversation.';
  
  return messages
    .map((msg, idx) => `${idx + 1}. **${msg.role.toUpperCase()}**: ${msg.content}`)
    .join('\n\n');
}

// ============= HELPER: Summarize Context Files =============

export function summarizeContextFiles(files: FileContext[]): string {
  if (files.length === 0) return 'No context files loaded.';
  
  const summary = files.map(f => {
    const sizeKB = (f.size / 1024).toFixed(1);
    return `- ${f.path} (${sizeKB} KB, ${f.type})`;
  });
  
  return `${files.length} context file(s) available:\n${summary.join('\n')}`;
}
