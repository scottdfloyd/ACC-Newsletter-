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
  openingNote?: string;
}

export interface GeneratedNewsletter {
  theme: string;
  subThemes: string[];
  body: string;
  suggestedThemes: string[];
}

export async function generateNewsletter(
  input: GenerateNewsletterInput
): Promise<GeneratedNewsletter> {
  const postSummary = input.socialPosts
    .map(
      (p) =>
        `[${p.businessUnit} / ${p.platform}]: ${p.content}`
    )
    .join("\n\n");

  const linksSection = input.links.length
    ? `\nReference links:\n${input.links.join("\n")}`
    : "";

  const themeInstruction = input.selectedTheme
    ? `The newsletter theme is: "${input.selectedTheme}". Organize ALL content around this theme — do NOT organize by business unit.`
    : `Choose the strongest unifying cultural theme from the content. Do NOT organize by business unit.`;

  const openingSection = input.openingNote
    ? `\nLeadership opening note (use this as the intro voice/tone — Scott Floyd, CEO):\n${input.openingNote}`
    : "";

  const message = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `You are the editorial voice for the ACC Global Newsletter — the monthly internal newsletter for the Acceleration Community of Companies (ACC), a community of ~650 marketing professionals across 9 business units: ACC (parent), DKC, HangarFour, MKG, Pink Sparrow, Pixly, Trailblaze, Ingenuity, and PMK Entertainment. Clients include Pepsi, T-Mobile, Meta, Google, Netflix, Disney, HBO, and more.

VOICE & STYLE RULES — follow these exactly:
- Energetic, proud, celebratory. Written TO the ACC family, not at them.
- Use phrases like "CRUSHED it", "firing on all cylinders", "they WERE THE NOISE" — bold and declarative
- Short, punchy paragraphs. Specific details matter: client names, event names, metrics, talent names
- Thematic flow — do NOT organize by business unit. Weave agencies together naturally
- When metrics exist, use them: impressions, sales figures, placements, engagement rates
- Celebrate cross-agency collaborations prominently
- Write as if you're proud of every single win in this newsletter

PAST NEWSLETTER STYLE EXAMPLES:
Opening example: "Hard to believe we are on the backside of Summer. And what a Summer it has been for the ACC Community. We've seen some incredible work over the past 60 days or so. Be PROUD of the work, celebrate the incredible execution and spread the word of ACC to your clients and potential clients."

Activation blurb example: "MKG executed an exclusive, once-in-a-lifetime screening experience for Delta SkyMiles members, bringing to life Delta's partnership with Paramount Pictures for an exclusive member-only event and screening of Mission: Impossible – The Final Reckoning. Every detail reflected the innovation and intrigue that make both Delta Airlines and the Mission: Impossible franchise so special; guests enjoyed valet drop-off, Delta Dossiers, personalized badges, passed bites, custom cocktails, and co-branded giveaways."

${themeInstruction}
${openingSection}

Leadership talking points for ${input.month} ${input.year}:
${input.talkingPoints}
${linksSection}

Social media content and activations from our business units:
${postSummary}

CONTENT TO INCLUDE — weave these in thematically:

FILM & ENTERTAINMENT:
- Grey Goose x The Devil Wears Prada 2: ACC Entertainment Marketing led first-of-its-kind global film co-promotion. Sourced and negotiated Disney partnership. Fronted by Heidi Klum spotlighting "The Devil's Roast" salted espresso martini. NYC pop-ups, in-theater activations, premium LTO. Fashion + film + cocktail culture.
- HangarFour brand integrations: Dos Equis hands-on with Jon Hamm in "Your Friends & Neighbors", Bohemia with Paul Rudd and Jack Black in "Anaconda", PlayStation verbal in "31 Candles", Grey Goose/Heidi Klum in Devil Wears Prada 2
- PMK Entertainment wrapped PaleyFest LA at Dolby Theatre — The Pitt, Emily in Paris, Nobody Wants This, Shrinking, Charlie's Angels 50th anniversary, Michael J. Fox surprise appearance at Shrinking panel. Press: TODAY Show, USA Today, People, Variety, Gold Derby.

SUPER BOWL LX:
- ACC + Pepsi Bay Area Local Eats: immersive festival at Yerba Buena Gardens, Martha Stewart on-site, 7 local restaurants, exceeded 2025 results
- MKG: BÉIS three-day Super Bowl takeover at SF Brewing Co.
- ACC + DKC: bubly x Super Mario Galaxy Movie — Nintendo/Illumination partnership, galaxy flavors, color-changing cans, NASA grand prize, USA Today and Access Daily coverage

COACHELLA 2026:
- MKG + Pink Sparrow: Ed Sheeran x Atlantic Records Old Phone Pub — built from scratch in Ipswich MA then transformed into Coachella speakeasy, Ed played surprise set with Shaboozey and Alex Warren
- MKG + Pink Sparrow + Advisory: Google Pixel Pro 9 XL lounge — Gemini Live AI slushie bar, Evan Ross Katz and Michelle Zauner programming
- MKG + Pink Sparrow: White Lotus Season 3 HBO finale experience in LA — Thai cooking, facials, Full Moon party
- MKG: Sol de Janeiro Casa Cheirosa — first fragrance activation in Coachella history, Gold Award Best Festival Activation (Event Marketer)
- HangarFour: Evolus JeuveauFest — full ARRIVE hotel takeover, 150+ creators, 2M+ social impressions, content 6x above benchmark

MKG ACTIVATIONS:
- Tide Evo pre-launch experiential
- PINK x Frankies pop-up
- Meta International Women's Day (4th annual)
- Cardi B Grow Good Supply bodega debut
- PINK College Tour: Clemson, Alabama, UCLA
- Shopbop Charleston 10-day pop-up (King Street)
- MKG + Sierra: HIMSS and ViVE conference booths

EARNED MEDIA WINS (DKC):
- Babs Costello "Did Your Mother Ever Tell You?" — Good Morning America, Tamron Hall, TODAY Show in one week (HarperCollins debut)
- DKC Sports: FIFA Club World Cup for DAZN

ACC LEADERSHIP AT POSSIBLE CONFERENCE:
- Michael Nyman: NYSE-TV Speaker's Corner interview, "Community is the New Channel" panel, The Drum feature by EIC Gordon Young
- Scott Floyd: The Ad Podcast interview with Dylan Conroy, "Big Game" panel
- Team presence: ADWEEK House, Female Quotient, Possible After Dark, Unplugged Collective Supper Club

PIXLY:
- Minecraft Movie Max launch — 12 creators, 1.18M+ impressions, Jordan Maron 418K+ views
- Game of Thrones: Kingsroad global launch — 6.5M+ views pre-release

NEW BUSINESS (weave in as forward momentum):
- PMK Entertainment signed inaugural LA Jazz Festival (Aug 8-23, 2026, 17 days, 75% free citywide)
- MKG + Play-Doh/Hasbro activation
- DKC + Posadas Hotel Group (Live Aqua, Grand Fiesta Americana)
- DKC + BIG3 basketball (Ice Cube, CBS)
- ACC Advisory + PepsiCo Mango Rush

Write a ~1,200 word newsletter in HTML format. Use <h2> for section headers, <p> for paragraphs, <strong> for emphasis. Make section headers bold cultural statements, not agency names. End with an energizing close that looks forward. Structure your response with these exact delimiters — nothing else before or after:

THEME: [single powerful theme headline]
SUBTHEMES: [sub-theme 1] | [sub-theme 2] | [sub-theme 3]
SUGGESTED: [alt theme 1] | [alt theme 2]
BODY_START
[full newsletter HTML ~1200 words using <h2>, <p>, <strong>, <em> tags]
BODY_END`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const themeMatch = text.match(/^THEME:\s*(.+)$/m);
  const subThemesMatch = text.match(/^SUBTHEMES:\s*(.+)$/m);
  const suggestedMatch = text.match(/^SUGGESTED:\s*(.+)$/m);
  const bodyMatch = text.match(/BODY_START\s*([\s\S]*?)\s*BODY_END/);

  const theme = themeMatch ? themeMatch[1].trim() : "ACC at the Center of Culture";

  const subThemes = subThemesMatch
    ? subThemesMatch[1].split("|").map((s) => s.replace(/^\[|\]$/g, "").trim()).filter(Boolean)
    : ["Film & Entertainment", "The Big Game", "Experiential Everywhere"];

  const suggestedThemes = suggestedMatch
    ? suggestedMatch[1].split("|").map((s) => s.replace(/^\[|\]$/g, "").trim()).filter(Boolean)
    : [];

  // Extract body — handle missing BODY_END (truncated response)
  let body: string;
  if (bodyMatch) {
    body = bodyMatch[1].trim();
  } else if (text.includes("BODY_START")) {
    // BODY_END missing — take everything after BODY_START
    body = text.split("BODY_START")[1].trim();
  } else if (text.includes("<h2>")) {
    // Strip any delimiter lines and use remaining HTML
    body = text.replace(/^(THEME|SUBTHEMES|SUGGESTED):.*$/gm, "").trim();
  } else {
    body = `<p>${text}</p>`;
  }

  return { theme, subThemes, body, suggestedThemes };
}
