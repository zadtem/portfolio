import { NextResponse } from "next/server";
import { getPinterestFallback, type PinterestFallbackItem } from "@/data/pinterest-fallback";

export type PinterestImage = PinterestFallbackItem;

const CACHE_TTL_MS = 60 * 60 * 1000;
const imageCache = new Map<string, { expiresAt: number; items: PinterestImage[] }>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl =
    searchParams.get("rssUrl")?.trim() ||
    searchParams.get("boardUrl")?.trim() ||
    searchParams.get("url")?.trim();

  const info = parsePinterestInfo(rawUrl);
  if (!info) {
    return NextResponse.json({ items: [] }, { status: 400 });
  }

  const { rssUrl, boardUrl, boardSlug } = info;

  // 1. Check in-memory cache
  const cached = imageCache.get(rssUrl);
  if (cached && cached.expiresAt > Date.now() && cached.items.length > 0) {
    return jsonResponse(cached.items, true);
  }

  // 2. Fetch live RSS feed
  let items = await fetchPinterestRssImages(rssUrl);

  // 3. Fallback: Fetch board HTML scraping
  if (!items.length) {
    items = await fetchPinterestBoardImages(boardUrl);
  }

  // 4. Fallback: Pre-bundled curated fallback items for this board
  if (!items.length) {
    items = getPinterestFallback(boardSlug);
  }

  // Cache if we have items
  if (items.length > 0) {
    imageCache.set(rssUrl, {
      expiresAt: Date.now() + CACHE_TTL_MS,
      items
    });
    return jsonResponse(items, true);
  }

  return jsonResponse([], false);
}

function parsePinterestInfo(rawUrl: string | undefined): {
  username: string;
  boardSlug: string;
  rssUrl: string;
  boardUrl: string;
} | null {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
    const hostname = url.hostname.toLowerCase();

    if (!hostname.includes("pinterest.com")) {
      return null;
    }

    const pathParts = url.pathname.split("/").filter(Boolean);
    if (pathParts.length < 2) {
      return null;
    }

    const username = pathParts[0];
    const boardSlug = pathParts[1].replace(/\.rss$/, "");

    if (!username || !boardSlug) {
      return null;
    }

    return {
      username,
      boardSlug,
      rssUrl: `https://www.pinterest.com/${username}/${boardSlug}.rss`,
      boardUrl: `https://www.pinterest.com/${username}/${boardSlug}/`
    };
  } catch {
    return null;
  }
}

async function fetchPinterestRssImages(rssUrl: string): Promise<PinterestImage[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(rssUrl, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache"
      },
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      return [];
    }

    const xml = await response.text();
    return parsePinterestRss(xml);
  } catch {
    clearTimeout(timer);
    return [];
  }
}

async function fetchPinterestBoardImages(boardUrl: string): Promise<PinterestImage[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(boardUrl, {
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
      },
      signal: controller.signal
    });

    clearTimeout(timer);

    if (!response.ok) {
      return [];
    }

    const html = await response.text();
    return parsePinterestBoardImages(html, boardUrl);
  } catch {
    clearTimeout(timer);
    return [];
  }
}

function parsePinterestRss(xml: string): PinterestImage[] {
  const items: PinterestImage[] = [];
  const matches = xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi);

  for (const match of matches) {
    const item = normalizeRssItem(match[1]);
    if (item) {
      items.push(item);
    }
  }

  return items;
}

function normalizeRssItem(itemXml: string): PinterestImage | null {
  const link =
    readXmlTag(itemXml, "link") ||
    readXmlTag(itemXml, "guid") ||
    readXmlAttribute(itemXml, "link", "href") ||
    readXmlAttribute(itemXml, "atom:link", "href");

  const rawTitle = readXmlTag(itemXml, "title");
  const title = rawTitle ? decodeXmlEntities(rawTitle).trim() : "Pinterest board image";

  const description = decodeXmlEntities(
    readXmlTag(itemXml, "description") || readXmlTag(itemXml, "content:encoded")
  );

  let imageUrl = readDescriptionImageUrl(description);

  if (!imageUrl) {
    imageUrl =
      readXmlAttribute(itemXml, "enclosure", "url") ||
      readXmlAttribute(itemXml, "media:content", "url") ||
      readXmlAttribute(itemXml, "media:thumbnail", "url");
  }

  if (!imageUrl) {
    const pinimgMatch = itemXml.match(/https?:\/\/[a-z0-9.-]*pinimg\.com\/[^\s"'<>&]+/i);
    if (pinimgMatch) {
      imageUrl = pinimgMatch[0];
    }
  }

  if (!link || !imageUrl) {
    return null;
  }

  const normalizedImageUrl = normalizePinterestImageUrl(imageUrl);
  if (!normalizedImageUrl) {
    return null;
  }

  return {
    id: link,
    imageUrl: normalizedImageUrl,
    alt: title || "Pinterest board image",
    link
  };
}

function readXmlTag(xml: string, tagName: string): string {
  const match = xml.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeXmlEntities(match[1]).trim() : "";
}

function readXmlAttribute(xml: string, tagName: string, attributeName: string): string {
  const tagMatch = xml.match(new RegExp(`<${tagName}\\b([^>]*)\\/?>`, "i"));
  if (!tagMatch) return "";
  const attrMatch = tagMatch[1].match(new RegExp(`${attributeName}=["']([^"']+)["']`, "i"));
  return attrMatch ? attrMatch[1].trim() : "";
}

function readDescriptionImageUrl(description: string): string {
  return description.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i)?.[1] ?? "";
}

interface PinterestPinData {
  id?: string;
  title?: string;
  description?: string;
  images?: {
    "736x"?: { url: string };
    "474x"?: { url: string };
    "236x"?: { url: string };
    orig?: { url: string };
  };
}

function parsePinterestBoardImages(html: string, boardUrl: string): PinterestImage[] {
  try {
    const propsMatch = html.match(
      /<script id="__PWS_INITIAL_PROPS__" type="application\/json">([\s\S]*?)<\/script>/
    );
    if (propsMatch) {
      const data = JSON.parse(propsMatch[1]);
      const pinsObj = data?.initialReduxState?.pins;
      if (pinsObj && typeof pinsObj === "object") {
        const pins = Object.values(pinsObj) as PinterestPinData[];
        const extracted: PinterestImage[] = [];
        for (const pin of pins) {
          const imgUrl =
            pin?.images?.["736x"]?.url ||
            pin?.images?.["474x"]?.url ||
            pin?.images?.["236x"]?.url ||
            pin?.images?.orig?.url;
          if (imgUrl) {
            const pinId = pin?.id;
            extracted.push({
              id: pinId ? `https://www.pinterest.com/pin/${pinId}/` : imgUrl,
              imageUrl: normalizePinterestImageUrl(imgUrl),
              alt: pin?.description || pin?.title || "Pinterest board image",
              link: pinId ? `https://www.pinterest.com/pin/${pinId}/` : boardUrl
            });
          }
        }
        if (extracted.length > 0) {
          return extracted;
        }
      }
    }
  } catch {
    // Fall back to regex
  }

  const matches = html.matchAll(
    /https:\/\/i\.pinimg\.com\/(?:200x150|200x|236x|474x|736x)\/[a-f0-9/]+\.(?:jpg|jpeg|png|webp)/gi
  );
  const imageUrls = Array.from(matches, ([imageUrl]) => normalizePinterestImageUrl(imageUrl));

  return Array.from(new Set(imageUrls)).map((imageUrl) => ({
    id: imageUrl,
    imageUrl,
    alt: "Pinterest board image",
    link: boardUrl
  }));
}

function normalizePinterestImageUrl(url: string): string {
  if (!url) return "";
  return url
    .replace(/^http:\/\//, "https://")
    .replace(/\/(?:60x60|136x136|170x|200x150|200x|236x|474x)\//, "/736x/")
    .replace(/&amp;/g, "&");
}

function decodeXmlEntities(value = ""): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function jsonResponse(items: PinterestImage[], isSuccess: boolean) {
  return NextResponse.json(
    { items },
    {
      headers: {
        "Cache-Control": isSuccess
          ? "public, s-maxage=86400, stale-while-revalidate=604800"
          : "no-cache, no-store, must-revalidate"
      }
    }
  );
}
