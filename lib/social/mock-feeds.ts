export interface SocialPost {
  id: string;
  businessUnit: string;
  platform: "linkedin" | "instagram";
  content: string;
  imageUrl?: string;
  postUrl: string;
  postedAt: string;
}

// Real ACC business unit content — Q1/Q2 2026
export const MOCK_SOCIAL_POSTS: SocialPost[] = [
  {
    id: "1",
    businessUnit: "MKG",
    platform: "instagram",
    content: "DoorDash kicked off Q1 with a presence at five B2B events — NGA in Las Vegas, Expo West in Anaheim where a life-size DoorDash bag dispensed branded giveaways, Shoptalk, Bar & Restaurant Expo, and International Pizza Expo. Helping DoorDash connect with merchants and grow new partnerships. 🍕",
    postUrl: "https://instagram.com/thisismkg",
    postedAt: "2026-03-15T14:00:00Z",
  },
  {
    id: "2",
    businessUnit: "MKG",
    platform: "instagram",
    content: "We brought BÉIS to the heart of Super Bowl weekend with a three-day takeover at San Francisco Brewing Co. The bar was transformed into an immersive BÉIS hangout where fans, creators, and the community shopped the newest collection, played games, and tapped into the energy of the city's biggest weekend! 🏈",
    postUrl: "https://instagram.com/thisismkg",
    postedAt: "2026-02-08T18:00:00Z",
  },
  {
    id: "3",
    businessUnit: "MKG",
    platform: "instagram",
    content: "We brought Tide Evo to life ahead of its national launch — an interactive playground where attendees could explore, test, and experience Tide firsthand through demos and immersive moments. A buzz-worthy moment before their big debut! ✨",
    postUrl: "https://instagram.com/thisismkg",
    postedAt: "2026-03-20T12:00:00Z",
  },
  {
    id: "4",
    businessUnit: "MKG",
    platform: "instagram",
    content: "The team turned up the heat for the PINK x Frankies 2026 drop! Guests shopped the collection, snapped pics at the photobooth, made keychains, and scored giveaways while soaking up the ultimate girls' trip energy. Sun-soaked and spring break ready! 🌴",
    postUrl: "https://instagram.com/thisismkg",
    postedAt: "2026-03-10T15:00:00Z",
  },
  {
    id: "5",
    businessUnit: "MKG",
    platform: "instagram",
    content: "MKG brought Casa Cheirosa to life at Coachella for Sol de Janeiro — the first-ever fragrance-focused activation in the festival's history. Scent, sound, and self-expression collided. BizBash named it one of the most talked-about brand moments of Coachella 2026. 🌸",
    postUrl: "https://instagram.com/thisismkg",
    postedAt: "2026-04-15T16:00:00Z",
  },
  {
    id: "6",
    businessUnit: "MKG",
    platform: "instagram",
    content: "Shopbop landed in Charleston with a 10-day pop-up on iconic King Street. Custom embroidery, charm-making, and curated fashion IRL. A stylish stop that brought plenty of shopping energy to Charleston! 🛍️",
    postUrl: "https://instagram.com/thisismkg",
    postedAt: "2026-03-25T11:00:00Z",
  },
  {
    id: "7",
    businessUnit: "MKG",
    platform: "instagram",
    content: "Our fourth annual International Women's Day celebration with Meta — bringing together leaders across business, AI, sports, and culture for a day of connection and inspiration. Thoughtful programming, curated conversations, new collaborations. 🌐",
    postUrl: "https://instagram.com/thisismkg",
    postedAt: "2026-03-08T10:00:00Z",
  },
  {
    id: "8",
    businessUnit: "MKG",
    platform: "instagram",
    content: "Grow Good Supply marks the first ever physical debut of Cardi B's haircare line. Designed as a playful bodega meets beauty supply concept — confidence, self-expression, and Grow Good take center stage! 💅",
    postUrl: "https://instagram.com/thisismkg",
    postedAt: "2026-04-01T14:00:00Z",
  },
  {
    id: "9",
    businessUnit: "MKG",
    platform: "instagram",
    content: "The PINK College Tour is live! Clemson, Alabama, and UCLA transformed into high-vibe hangouts filled with interactive moments, exclusive swag, and plenty of grid-worthy photo ops. The girls showed up! 💖",
    postUrl: "https://instagram.com/thisismkg",
    postedAt: "2026-03-18T13:00:00Z",
  },
  {
    id: "10",
    businessUnit: "Pink Sparrow",
    platform: "instagram",
    content: "Proud to have partnered with MKG on the Ed Sheeran x Atlantic Records Old Phone Pub — built from the ground up in Ipswich, MA then transformed into a speakeasy at Coachella Weekend Two. Ed played a surprise set inside. Building dreams into reality. 🎸",
    postUrl: "https://instagram.com/pinksparrow_",
    postedAt: "2026-04-20T12:00:00Z",
  },
  {
    id: "11",
    businessUnit: "Pink Sparrow",
    platform: "instagram",
    content: "Another incredible collab with MKG — the White Lotus Season 3 finale experience in LA for HBO. Thai cooking classes, facials, a full-on Full Moon party. We blurred the lines between fiction and reality. Cast, fans, influencers all lived it. 🌺",
    postUrl: "https://instagram.com/pinksparrow_",
    postedAt: "2026-03-28T15:00:00Z",
  },
  {
    id: "12",
    businessUnit: "Pink Sparrow",
    platform: "instagram",
    content: "Google Pixel Pro 9 XL x Coachella — alongside MKG and ACC Advisory we completed the Google Pixel campaign. Gemini Live AI powered a make-your-own-slushie bar, Pixel Partners Evan Ross Katz and Michelle Zauner of Japanese Breakfast provided star programming. 📱",
    postUrl: "https://instagram.com/pinksparrow_",
    postedAt: "2026-04-18T11:00:00Z",
  },
  {
    id: "13",
    businessUnit: "DKC",
    platform: "instagram",
    content: "Babs Costello — NYT bestselling author and America's Favorite Grandma — just landed a morning show trifecta for her debut children's book 'Did Your Mother Ever Tell You?' Good Morning America, Tamron Hall, and TODAY Show all in one week. HarperCollins. This is what earned media looks like. 📺",
    postUrl: "https://instagram.com/dkcnews",
    postedAt: "2026-04-07T09:00:00Z",
  },
  {
    id: "14",
    businessUnit: "DKC",
    platform: "linkedin",
    content: "DKC Sports hit the pitch across US stadiums handling FIFA Club World Cup communications and on-site programming for DAZN. The beautiful game, at scale. Our footprint in soccer continues to grow alongside Apple/MLS, Manchester City/CFG, US Soccer Legend Jozy Altidore, and NWSL's Bay FC.",
    postUrl: "https://linkedin.com/company/dkc",
    postedAt: "2026-03-15T10:00:00Z",
  },
  {
    id: "15",
    businessUnit: "HangarFour",
    platform: "linkedin",
    content: "Proud of the brand integration work this quarter — Grey Goose in The Devil Wears Prada 2 fronted by Heidi Klum, Dos Equis hands-on with Jon Hamm in Friends & Neighbors, Bohemia with Paul Rudd and Jack Black in Anaconda, PlayStation verbal in 31 Candles. Entertainment marketing at its finest.",
    postUrl: "https://linkedin.com/company/hangarfour",
    postedAt: "2026-04-10T11:00:00Z",
  },
  {
    id: "16",
    businessUnit: "HangarFour",
    platform: "instagram",
    content: "JeuveauFest at Coachella — a full brand takeover of the ARRIVE hotel reimagined as 'Arrive at Jeuveau.' 150+ creators and tastemakers, 50+ Jeuveau injections on-site, 2M+ social impressions, content performing 6x above benchmark engagement. BizBash's most talked-about Coachella brand moment. 💉✨",
    postUrl: "https://instagram.com/hangarfour",
    postedAt: "2026-04-14T13:00:00Z",
  },
  {
    id: "17",
    businessUnit: "PMK Entertainment",
    platform: "linkedin",
    content: "PMK Entertainment wrapped a landmark week at PaleyFest LA — the nation's premier TV and entertainment festival at the Dolby Theatre in Hollywood. The Pitt, Emily in Paris, Nobody Wants This, Shrinking, Charlie's Angels 50th anniversary. Special moment: Michael J. Fox surprise appearance. TODAY Show, USA Today, People, Variety coverage secured.",
    postUrl: "https://linkedin.com/company/pmk-entertainment",
    postedAt: "2026-04-05T10:00:00Z",
  },
  {
    id: "18",
    businessUnit: "ACC (Parent)",
    platform: "linkedin",
    content: "ACC had a significant presence at POSSIBLE this week. Michael Nyman interviewed at Speaker's Corner for NYSE-TV. Scott Floyd interviewed for The Ad Podcast. Michael spoke on 'Community is the New Channel' panel. The Drum feature by EIC Gordon Young published. ACC's voice is in the room at every major industry conversation.",
    postUrl: "https://linkedin.com/company/theacceleration",
    postedAt: "2026-04-22T09:00:00Z",
  },
  {
    id: "19",
    businessUnit: "Pixly",
    platform: "linkedin",
    content: "Pixly and MKG teamed up for the A Minecraft Movie launch on Max — 12 creators across TikTok, Instagram, and YouTube. 1.18M+ impressions, 29.9K engagements, Jordan Maron's IG Reel driving 418K+ views alone. Cross-platform activations at their best.",
    postUrl: "https://linkedin.com/company/pixly.tv",
    postedAt: "2026-04-05T14:00:00Z",
  },
  {
    id: "20",
    businessUnit: "Trailblaze",
    platform: "instagram",
    content: "PMK Entertainment has signed the inaugural LA Jazz Festival — 17 days, Aug 8-23 2026, 75% free citywide concerts across parks and venues culminating at Dockweiler Beach. This is what community-first entertainment looks like. 🎷",
    postUrl: "https://instagram.com/trailblaze.co",
    postedAt: "2026-04-18T10:00:00Z",
  },
  {
    id: "21",
    businessUnit: "ACC (Parent)",
    platform: "instagram",
    content: "ACC helped bring Pepsi's Bay Area Local Eats to life at Super Bowl LX — an immersive festival-style activation spotlighting seven local restaurants at Yerba Buena Gardens. Martha Stewart on-site. Celebrating the chefs, flavors, and communities at the heart of the Bay Area. Exceeded 2025 results. 🍔",
    postUrl: "https://instagram.com/accelerationcc",
    postedAt: "2026-02-10T14:00:00Z",
  },
  {
    id: "22",
    businessUnit: "DKC",
    platform: "instagram",
    content: "ACC + DKC drove mass earned awareness for bubly's biggest partnership to date — the Super Mario Galaxy Movie collab with Nintendo and Illumination. Galaxy-inspired flavors, color-changing cans, NASA grand prize sweepstakes. USA Today and Access Daily coverage. Millennial families, assemble. 🚀",
    postUrl: "https://instagram.com/dkcnews",
    postedAt: "2026-03-20T16:00:00Z",
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
