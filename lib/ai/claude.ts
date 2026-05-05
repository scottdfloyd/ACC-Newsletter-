import Anthropic from "@anthropic-ai/sdk";
import type { SocialPost } from "@/lib/social/mock-feeds";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface GenerateNewsletterInput {
  month: string;
  year: number;
  talkingPoints: string;
  links: string[];
  socialPosts: SocialPost[];
  selectedTheme?: string;
}

export interface GeneratedNewsletter {
  theme: string;
  subThemes: string[];
  body: string;
  suggestedThemes: string[];
}

export async function detectCulturalThemes(
  posts: SocialPost[],
  month: string,
  year: number
): Promise<string[]> {
  const postSummary = posts
    .map((p) => `[${p.businessUnit}/${p.platform}]: ${p.content}`)
    .join("\n\n");

  const message = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are a cultural trend analyst for a marketing agency community. Based on these social media posts from ${month} ${year}, identify 4-6 cultural moments or themes that appear most prominently. Focus on entertainment events (Super Bowl, Grammys, Oscars, etc.), cultural trends, and brand activations.

Social posts:
${postSummary}

Return ONLY a JSON array of theme strings, no explanation. Example: ["Super Bowl Season", "Awards Season Activations", "Brand Storytelling"]`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "[]";
  try {
    return JSON.parse(text);
  } catch {
    return ["Cultural Moments", "Brand Activations", "Entertainment Marketing"];
  }
}

export async function generateNewsletter(
  input: GenerateNewsletterInput
): Promise<GeneratedNewsletter> {
  const postSummary = input.socialPosts
    .map(
      (p) =>
        `[${p.businessUnit} / ${p.platform}] Posted ${new Date(p.postedAt).toLocaleDateString()}:\n${p.content}`
    )
    .join("\n\n---\n\n");

  const linksSection = input.links.length
    ? `\nRelevant links to weave in:\n${input.links.join("\n")}`
    : "";

  const themeInstruction = input.selectedTheme
    ? `The newsletter theme is: "${input.selectedTheme}". Organize the content around this theme.`
    : "Choose the strongest unifying cultural theme from the content and organize the newsletter around it.";

  const message = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are the editorial voice for the ACC (Acceleration Community of Companies) monthly newsletter. ACC is a community of ~650 marketing professionals across 10 business units working with brands like Pepsi, T-Mobile, Meta, Google, and Netflix.

Write a professional, energizing ~1,200-word newsletter that synthesizes this month's activity THEMATICALLY — not by business unit. The tone is insider, proud, and forward-thinking. Write as if speaking to the entire ACC community about the incredible work happening across the organization.

${themeInstruction}

Monthly talking points from leadership:
${input.talkingPoints}
${linksSection}

Social media highlights from our business units this month:
${postSummary}

Return your response as JSON with this exact structure:
{
  "theme": "The single main theme headline (e.g., 'Awards Season: ACC Owns the Moment')",
  "subThemes": ["sub-theme 1", "sub-theme 2", "sub-theme 3"],
  "body": "The full newsletter body in HTML format (use <h2>, <p>, <strong>, <em> tags). ~1200 words.",
  "suggestedThemes": ["Alternative theme 1", "Alternative theme 2", "Alternative theme 3"]
}`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found");
    return JSON.parse(jsonMatch[0]);
  } catch {
    return {
      theme: "This Month at ACC",
      subThemes: ["Community Highlights", "Brand Wins", "What's Next"],
      body: `<p>Newsletter generation encountered an issue. Please try again or contact support.</p><p>Raw content: ${text.substring(0, 500)}</p>`,
      suggestedThemes: [],
    };
  }
}
