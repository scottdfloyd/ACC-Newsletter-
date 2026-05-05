// Framer CMS integration — publishes newsletter content to the ACCGlobalNewsletter Framer site.
// Set FRAMER_API_KEY and FRAMER_COLLECTION_ID in .env once your Framer site is created.

export interface FramerNewsletterItem {
  title: string;
  theme: string;
  subThemes: string;
  body: string;
  month: string;
  year: number;
  publishedAt: string;
}

export interface PublishResult {
  success: boolean;
  itemId?: string;
  pageUrl?: string;
  error?: string;
}

export async function publishToFramer(
  item: FramerNewsletterItem
): Promise<PublishResult> {
  const apiKey = process.env.FRAMER_API_KEY;
  const collectionId = process.env.FRAMER_COLLECTION_ID;

  // Stub mode — returns a preview URL until Framer credentials are configured.
  if (!apiKey || !collectionId) {
    console.log("[Framer] Running in stub mode — no credentials configured.");
    return {
      success: true,
      itemId: `stub-${Date.now()}`,
      pageUrl: `https://accglobalnewsletter.framer.website/${item.month.toLowerCase()}-${item.year}`,
    };
  }

  try {
    const response = await fetch(
      `https://api.framer.com/cms/collections/${collectionId}/items`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fieldData: {
            title: item.title,
            theme: item.theme,
            "sub-themes": item.subThemes,
            body: item.body,
            month: item.month,
            year: item.year,
            "published-at": item.publishedAt,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    const data = await response.json();
    return {
      success: true,
      itemId: data.id,
      pageUrl: `https://accglobalnewsletter.framer.website/${item.month.toLowerCase()}-${item.year}`,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
