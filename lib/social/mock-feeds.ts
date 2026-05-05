export interface SocialPost {
  id: string;
  businessUnit: string;
  platform: "linkedin" | "instagram";
  content: string;
  imageUrl?: string;
  postUrl: string;
  postedAt: string;
}

// Mock social posts representing what would come from real API scraping.
// Replace with live Apify/RapidAPI calls once handles are configured.
export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: "1",
    businessUnit: "HangarFour",
    platform: "linkedin",
    content:
      "Proud to have supported the Pepsi Super Bowl campaign — bringing big ideas to the biggest stage in entertainment. The energy inside SoFi Stadium was electric. #SuperBowl #PepsiHalftime #BrandActivation",
    imageUrl: "/mock/hangarfour-superbowl.jpg",
    postUrl: "https://linkedin.com/posts/hangarfour-superbowl",
    postedAt: "2026-02-10T14:00:00Z",
  },
  {
    id: "2",
    businessUnit: "HangarFour",
    platform: "instagram",
    content:
      "Grammys week and we brought the visuals. @TMobile's artist lounge was a vibe — custom spatial audio, LED tunnels, and moments fans won't forget. 🎵 #Grammys #TMobile #ExperientialMarketing",
    imageUrl: "/mock/hangarfour-grammys.jpg",
    postUrl: "https://instagram.com/p/hangarfour-grammys",
    postedAt: "2026-02-05T18:30:00Z",
  },
  {
    id: "3",
    businessUnit: "Pink Sparrow",
    platform: "linkedin",
    content:
      "Our fabrication team built the Oscar season pop-up for Netflix in just 10 days. From CAD to red carpet — this is what we do. #Oscars #Netflix #SetDesign #ExperientialProduction",
    imageUrl: "/mock/pinksparrow-oscars.jpg",
    postUrl: "https://linkedin.com/posts/pinksparrow-oscars",
    postedAt: "2026-03-08T10:00:00Z",
  },
  {
    id: "4",
    businessUnit: "Pink Sparrow",
    platform: "instagram",
    content:
      "Super Bowl activation for Google — a 10,000 sqft immersive experience in New Orleans. Every surface, every surface a touchpoint. 🏈🔵 #Google #SuperBowl #ExperientialDesign",
    imageUrl: "/mock/pinksparrow-google-sb.jpg",
    postUrl: "https://instagram.com/p/pinksparrow-google-sb",
    postedAt: "2026-02-08T12:00:00Z",
  },
  {
    id: "5",
    businessUnit: "Advisory",
    platform: "linkedin",
    content:
      "Cultural intelligence is a competitive advantage. Our Q1 trend report is out: how the Oscars, Grammys, and Super Bowl are reshaping brand relevance for 2026. Link in bio.",
    postUrl: "https://linkedin.com/posts/advisory-trend-report",
    postedAt: "2026-03-15T09:00:00Z",
  },
  {
    id: "6",
    businessUnit: "Advisory",
    platform: "linkedin",
    content:
      "We partnered with Meta to map the intersection of entertainment culture and social commerce. Spoiler: authenticity wins every time. #Meta #CulturalMarketing #Strategy",
    postUrl: "https://linkedin.com/posts/advisory-meta",
    postedAt: "2026-02-20T11:00:00Z",
  },
  {
    id: "7",
    businessUnit: "Speakeasy",
    platform: "instagram",
    content:
      "Pepsi Zero Sugar + Grammys = our favorite combo of the year. We handled earned media strategy and the moments went viral before the ceremony even started. 🎶 #PepsiZeroSugar #Grammys",
    imageUrl: "/mock/speakeasy-pepsi-grammys.jpg",
    postUrl: "https://instagram.com/p/speakeasy-pepsi-grammys",
    postedAt: "2026-02-04T16:00:00Z",
  },
  {
    id: "8",
    businessUnit: "Speakeasy",
    platform: "linkedin",
    content:
      "Earned media in the attention economy requires cultural fluency. Our team secured 200+ organic placements for T-Mobile's Oscar campaign — no paid amplification. #PRStrategy #OscarSeason",
    postUrl: "https://linkedin.com/posts/speakeasy-oscars-pr",
    postedAt: "2026-03-10T13:00:00Z",
  },
  {
    id: "9",
    businessUnit: "Cavalry",
    platform: "instagram",
    content:
      "Media planning for tentpole moments is an art form. Super Bowl, Grammys, Oscars — we mapped the entire Q1 entertainment calendar for our partners and the results speak for themselves. 📊",
    imageUrl: "/mock/cavalry-media.jpg",
    postUrl: "https://instagram.com/p/cavalry-media",
    postedAt: "2026-03-05T15:00:00Z",
  },
  {
    id: "10",
    businessUnit: "Cavalry",
    platform: "linkedin",
    content:
      "Proud to announce our expanded partnership with Netflix for their 2026 awards season media strategy. From Emmys to Oscars, we've got the full calendar. #Netflix #MediaStrategy",
    postUrl: "https://linkedin.com/posts/cavalry-netflix",
    postedAt: "2026-02-28T10:30:00Z",
  },
  {
    id: "11",
    businessUnit: "AMP Agency",
    platform: "instagram",
    content:
      "Influencer marketing at the Oscars isn't about the red carpet — it's about the 72-hour window before. We executed 50+ creator partnerships for our clients this awards season. 🌟 #InfluencerMarketing",
    imageUrl: "/mock/amp-oscars-influencer.jpg",
    postUrl: "https://instagram.com/p/amp-oscars",
    postedAt: "2026-03-03T14:00:00Z",
  },
  {
    id: "12",
    businessUnit: "AMP Agency",
    platform: "linkedin",
    content:
      "Data-driven creative is not a contradiction. Our Super Bowl spot analysis revealed that emotional storytelling outperformed humor-led ads by 3x in brand recall. #SuperBowlAds #CreativeStrategy",
    postUrl: "https://linkedin.com/posts/amp-superbowl-data",
    postedAt: "2026-02-12T08:00:00Z",
  },
];

export function getPostsByMonth(month: number, year: number): SocialPost[] {
  return MOCK_SOCIAL_POSTS.filter((post) => {
    const date = new Date(post.postedAt);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });
}

export function getAllPosts(): SocialPost[] {
  return MOCK_SOCIAL_POSTS;
}
